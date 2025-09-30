package com.kob.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // 自动填充常用的函数
@NoArgsConstructor  // 无参构造函数
@AllArgsConstructor

public class User {
    private Integer id;
    private String username;
    private String password;
}
