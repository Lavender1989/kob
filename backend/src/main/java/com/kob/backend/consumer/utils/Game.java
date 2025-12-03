package com.kob.backend.consumer.utils;

import java.util.Random;

public class Game {
    final private Integer rows, cols, inner_walls_count;
    final private int[][] g;
    final private static int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
    public Game(Integer rows, Integer cols, Integer inner_walls_count) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.g = new int[rows][cols];
    }

    public int[][] getG() {
        return g;
    }

    // 判断创建的地图的连通性
    private boolean checkConnectivity(int sx, int sy, int tx, int ty) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = 1;  // 标记当前位置已走过
        for (int i = 0; i < 4; i ++ ){
            int x = sx + dx[i], y = sy + dy[i];
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && g[x][y] == 0) {
                if (checkConnectivity(x, y, tx, ty)) {
                    g[sx][sy] = 0; //当前栈是sx,sy修改 所以是他们修改回来
                    return true;
                }
            }
        }
        g[sx][sy] = 0;  // 恢复现场(g是全局变量 所有的实例共享一份)
        return false;
    }
    private boolean draw() {  // 画地图
        for (int i = 0; i < this.rows; i ++ ) {
            for (int j = 0; j < this.cols; j ++ ) {
                g[i][j] = 0;  // 0是空地 1是墙
            }
        }
        // 给四周加上墙
        for (int r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.cols - 1] = 1;
        }
        for (int c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = 1;
        }
        // 随机生成障碍物
        Random random = new Random();
        for (int i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (int j = 0; j < 1000; j ++ ) {
                int r = random.nextInt(this.rows);
                int c = random.nextInt(this.cols);
                // 当前位置已有障碍物
                if (g[r][c] == 1 || g[this.rows - 1 - r][this.cols - 1 - c] == 1)
                    continue;
                // 防止覆盖到左上角和右下角
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                    continue;
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = 1;
                break;
            }
        }
        // 创建完成后判断是否连通
        return checkConnectivity(this.cols - 2, 1, 1, this.cols - 2);

    }
    public void createMap() {
        for (int i = 0; i < 1000; i ++ ) {
            if (draw())
                break;
        }
    }
}
