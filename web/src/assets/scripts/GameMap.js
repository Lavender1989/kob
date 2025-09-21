import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        // 由于地图会变化，因此要求游戏里每一个对象都会成比例变
        // 写的时候要使用相对距离
        this.L = 0; // 绝对距离 后续的都是用相对距离 L表示一个单位长度
        this.rows = 13;
        this.cols = 14;
        this.inner_walls_count = 20; // 内部障碍物数
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#3577FF", r: this.rows - 2, c: 1}, this), // 最后一个this表示当前地图的引用
            new Snake({id: 1, color: "#FF7735", r: 1, c: this.cols - 2}, this),
        ];

        

    }

    check_connectivity (g, sx, sy, tx, ty) {
        // 迷宫问题
        if (sx == tx && sy == ty) return true; // 走到终点了 返回true
        g[sx][sy] = true; // 当前位置已经走过 不加这个好像也可以 但是创建的很慢

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1] // 定义一下上下左右的偏移量
        for ( let i = 0; i < 4; i ++ )
        {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true; // 当前没有撞墙且可以走到终点
        }
        return false;
    }

    create_walls() {
        // new Wall(0, 0, this); // 比如在(0,0)创建了一个障碍物
        const g = [];
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];
            for(let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }
        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++)
            {
                let r = parseInt(Math.random() * this.rows); // 求行的随机值
                let c = parseInt(Math.random() * this.cols); // 求列的随机值
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue; // 查看当前位置是否有障碍物
                // 防止覆盖到左上角和右下角
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue;
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;  // 对称放置
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g)); // 检测是否连通之前先复制状态
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) 
            return false;

        for (let r = 0 ; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true;
        
    }

    add_listening_events() {
        this.ctx.canvas.focus();
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === "w") snake0.set_direction(0);
            else if (e.key === "d") snake0.set_direction(1);
            else if (e.key === "s") snake0.set_direction(2);
            else if (e.key === "a") snake0.set_direction(3);
            else if (e.key === "ArrowUp") snake1.set_direction(0);
            else if (e.key === "ArrowRight") snake1.set_direction(1);
            else if (e.key === "ArrowDown") snake1.set_direction(2);
            else if (e.key === "ArrowLeft") snake1.set_direction(3);
        })

    }

    start() {
        for (let i = 0; i < 1000; i ++ ) {
            if (this.create_walls()) break;
        }
        this.add_listening_events();

    }
    update_size() {
        // 取整像素 防止出现缝隙
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {
        // 判断两个对手有没有准备好下一步操作
        for (const snake of this.snakes)
        {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1 ) return false;
        }
        return true;

    }

    next_step() {  // 让两条蛇进入下一回合
        for (const snake of this.snakes){
            snake.next_step();
        }
    }

    check_valid(cell) {
        // 检查目标位置是否合法：没有撞到蛇的身体和障碍物
        for (const wall of this.walls){
            if (wall.r === cell.r && wall.c === cell.c) return false;
        }
        for (const snake of this.snakes) {
            // 这里需要特判一下 当蛇头追逐蛇尾的时候：
            // 1. 如果蛇尾收缩了 下一个格子就可以走
            // 2. 如果蛇尾没有收缩 下一个格子不能走(蛇身增加1)
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) { // 当蛇尾会前进的时候 蛇尾不用判断
                k -- ;
            }
            for (let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
        }
        return true;
    }

    update() {
        this.update_size(); // 每一帧都更新边长
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }
    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if ((i + j) % 2 === 0) {
                    this.ctx.fillStyle = color_even;
                }
                else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(j * this.L, i * this.L, this.L, this.L);
            }
        }
    }
}