import axios from 'axios'
export default {
  install: (app) => {
    const customAxios = axios.create()
    customAxios.interceptors.response.use((response) => {
      return response.data
    })
    app.config.globalProperties.$axios = customAxios
  },
}
