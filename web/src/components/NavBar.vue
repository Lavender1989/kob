<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <!-- <a class="nav-link" aria-current="page" href="/pk/">对战</a> -->
    <router-link class="navbar-brand" :to="{name: 'home'}">King Of Bot</router-link>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">对战</router-link>
            <!-- <a class="nav-link" href="/record/">对局列表</a> -->
        </li>
        <li class="nav-item">
          <router-link :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">对局列表</router-link>
           
        </li>
        <li class="nav-item">
            <!-- <a class="nav-link" href="/ranklist/">排行榜</a> -->
          <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">排行榜</router-link>
        </li>
      </ul>
      <ul class="navbar-nav" v-if="$store.state.user.is_login">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ $store.state.user.username }}  <!-- 如果登录了就显示用户名 -->
          </a>
          <ul class="dropdown-menu">
            <li>
                <router-link class="dropdown-item" :to="{name: 'user_bots_index'}">我的Bot</router-link>
                <!-- <a class="dropdown-item" href="/user/bots/">我的Bot</a> -->
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click="logout">退出</a></li>
          </ul>
        </li>
      </ul>
      <ul class="navbar-nav" v-else>
        <!-- 未登录时显示登录和注册两个按钮 -->
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_login'}" role="button">
            登录
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_register'}" role="button">
            注册
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';   // 实时计算的函数
import { useStore } from 'vuex';
export default {
  name: 'NavBar',
  setup() {
    const store = useStore();
    const route = useRoute();
    let route_name = computed(() => route.name);  // 当前路由的名称
    const logout = () => {
        store.dispatch("logout");
    }
    return { 
        route_name,
        logout,
    };
  }
}
</script>

<style scoped> 
/* style一般需要加上scoped 
作用：在这里写的css会加上一个随机字符串，
使得这个样式不会影响到组件以外的部分*/

</style>