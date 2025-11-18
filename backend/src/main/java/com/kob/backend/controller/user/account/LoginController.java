package com.kob.backend.controller.user.account;

import com.kob.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.util.Map;

@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/user/account/token/")  // 自定义 但是定义完后需要公开化
    public Map<String, String> getToken(@RequestParam Map<String, String> map) throws Exception{
        System.out.println(map);
        String username = map.get("username");
        String password = map.get("password");
        Map<String, String> map2 = loginService.getToken(username, password);
        return loginService.getToken(username, password);
    }

}
