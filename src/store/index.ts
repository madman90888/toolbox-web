import { createStore } from 'vuex'
import { Md5 } from 'ts-md5'
import { reqLogin, reqGetUser, reqLogout, updatePassword } from '@/api'
import { getToken } from '@/api/flare'

const KEY = '1234567890202202'

export default createStore({
  state: {
    userName: '',
    flareToken: ''
  },
  mutations: {
  },
  actions: {
    async login({ state }, user): Promise<boolean> {
      user.password = Md5.hashStr(user.password + KEY)
      const result = await reqLogin(user)
      if (result) {
        state.userName = user.username
        return true
      }
      return false
    },
    // 用户信息
    async getUser({ state }): Promise<boolean> {
      if (state.userName) {
        return true
      }

      const result = await reqGetUser()
      if (result) {
        state.userName = result.message
        return true
      }
      return false
    },
    // 退出
    logout({ state }) {
      state.userName = ''
      reqLogout()
      location.reload()
    },
    async updatePass(context, { oldPass, newPass }): Promise<boolean> {
      const result = await updatePassword(Md5.hashStr(oldPass + KEY), Md5.hashStr(newPass + KEY))
      if (result) {
        return true
      }
      return false
    },
    async getFlareToken({ state }) {
      if (state.flareToken) {
        return state.flareToken
      }
      const res = await getToken()
      if (res) {
        state.flareToken = res.data.token
        return res.data.token
      }
    },
    setTokan({ state }, status): void {
      state.flareToken = status
    },
  },
  modules: {
  }
})
