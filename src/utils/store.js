import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
// baseUrl: 'http://192.168.0.34:8848/api'
const state = {
  user: null,
  baseUrl: apiServer
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  LOG_OUT(state) {
    state.user = null
    Vue.localStorage.set('admin_user', null)
    Vue.localStorage.set('admin_user_invalid', null)
  }
}

const actions = {
  LOG_OUT({ commit }) {
    commit('LOG_OUT')
  },
  SET_USER(state, user) {
    state.commit('SET_USER', user)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters: {},
  actions: actions
})
