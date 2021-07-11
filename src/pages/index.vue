<template>
  <div class="flex items-center bg-color1 h-full flex-col">
    <h2 class="text-color2 text-4xl">Planning Poker v1</h2>
    <div v-if="!initialized">
      <p>Carregando...</p>
    </div>
    <div v-else>
      <p>Para começar, é necessário fazer login:</p>
      <firebase-login v-show="!user"></firebase-login>
      <button
        v-show="user"
        class="px-4 py-2 border-color3 border-2 text-color3"
        @click="logout"
      >
        Sair
      </button>
    </div>
  </div>
</template>

<script setup>
import 'firebase/auth'
import { logout, user, initialized } from '@/composables/firebase'
const USER_ID = 1
// const atlassianAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=OUeIGm5dyIbd3THqIZSGMqPcRKIKgdha&scope=read%3Ajira-user%20read%3Ajira-work%20manage%3Ajira-configuration%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider%20manage%3Ajira-project&redirect_uri=http://localhost:3000/jiraLogin&state=${USER_ID}&response_type=code&prompt=consent`
</script>

<style lang="scss" scoped></style>
