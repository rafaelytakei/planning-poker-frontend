import { createStore } from 'vuex'
import modules from './modules'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

export default createStore({
  modules,
  plugins: [
    createPersistedState({
      key: 'stores',
      paths: ['atlassian'],
      storage: {
        getItem: (key) => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 1 / 24, secure: true }),
        removeItem: (key) => Cookies.remove(key),
      },
    }),
  ],
})
