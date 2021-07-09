<template>
  <router-link to="/test">Change route</router-link>
  <div>Test index Page</div>
  <hello-world />
  <a :href="atlassianAuthUrl" target="_blank"
    ><button>Atlassian API Test</button></a
  >
</template>

<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const USER_ID = 1
    const atlassianAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=OUeIGm5dyIbd3THqIZSGMqPcRKIKgdha&scope=read%3Ajira-user%20read%3Ajira-work%20manage%3Ajira-configuration%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider%20manage%3Ajira-project&redirect_uri=http://localhost:3000/jiraLogin&state=${USER_ID}&response_type=code&prompt=consent`
    const store = useStore()
    console.log(store.state.atlassian.token)
    store.dispatch('atlassian/setToken', 'teste')
    console.log(store.state.atlassian.token)
    return {
      atlassianAuthUrl,
    }
  },
}
</script>

<style lang="scss" scoped></style>
