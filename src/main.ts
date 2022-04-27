import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入全局样式
import '@/assets/css/global.css'
import 'nprogress/nprogress.css'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')

