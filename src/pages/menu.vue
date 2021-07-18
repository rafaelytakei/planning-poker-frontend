<template>
  <div
    v-if="user"
    class="h-full flex flex-col justify-center items-center py-8"
  >
    <h3 class="text-3xl text-color3">Olá {{ user.displayName }}!</h3>
    <base-button @click="createNewGame">Criar nova partida</base-button>
    <base-card
      title="Lista de partidas salvas"
      :loading="loadingGames"
      class="w-1/2 h-full"
    >
      <div v-for="game in games" class="flex justify-between text-color2">
        <span>{{ game.name }}</span>
        <span>Status: Pendente</span>
      </div>
    </base-card>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout } from '~/composables/firebase'
import { createGame, getUserGames } from '~/composables/game'

const router = useRouter()
const loadingGames = ref(true)
const user = ref()
const games = ref([])
onBeforeMount(async () => {
  user.value = await getUser()
  games.value = await getUserGames(user.value.uid)
  loadingGames.value = false
})

const playController = ref(false)
const createNewGame = async () => {
  const newGameId = await createGame(`Jogo de ${user.value.displayName}`)
  router.push({
    path: '/game/edit',
    query: {
      id: newGameId,
    },
  })
}
</script>
<style></style>
