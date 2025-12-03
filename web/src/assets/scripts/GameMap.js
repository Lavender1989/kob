import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent, store) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
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

    create_walls() {
        const g = this.store.state.pk.gamemap;
        for (let r = 0 ; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
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
        this.create_walls();
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