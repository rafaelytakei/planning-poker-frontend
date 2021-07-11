<template>
  <div v-if="user" class="h-full flex flex-col justify-center items-center">
    <h3 class="text-3xl text-color3">Olá {{ user.displayName }}!</h3>
    <base-button @click="createNewGame">Criar nova partida</base-button>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { logout, user } from '~/composables/firebase'

const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
const createNewGame = () => {
  router.push({
    path: '/game/new',
  })
}
</script>
<style></style>
