import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
/**
 * 有token
 * 1.访问的是否登录页
 * 2.跳转主页  放行
 * 无token
 * 1. 是否访问的是白名单页
 * 2. 跳转登录页 放行
 */
router.beforeEach(async (to, from, next) => {
  // 开启滚动条
  NProgress.start()
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      // 暗意：登录了就不会让你访问登录页
      next('/')
    } else {
      // 有token且访问的不是登录页此时已经有token进行下一步操作
      next()
      // 资料信息是可修改的不需要本地存储，根据本身有没有信息资料再去发请求
      if (!store.getters.name) {
        await store.dispatch('user/getUserInfo')
      }
    }
  } else {
    // 无token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  // 关闭进度条
  NProgress.done()
})

// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/ login ? redirect = ${ to.path }`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/ login ? redirect = ${ to.path }`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
