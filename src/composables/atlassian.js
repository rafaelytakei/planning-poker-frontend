import { user } from '~/composables/firebase'
export const authURL = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=OUeIGm5dyIbd3THqIZSGMqPcRKIKgdha&scope=offline_access%20read%3Ajira-user%20read%3Ajira-work%20manage%3Ajira-configuration%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider%20manage%3Ajira-project&redirect_uri=http://localhost:3000/jiraLogin&state=${user.uid}&response_type=code&prompt=consent`
import to from 'await-to-js'
import { $axios } from './axios'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ref } from 'vue'
export const getTokens = async (authCode) => {
  const payload = {
    grant_type: 'authorization_code',
    client_id: 'OUeIGm5dyIbd3THqIZSGMqPcRKIKgdha',
    client_secret:
      'Al-inU3Upz6UC5z7q8Ib_WbejO71zErNR0lGPr-gpvPNICr35i1P7pXn3JQ3vADr',
    code: authCode,
    redirect_uri: 'http://localhost:3000/jiraLogin',
  }
  const [err, res] = await to(
    $axios.post('https://auth.atlassian.com/oauth/token', payload)
  )
  if (err) {
    console.log(err)
    return {}
  }
  return res
}

const refreshTokens = async () => {
  if (!Cookies.get('atlassian_refresh_token')) {
    throw new Error('Error trying to refresh Atlassian token')
  }
  const payload = {
    grant_type: 'refresh_token',
    client_id: 'OUeIGm5dyIbd3THqIZSGMqPcRKIKgdha',
    client_secret:
      'Al-inU3Upz6UC5z7q8Ib_WbejO71zErNR0lGPr-gpvPNICr35i1P7pXn3JQ3vADr',
    refresh_token: Cookies.get('atlassian_refresh_token'),
  }
  const [err, res] = await to(
    $axios.post('https://auth.atlassian.com/oauth/token', payload)
  )
  if (err) {
    throw new Error('Error trying to refresh Atlassian token')
  }
  return res
}

export const isLoggedIn = () => {
  if (
    Cookies.get('atlassian_token') ||
    Cookies.get('atlassian_refresh_token')
  ) {
    return true
  }
  return false
}

export const atlassianTokenExpired = () => {
  if (!Cookies.get('atlassian_token') && Cookies.get('atlassian_refresh_token'))
    return true
  return false
}

export const cloudId = ref(null)

export const setCloudId = (cloudId) => {
  $atlassianApi.defaults.baseURL = `https://api.atlassian.com/ex/jira/${cloudId}/`
}
export const $atlassianApi = axios.create({
  headers: {
    Authorization: `Bearer ${Cookies.get('atlassian_token')}`,
    Accept: 'application/json',
  },
})

$atlassianApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error?.config
    if (error?.response?.status === 401) {
      const newTokens = await refreshTokens()
      Cookies.set('atlassian_token', newTokens.access_token, {
        expires: 1 / 24,
      })
      if (newTokens.refresh_token) {
        Cookies.set('atlassian_refresh_token', newTokens.refresh_token)
      }
      return await $atlassianApi(originalRequest)
    }
  }
)

export const getSites = async () => {
  const [err, res] = await to(
    $axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
      headers: {
        Authorization: `Bearer ${Cookies.get('atlassian_token')}`,
      },
    })
  )
  if (err) {
    if (err.response.status === 401) {
      const newTokens = await refreshTokens()
      Cookies.set('atlassian_token', newTokens.access_token, {
        expires: 1 / 24,
      })
      return await getSites()
    } else {
      console.log(err.response.status)
      throw new Error('Error getting accessible resources')
    }
  }
  return res
}

export const getProjects = async () => {
  const [err, res] = await to($atlassianApi.get('/rest/api/3/project/search'))
  if (err) {
    throw new Error('Error loading projects')
  }
  return res.values
}

export const getIssues = async (projectKey) => {
  const [err, res] = await to(
    $atlassianApi.get('/rest/api/3/search', {
      params: {
        jql: 'project = "MNP" AND sprint = "Sprint 16"',
      },
    })
  )
  if (err) {
    throw new Error('Error loading projects')
  }
  return res
}
