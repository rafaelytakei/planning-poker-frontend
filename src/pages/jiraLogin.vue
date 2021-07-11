<template>
  <LoadingOverlay></LoadingOverlay>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTokens } from '~/composables/atlassian'
import * as Cookies from 'js-cookie'
import { showLoading } from '~/composables/loading'

const route = useRoute()
const router = useRouter()
onMounted(async () => {
  showLoading.value = true
  const tokens = await getTokens(route.query.code)
  console.log(tokens)
  Cookies.set('atlassian_token', tokens.access_token, {
    expires: 1 / 24,
  })
  Cookies.set('atlassian_refresh_token', tokens.refresh_token)
  showLoading.value = false
  router.push({
    path: '/game/new',
  })
})
</script>
