const AC_GAME_OBJECTS = []; // 存储所有的游戏对象

export class AcGameObject { // 方便其他类引入AcGameObject类
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0; // 实现速度 需要用到上一帧和当前帧的时间间隔
        this.has_called_start = false;
    }
    start() { // 只执行一次

    }

    update() { // 每帧执行 除了第一帧

    }

    on_destroy() { // 删除之前执行

    }

    destroy() { // 删除对象
        this.on_destroy();
        for (let i in AC_GAME_OBJECTS) {  // 使用in遍历下标
            const obj = AC_GAME_OBJECTS[i];
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp; // 上一次执行的时刻


const step = timestamp => {
    for (let obj of AC_GAME_OBJECTS) {  // 使用of遍历的是值
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step)  // 利用迭代调用，实现每一帧都执行step
    // 不是传统递归 具有backcal

}

// requestAnimationFrame函数可以传一个回调函数 
// 可以在下一帧浏览器渲染之前执行一遍
requestAnimationFrame(step)