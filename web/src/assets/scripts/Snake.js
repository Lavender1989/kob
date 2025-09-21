import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor (info, gamemap) {
        super();
        
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;  // 可能会用到地图的长度L
        this.cells = [new Cell(info.r, info.c)];  // 存放蛇的身体 cells[0]存放蛇头
        this.next_cell = null; // 下一步的目标位置
        this.speed = 5; // 蛇每秒走5个格子
        this.direction = -1; // -1表示没有指令 0、1、2、3 表示上右下左
        this.status = "idle" // idle表示静止 move表示正在移动 die表示死亡

        this.dr = [-1, 0, 1, 0]; // 四个方向 行的偏移量
        this.dc = [0, 1, 0, -1]; // 四个方向 列的偏移量

        this.step = 0;  // 表示回合数
        this.eps = 1e-2;  // 允许误差

        this.eye_direction = 0; // 左下角的蛇头默认朝上
        if (this.id === 1) this.eye_direction = 2;  // 右上角的蛇头朝下

        this.eye_dx = [
            [-1, 1], // 朝上
            [1, 1], // 朝右
            [1, -1], // 朝下
            [-1, -1], // 朝左(旋转)
        ]  // 蛇眼睛不同方向的x偏移量
        this.eye_dy = [
            [-1, -1], // 朝上
            [-1, 1], // 朝右
            [1, 1], // 朝下
            [1, -1], // 朝左
        ]  // 蛇眼睛不同方向的y偏移量
    }
    start() {

    }

    set_direction(d){ // 可以灵活接收键盘输入或者ai
        this.direction = d;
    }

    check_tail_increasing() {  // 检测当前回合蛇的长度是否增加
        if(this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    next_step() { // 将蛇的状态变为走下一步
        const d = this.direction;
        this.eye_direction = d;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1; // 清空操作
        this.status = "move";
        this.step ++; 

        const k = this.cells.length;
        for ( let i = k; i > 0; i -- ){
            // 不能写this.cells[i] = this.cells[i - 1]; 抛的新球和第二个球是一样的(引用)
            // 注意必须要深层复制 否则引用可能指向多个对象 造成干扰
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        if (!this.gamemap.check_valid(this.next_cell)) { // 下一步操作非法
            this.status = "die";
            return;
        }

    }
    update_move() {
        // this.cells[0].x += this.speed * this.timedelta / 1000;
        const dx = this.next_cell.x - this.cells[0].x; // x轴偏移量
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.eps) { // 说明已经到达目标位置
            this.cells[0] = this.next_cell;  // 添加一个新蛇头
            this.next_cell = null;
            this.status = "idle";
            // 如果当前回合蛇尾巴不变长 应该在最后一个cell和倒数第二个cell重合的时候把最后一个cell给去掉
            if(!this.check_tail_increasing()) this.cells.pop();
        } else {
            const move_distance = this.speed * this.timedelta / 1000; // 每两帧之间走的距离
            this.cells[0].x += dx * move_distance / distance;
            this.cells[0].y += dy * move_distance / distance;
            if(!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += tail_dx * move_distance / distance;
                tail.y += tail_dy * move_distance / distance;
            }
        }
    }

    update() { // 每一帧
        if (this.status === "move") this.update_move();
        this.render();

    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;

        if (this.status === "die") 
        {
            ctx.fillStyle = "white";
        }

        // 枚举蛇的每一个身体
        for (const cell of this.cells){
            ctx.beginPath();
            ctx.arc(cell.x * L , cell.y * L, L / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; i ++ ) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue; // 两个球已经重合
            if (Math.abs(a.x - b.x) < this.eps) {
                // 竖直方向
                ctx.fillRect((a.x - 0.5) * L, Math.min(a.y, b.y) * L, L, Math.abs(a.y - b.y) * L);  // 注意a,b的相对位置
            } 
            if (Math.abs(a.y - b.y) < this.eps) {
                // 水平方向
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5) * L, Math.abs(a.x - b.x) * L, L);
            }
        }

        ctx.fillStyle = "black";
        for ( let i = 0; i < 2; i ++ )
        {
            // 眼睛需要画成圆形
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.25) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.25) * L;
            console.log(eye_x, eye_y);
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}