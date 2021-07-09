<template>
  <div></div>
</template>
<script>
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import * as Cookies from 'js-cookie'
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    if (route.query.code) {
      const payload = {
        grant_type: 'authorization_code',
        client_id: 'OUeIGm5dyIbd3THqIZSGMqPcRKIKgdha',
        client_secret:
          'Al-inU3Upz6UC5z7q8Ib_WbejO71zErNR0lGPr-gpvPNICr35i1P7pXn3JQ3vADr',
        code: route.query.code,
        redirect_uri: 'http://localhost:3000',
      }
      axios
        .post(`https://auth.atlassian.com/oauth/token`, payload, {
          headers: {
            'Content-type': 'application/json',
          },
        })
        .then((res) => {
          // console.log(res)
          Cookies.set('atlassian_token', res.data.access_token, {
            expires: 1 / 24,
            secure: true,
          })
          router.push({
            path: '/requests',
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
}
</script>
