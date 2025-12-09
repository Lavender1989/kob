package com.kob.botrunningsystem.service.impl.utils;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BotPool extends Thread {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();
    private final Queue<Bot> bots = new LinkedList<>();

    public void addBot(Integer userID, String botCode, String input) {
        lock.lock();
        try {
            bots.add(new Bot(userID, botCode, input));
            condition.signalAll();
        } finally {
          lock.unlock();
        }
    }

    private void consume(Bot bot) {
        // 当前只实现java代码  joor动态编译一个字符串的java代码
        // 为了防止用户的代码死循环 采用一个线程控制（超时自动断）
        Consumer consumer = new Consumer();
        consumer.startTimeout(2000, bot);  // 之前的操作是等待5s 平均分配每个bot可以执行2s
    }

    @Override
    public void run() {
        while (true) {
            lock.lock();
            if (bots.isEmpty()) {
                try {
                    condition.await();  // 让当前的线程被阻塞 直到被唤醒或这个线程中断为止
                    // 唤醒：另一个线程执行signal或signalAll
                    // 包含一个锁释放的操作
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    lock.unlock();
                    break;
                }
            } else {
                Bot bot = bots.remove();
                lock.unlock();
                consume(bot); // 执行比较慢 需要放在解锁后 读写操作结束后不需要锁住 应提前释放

            }
        }
    }
}
