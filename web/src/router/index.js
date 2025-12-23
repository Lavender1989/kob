import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '@/views/pk/PkIndexView.vue'
import RecordIndexView from '@/views/record/RecordIndexView.vue'
import RecordContentView from '@/views/record/RecordContentView.vue'        
import RanklistIndexView from '@/views/ranklist/RanklistIndexView.vue'
import UserBotIndexView from '@/views/user/bots/UserBotIndexView.vue'
import NotFound from '@/views/error/NotFound.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'
import store from '@/store'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    redirect: '/pk/',
    meta: {
      requestAuth: true,
    }
  },
  { 
    path: '/pk/', 
    name: 'pk_index', 
    component: PkIndexView,
    meta: {
      requestAuth: true,
    }
  },  // 当前写的路径都是相对路径(域名后的路径)
  { 
    path: '/record/', 
    name: 'record_index', 
    component: RecordIndexView,
    meta: {
      requestAuth: true,
    }
  },
  { 
    path: '/record/:recordId', 
    name: 'record_content', 
    component: RecordContentView,
    meta: {
      requestAuth: true,
    }
  },
  { 
    path: '/ranklist/', 
    name: 'ranklist_index', 
    component: RanklistIndexView,
    meta: {
      requestAuth: true,
    }
  },
  { 
    path: '/user/bots/', 
    name: 'user_bots_index', 
    component: UserBotIndexView,
    meta: {
      requestAuth: true,
    }
  },
  { 
    path: '/user/account/login/', 
    name: 'user_account_login', 
    component: UserAccountLoginView,
    meta: {
      requestAuth: false,
    }
  },
  { 
    path: '/user/account/register/', 
    name: 'user_account_register', 
    component: UserAccountRegisterView,
    meta: {
      requestAuth: false,
    }
  },
  { path: '/404/', 
    name: '404', 
    component: NotFound, 
    meta: {
      requestAuth: false,
    } 
  },
  { path: '/:catchAll(.*)', name: 'not_found', redirect: '/404/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 每次通过router进入某个页面之前都需要调用这个函数
  // to: 跳转到哪个页面
  // from: 从哪个页面跳转过来
  // next: 页面要不要执行下一步操作
  // 每次打开一个页面都判断一下是否需要登录 如果需要的话就跳转到登录页面
  if (to.meta.requestAuth && !store.state.user.is_login) {
    next({ name: 'user_account_login' });
  } else {
    next(); // 否则直接跳转到默认页面
  }
})

export default router
