import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 自定义指令
import * as directives from '@/directives/index'
// 批量注册指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// 批量注册组件
import ComponentPlugin from '@/components/index'
Vue.use(ComponentPlugin)
import clickbtn from '@/mixin'
Vue.mixin(clickbtn)
// 按需引入全局注册echarts
import echarts from '@/utils/plugins.js'
Vue.use(echarts)
import i18n from '@/lang/index.js'
// 固定写法 支i18n开发模式使用实例的方法
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// 默认中文locale是英文
// Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
