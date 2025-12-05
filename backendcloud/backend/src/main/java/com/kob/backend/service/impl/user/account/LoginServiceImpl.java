package com.kob.backend.service.impl.user.account;

import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.account.LoginService;
import com.kob.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.net.Authenticator;
import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Map<String, String> getToken(String username, String password) throws Exception {
        Map<String, String> map = new HashMap<>();
        // 传入用户名和密码 需要先封装一下(数据库中存储不是明文)
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);
//        System.out.println("已运行");

        // 将封装好的authenticationToken进行验证，判断是否合法，非法会自动报异常
        try {
//            System.out.println("开始自动验证");
            Authentication authenticate = authenticationManager.authenticate(authenticationToken);  // 登录失败会自动处理
            // 若合法，则将其取出并赋予用户UserDetailsImpl类中的各种属性，形成loginUser
            UserDetailsImpl loginUser = (UserDetailsImpl) authenticate.getPrincipal();
            // 单独取loginUser中的用户信息 用于生成JWT-token
            User user = loginUser.getUser();
            String jwt = JwtUtil.createJWT(user.getId().toString());
//            System.out.println("已经生成好jwt_token了");
            // 将生成的jwt-token传回controller层
            map.put("error_message", "success");
            map.put("token", jwt);
//            System.out.println("已经返回了map");
            return map;
        } catch (Exception e) {
            map.put("error_message", "账号不存在，请先注册一个账号");
            return map;
        }
    }
}
