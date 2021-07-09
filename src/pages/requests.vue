<template>
  <div>Auth Token: {{ authToken }}</div>
</template>
<script>
import * as Cookies from 'js-cookie'
import { inject, onMounted } from 'vue'
import to from 'await-to-js'

export default {
  setup() {
    const authToken = Cookies.get('atlassian_token')
    const $axios = inject('$axios')
    onMounted(async () => {
      const [err, res] = await to(
        $axios.get(
          'https://api.atlassian.com/oauth/token/accessible-resources',
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
      )
      if (err) {
        console.log(err)
        return
      }
      console.log(res)
    })

    return { authToken }
  },
}
</script>
