<template>
  <div>
    <div>Bot昵称：{{bot_name}}</div>
    <div>Bot战力：{{bot_rating}}</div>
  </div>

  <router-view></router-view>
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';  // 定义变量导入
export default {
  name: 'App',
  setup: () => {
    let bot_name = ref("");  // 定义bot昵称
    let bot_rating = ref(""); // 定义bot战力

    // 定义ajax请求(输入后端链接)
    $.ajax({
      url: "http://127.0.0.1:3000/pk/getbotinfo/",
      type: "get",
      success: resp => {
        console.log(resp); // 输出查看获取到的
        bot_name.value = resp.name;
        bot_rating.value = resp.rating;
      }
    }
    )
    return {
      bot_name,
      bot_rating
    }
  }
}
</script>


<style>
body{
  background-image: url('assets/background.png');
  background-size: cover; /* 背景图铺满 */
}
</style>
