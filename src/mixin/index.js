// 实现页面下按钮的权限控制效果
/**
 * 采用一个新的技术 mixin(混入)来让所有的组件可以拥有一个公共的方法
 * 用户登录后的roles中的point标识
 * 操作权限按钮有唯一标识是权限设置中的标识
 * 如果哦points有此标识显示按钮(可以点击),没有就隐藏(不能点击)
 * 用户标识是在登录人资料中信息====》存储到了vuex
 */
import store from '@/store'
export default {
  methods: {
    /**
     * key标识权限的唯一标识code是字符串
     */
    clickbtn (key) {
      const { userInfo } = store.state.user
      // 退出时会出现异常因为修改了权限退出之后vuex会响应数据驱动视图,更新页面，退出===》userInfo为空
      // 复现：在员工管理页面退出登录时（当前页面调用了mixin的全局方法）；这时候权限点数据已被清空，vuex中的数据是响应的，当清空之后员工控制会刷新页面，刷完退出之后用户信息是空的,虽然不影响功能,可以用问号?加在roles字母后面,避免报错所以在获取时出现异常
      if (userInfo.roles?.points && userInfo.roles.points > 0) {
        // 有point标识开启匹配返回的是一个布尔值
        return userInfo.roles.points.some(item => item === key)
      }
      // 无point标识
      return false
    }
  }
}

