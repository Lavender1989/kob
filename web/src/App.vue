<template>
  <NavBar> </NavBar> <!-- 替换之前的占位符 -->
  <router-view></router-view>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
/* 旧版本使用
import NavBar from './components/NavBar.vue'
*/
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap"
export default {
  components: {
    NavBar
  }
}
</script>


<style>
body{
  background-image: url('assets/images/background.png');
  background-size: cover; /* 背景图铺满 */
}
</style>
