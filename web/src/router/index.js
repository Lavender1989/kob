import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '@/views/pk/PkIndexView.vue'
import RecordIndexView from '@/views/record/RecordIndexView.vue'
import RanklistIndexView from '@/views/ranklist/RanklistIndexView.vue'
import UserBotIndexView from '@/views/user/bots/UserBotIndexView.vue'
import NotFound from '@/views/error/NotFound.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'


const routes = [
  { path: '/', name: 'home', redirect: '/pk/' },
  { path: '/pk/', name: 'pk_index', component: PkIndexView },  // 当前写的路径都是相对路径(域名后的路径)
  { path: '/record/', name: 'record_index', component: RecordIndexView },
  { path: '/ranklist/', name: 'ranklist_index', component: RanklistIndexView },
  { path: '/user/bots/', name: 'user_bots_index', component: UserBotIndexView },
  { path: '/user/account/login/', name: 'user_account_login', component: UserAccountLoginView },
  { path: '/user/account/register/', name: 'user_account_register', component: UserAccountRegisterView },
  { path: '/404/', name: '404', component: NotFound },
  { path: '/:catchAll(.*)', name: 'not_found', redirect: '/404/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
