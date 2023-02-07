import { login, getUserInfo, getDetailUserInfo } from '@/api/user'
import { setToken, getToken, removeToken, setTimestamp } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUserInfo() {
    state.userInfo = {}
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const res = await login(userInfo)
    commit('setToken', res)
    setTimestamp()
  },
  async getUserInfo({ commit }, userInfo) {
    const res = await getUserInfo()
    const res1 = await getDetailUserInfo(res.userId)
    commit('setUserInfo', { ...res, ...res1 })
  },
  logout(store) {
    store.commit('removeToken')
    store.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

