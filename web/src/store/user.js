import $ from 'jquery'

export default {
    state: {
        id: "",
        username: "",
        photo: "",
        token: "", // jwt token
        is_login: false,
        pulling_info: true, // 是否正在从云端拉取信息
    },
    getters: {
    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.photo = "";
            state.token = "";
            state.is_login = false; 
        },
        updatePullinfInfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://127.0.0.1:3000/user/account/token/",
                type: "POST",
                data: {
                    username: data.username,
                    password: data.password,
                },
                dataType: "json",  // 告诉 jQuery 后端返回 JSON
                success(resp) {
                    if (resp.error_message === "success") {
                        localStorage.setItem("jwt_token", resp.token);
                        // error_message,token都是后端定义的
                        context.commit("updateToken", resp.token);  
                        // 调用mutations函数要用commit和字符串
                        data.success(resp);  // 不用忘记加上 回调函数
                    } else {
                        data.error(resp);
                        // 这里的success和error都是前端定义的(store.dispatch)
                    }     
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        getinfo(context, data) {
            $.ajax({
                url: "http://127.0.0.1:3000/user/account/info/",
                type: "GET",
                headers: {
                    "Authorization": "Bearer " + context.state.token,
                },
                dataType: "json",  // 告诉 jQuery 后端返回 JSON
                success(resp) {
                    console.log('Getinfo API response:', resp);
                    if (resp.error_message === "success") {
                        context.commit("updateUser", {
                            ...resp,   // 展开运算符，将resp中的所有属性都复制到user中
                            is_login: true,
                        });
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        logout(context) {
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }   
    },
    modules: {
    }
}