import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "main" */ '../views/Home.vue'),
    children: [
      { path: '', name: 'Welcome', component: () => import(/* webpackChunkName: "main" */  '@/views/Welcome.vue') },
      {
        path: '/zone',
        name: 'Zone',
        meta: { title: '域名列表', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/Zone.vue')
      },
      {
        path: '/zoneAll',
        name: 'ZoneAll',
        meta: { title: '域名HTTPS状态', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/ZoneAll.vue')
      },
      {
        path: '/zone/batch',
        name: 'ZoneBatch',
        meta: { title: '域名设置', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/ZoneBatch.vue')
      },
      {
        path: '/dns',
        name: 'Dns',
        meta: { title: 'DNS解析', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/Dns.vue')
      },
      {
        path: '/flare/setting',
        name: 'FlareSetting',
        meta: { title: 'CloudFlare令牌设置' },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/FlareSetting.vue')
      },
      {
        path: '/file',
        name: 'File',
        component: () => import(/* webpackChunkName: "main" */ '@/views/extra/File.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '用户登录' },
    component: () => import(/* webpackChunkName: "main" */ '@/views/user/Login.vue')
  }, {
    path: '/m',
    name: 'Msg',
    meta: { title: '创建留言' },
    component: () => import(/* webpackChunkName: "main" */ '@/views/extra/Board.vue')
  },
  {
    path: '/m/:m',
    name: 'Message',
    meta: { title: '留言板' },
    component: () => import(/* webpackChunkName: "main" */ '@/views/extra/Message.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: { title: '错误页面' },
    component: () => import(/* webpackChunkName: "main" */ '@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

// 登录验证
router.beforeEach(async to => {
  // 标题设置
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  if (to.path === '/m' || /^\/m\/.+/.test(to.path)) {
    return
  }
  // 去登录页直接放行
  if (to.path === '/login') {
    if (store.state.userName) {
      return '/'
    }
    return
  }

  // 未获取到用户信息
  if (!(await store.dispatch('getUser'))) {
    return '/login'
  }
  
  // 令牌
  if (to.meta.isFlareToken) {
    if (!(await store.dispatch('getFlareToken'))) {
      return '/flare/setting?is=no'
    }
  }
  
})

export default router
