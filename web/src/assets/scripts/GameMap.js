import { AcGameObject } from "./AcGameObject";
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
        this.cols = 13;
        this.inner_walls_count = 20; // 内部障碍物数
        this.walls = [];

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
                if (g[r][c] || g[c][r]) continue; // 查看当前位置是否有障碍物
                // 防止覆盖到左上角和右下角
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue;
                g[r][c] = g[c][r] = true;  // 对称放置
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

    start() {
        for (let i = 0; i < 1000; i ++ ) {
            if (this.create_walls()) break;
        }

    }
    update_size() {
        // 取整像素 防止出现缝隙
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }
    update() {
        this.update_size(); // 每一帧都更新边长
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