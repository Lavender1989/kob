<template>
    <ContenField> 
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="login">  <!-- 阻止表单默认提交行为, 页面不会刷新或跳转 -->
                    <div class="mb-3">
                    <label for="username" class="form-label">用户名</label>
                    <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                    <label for="password" class="form-label">密码</label>
                    <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                    </div>
                    <div class="error-message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">提交</button>
                </form>
            </div>
        </div>
    </ContenField>
</template>

<script>
import ContenField from '@/components/ContentField.vue'
import { useStore } from 'vuex'
import { ref } from 'vue'
import router from '@/router/index'

export default {
  components: {
    ContenField
  },
  setup() {
    const store = useStore();
    let username = ref("");
    let password = ref("");
    let error_message = ref("");

    // 定义一个触发函数 如果点击了就返回
    const login = () => {
        error_message.value = "";
        store.dispatch("login", {
            username: username.value,
            password: password.value,
            success() {
                store.dispatch("getinfo", {
                    success() {
                        router.push({ name: "home" });
                        console.log(store.state.user);
                    },
                });
            },
            error() {
                error_message.value = "用户名或密码错误";
            }
        })
    }
    return {
        username,
        password,
        error_message,
        login,
    }

  }
}
</script>

<style scoped>
button {
    width: 100%;
}
div.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}
</style>