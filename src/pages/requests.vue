<template>
  <div>Auth Token: {{ authToken }}</div>
</template>
<script setup>
import * as Cookies from 'js-cookie'
import { inject, onMounted } from 'vue'
import to from 'await-to-js'
import { $axios } from '~/composables/axios'

const authToken = Cookies.get('atlassian_token')
onMounted(async () => {
  const [err, res] = await to(
    $axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
  )
  if (err) {
    console.log(err)
    return
  }
  console.log(res)
})
</script>
