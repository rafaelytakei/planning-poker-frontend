<template>
  <div v-if="!showTaskImporter" class="h-full flex flex-col">
    <h1 class="text-3xl text-center text-color3">Nova Partida</h1>
    <a v-if="!atlassianLoggedIn" :href="authURL" target="_blank"
      ><base-button>Integração JIRA</base-button></a
    >
    <div v-else>
      <base-button @click="showTaskImporter = true"
        >Importar tarefas do JIRA</base-button
      >
    </div>
    <base-card title="Lista de rodadas"> Testando </base-card>
  </div>
  <div v-else>
    <atlassian-task-importer></atlassian-task-importer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { isLoggedIn, authURL } from '~/composables/atlassian'
import { getGameInfo } from '~/composables/game'
const showTaskImporter = ref(false)
const atlassianLoggedIn = isLoggedIn()
const route = useRoute()
onMounted(async () => {
  const gameInfo = await getGameInfo(route.query.id)
  console.log(gameInfo.data())
})
</script>
