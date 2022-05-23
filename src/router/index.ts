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
        path: '/domain',
        name: 'Domain',
        meta: { title: '邀请码列表' },
        component: () => import(/* webpackChunkName: "invitation" */ '@/views/invitation/domain/DomainList.vue')
      },
      {
        path: '/group',
        name: 'Group',
        meta: { title: '小组管理' },
        component: () => import(/* webpackChunkName: "invitation" */ '@/views/invitation/group/GroupList.vue')
      },
      {
        path: '/statisPage',
        name: 'StatisPage',
        meta: { title: '静态页列表' },
        component: () => import(/* webpackChunkName: "invitation" */ '@/views/invitation/PageList.vue')
      },
      {
        path: '/indexSetting',
        name: 'IndexSetting',
        meta: { title: '防爬配置' },
        component: () => import(/* webpackChunkName: "invitation" */ '@/views/invitation/IndexSetting.vue')
      },
      {
        path: '/zone',
        name: 'Zone',
        meta: { title: '域名列表', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/zone/ZoneList.vue')
      },
      {
        path: '/zoneAll',
        name: 'ZoneAll',
        meta: { title: '域名HTTPS状态', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/zone/ZoneAll.vue')
      },
      {
        path: '/zone/batch',
        name: 'ZoneBatch',
        meta: { title: '域名设置', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/zone/ZoneBatch.vue')
      },
      {
        path: '/dns',
        name: 'Dns',
        meta: { title: 'DNS解析', isFlareToken: true },
        component: () => import(/* webpackChunkName: "flare" */ '@/views/flare/dns/DnsSet.vue')
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
  } else {
    document.title = '管理后台'
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
