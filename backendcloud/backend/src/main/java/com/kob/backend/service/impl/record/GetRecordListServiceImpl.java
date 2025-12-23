package com.kob.backend.service.impl.record;

import com.alibaba.fastjson2.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.kob.backend.mapper.RecordMapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.Record;
import com.kob.backend.pojo.User;
import com.kob.backend.service.record.GetRecordListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@Service
public class GetRecordListServiceImpl implements GetRecordListService {
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private UserMapper userMapper;

    @Override
    public JSONObject getList(Integer page) {
        IPage<Record> recordIPage = new Page<>(page, 10);
        QueryWrapper<Record> queryWrapper = new QueryWrapper<>();
        // 按照时间降序
        queryWrapper.orderByDesc("id");   // 可以用id排序
        // 先按照id排序 排完序后返回第page页的内容
        List<Record> records = recordMapper.selectPage(recordIPage, queryWrapper).getRecords();
        // 返回结果包括对战的双方是谁/头像/用户名/对战结果/对局时间（后两项已经存在record表）
        JSONObject resp = new JSONObject();
        List<JSONObject> items = new LinkedList<>();
        for (Record record: records) {
            User userA = userMapper.selectById(record.getAId());
            User userB = userMapper.selectById(record.getBId());
            JSONObject item = new JSONObject();
            item.put("a_photo", userA.getPhoto());
            item.put("a_username", userA.getUsername());
            item.put("b_photo", userB.getPhoto());
            item.put("b_username", userB.getUsername());
            String result = "平局";
            if ("A".equals(record.getLoser())) result = "B胜";
            else if ("B".equals(record.getLoser())) result = "A胜";
            item.put("result", result);
            item.put("record", record);
            items.add(item);
        }

        resp.put("record", items);
        resp.put("record_count", recordMapper.selectCount(null));

        return resp;
    }
}
