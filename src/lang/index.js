// 新建一个多语言的实例化文件

import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n'// 引入国际化的插件包
Vue.use(VueI18n)// 全局注册国际化包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
// 引入自定义中文包
import customZH from './zh'
// 引入自定义英文包
import customEN from './en'
// 引入cookie ====>获取
import Cookie from 'js-cookie'
// 创建国际化插件的实例
const i18n = new VueI18n({
  // 指定语言类型 zh表示中文  en表示英文  字符串
  // locale指定的值和要messages对象中定义的语言包key保持一致
  // 确定语言模式===》找对应的语言包===》根据参数key去找对应的内容实现多语言化
  // locale: 'zh',//不能写死
  locale: Cookie.get('lang') || 'zh',
  // 将elementUI语言包加入到插件语言数据里
  messages: {
    // 英文环境下的语言数据
    en: {
      ...elementEN,
      ...customEN // 将自定义英文包加入
    },
    // 中文环境下的语言数据
    zh: {
      ...elementZH,
      ...customZH // 将自定义英文包加入
    }
  }
})
export default i18n
