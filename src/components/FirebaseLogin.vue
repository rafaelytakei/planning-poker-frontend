<template>
  <div>
    <div id="auth-container"></div>
  </div>
</template>

<script setup>
import { firebase } from '../composables/firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { onMounted } from 'vue'
import { showLoading } from '~/composables/loading'

onMounted(() => {
  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth())
  const firebaseUiConfig = {
    signInSuccessUrl: '/menu',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    signInFlow: 'popup',
    callbacks: {
      uiShown: () => {
        showLoading.value = false
      },
    },
  }
  ui.start('#auth-container', firebaseUiConfig)
})
</script>
