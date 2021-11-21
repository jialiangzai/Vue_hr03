import { constantRoutes } from '@/router'
export default {
  // 图标 ===静态 + 动态可访问的(权限路由)
  namespaced: true,
  state: {
    menuList: []
  },
  mutations: {
    setmenuList (state, asyncData) {
      state.menuList = [...constantRoutes, ...asyncData]
    }
  }

}
