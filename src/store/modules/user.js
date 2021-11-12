
// cookie存储
import * as auth from '@/utils/auth'
// 后台调用api
import { login } from '@/api/user'
import { getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    // token
    token: auth.getToken() || null,
    // 个人信息资料
    userInfo: {}
  },
  mutations: {
    // 同步业务逻辑
    // 存储
    setToken (state, token) {
      state.token = token
      auth.setToken(token)
    },
    // 删除
    delToken (state) {
      state.token = null
      auth.removeToken()
    },
    // 存储用户信息资料
    setUserInfo (state, payload) {
      state.userInfo = payload
    },
    // 删除
    reomveUserInfo (state, payload) {
      state.userInfo = {}
    }
  },
  actions: {
    // 异步的请求接口去获取token
    /**
     *
     * @param {*} param0
     * @param {*} formd 调用接口传递的参数 手机号和密码
     */
    async getTokenAction ({ commit }, formd) {
      const token = await login(formd)
      commit('setToken', token)
    },
    // 登录后获取个人用户信息资料
    async getUserInfo ({ commit }) {
      const res = await getUserInfo()
      // 头像
      const photo = await getUserDetailById(res.userId)
      // console.log(photo)
      // commit('setUserInfo', res)
      commit('setUserInfo', { ...res, ...photo })
      return res
    },
    // 后端没有退出接口所以要做vuex操作是异步的因为删除token和userInfo
    logout ({ commit }) {
      commit('delToken')
      commit('reomveUserInfo')
    }
  }
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

