package com.kob.backend.consumer;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.kob.backend.consumer.utils.Game;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;  // 线程安全的哈希表

import java.util.concurrent.CopyOnWriteArraySet;

@Component
//和controller中的PostMapping类似 映射到某个链接 也是使用JWT验证
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾 否则会报异常
public class WebSocketServer {

    // 静态变量可以使得所有实例可见（相当于所有实例的全局变量）
    final private static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    final private static CopyOnWriteArraySet<User> matchpool = new CopyOnWriteArraySet<>();  // 匹配池也需要线程安全

    private User user;
    //需要自己实现一个函数来完成从后端向前端发信息
    private Session session = null;  // 和http不一样 是websocket中的一个包
    // 每个链接使用session维护
    private static UserMapper userMapper;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        // 建立连接自动触发
        this.session = session;
        System.out.println("connected!");
        token = URLDecoder.decode(token, String.valueOf(StandardCharsets.UTF_8));
        Integer userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);  // 获取用户

        if (this.user != null) {
            users.put(userId, this); // 存入
            System.out.println(users);
        } else {
            this.session.close();  // 否则关闭连接
        }
    }

    @OnClose  // onClose不需要再手动关闭连接，应该OnClose回调方法 session状态被标记为CLOSED
    public void onClose() {
        // 关闭链接
        System.out.println("disconnected!");
        // 删掉存储的用户
        if (this.user != null) {
            users.remove(this.user.getId());
            matchpool.remove(this.user);
        }
    }

    private void startMatching() {
        System.out.println("start matching!");
        matchpool.add(this.user);

        // 多线程 可能会有并发问题 可以写一个while循环
        // 当前实现简单逻辑 后续会替换成微服务
        while (matchpool.size() >= 2 ) {
            Iterator<User> it = matchpool.iterator();
            User a = it.next(), b = it.next();
            matchpool.remove(a);
            matchpool.remove(b);
            Game game = new Game(13, 14, 20);
            game.createMap();

            JSONObject respA = new JSONObject();
            respA.put("event", "start-matching");
            respA.put("opponent_username", b.getUsername());
            respA.put("opponent_photo", b.getPhoto());
            respA.put("gamemap", game.getG());
            users.get(a.getId()).sendMessage(respA.toJSONString()); // 获取A的链接向前端发送信息

            JSONObject respB = new JSONObject();
            respB.put("event", "start-matching");
            respB.put("opponent_username", a.getUsername());
            respB.put("opponent_photo", a.getPhoto());
            respB.put("gamemap", game.getG());
            users.get(b.getId()).sendMessage(respB.toJSONString()); // 获取B的链接向前端发送信息
        }
    }
    private void stopMatching() {
        System.out.println("stop matching!");
        matchpool.remove(this.user);
    }

    @OnMessage
    public void onMessage(String message, Session session) {  // 把message当作路由
        // 从Client接收消息（最常用：前端->后端发送信息，写所有逻辑）
        System.out.println("receive message!");
        JSONObject data = JSONObject.parseObject(message); // 解析出前端发送信息
        String event = data.getString("event");
        if ("start-matching".equals(event)) {
            startMatching();
        } else if ("stop-matching".equals(event)) {
            stopMatching();
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    public void sendMessage(String message) {
        // 异步通信过程 加一个锁
        synchronized (this.session) {  // 忽略警告
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}