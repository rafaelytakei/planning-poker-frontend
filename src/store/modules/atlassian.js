export const state = () => ({
  token: '',
})

export const getters = {
  getterValue: (state) => {
    return state.value
  },
}

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
}

export const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
}

export const persist = true
