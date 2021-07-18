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
    <base-card title="Lista de rodadas" class="flex flex-col">
      <draggable :list="rounds" item-key="id" @change="handleRoundDrag">
        <template #item="{ element }">
          <div>{{ element.name }}</div>
        </template>
      </draggable>
    </base-card>
  </div>
  <div v-else>
    <atlassian-task-importer></atlassian-task-importer>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isLoggedIn, authURL } from '~/composables/atlassian'
import { getUser } from '~/composables/firebase'
import { changeRoundsOrder, db, getGameInfo } from '~/composables/game'
import Draggable from 'vuedraggable'
const showTaskImporter = ref(false)
const atlassianLoggedIn = isLoggedIn()
const route = useRoute()
const router = useRouter()
const isUserAGameAdmin = async (gameInfo) => {
  const user = await getUser()
  if (gameInfo.admins.includes(user.uid)) return true
  return false
}
const gameInfo = ref({})
const rounds = reactive([])
onMounted(async () => {
  gameInfo.value = await getGameInfo(route.query.id)
  const userIsAdmin = await isUserAGameAdmin(gameInfo.value)
  if (!userIsAdmin) {
    router.push({
      path: '/menu?err=401',
    })
  }
  // initRounds(gameInfo)
})
const sortByOrder = (roundA, roundB) => {
  if (roundA.order < roundB.order) return -1
  if (roundA.order > roundB.order) return 1
  return 0
}
const updateRounds = (roundsInfo) => {
  rounds.splice(0, rounds.length)
  for (const [id, value] of Object.entries(roundsInfo)) {
    rounds.push({
      id,
      ...value,
    })
  }
  rounds.sort(sortByOrder)
  console.log(rounds)
}
const roundsRef = db
  .ref(`/games/${route.query.id}/rounds/`)
  .orderByChild('order')

roundsRef.on('value', (snapshot) => {
  if (snapshot.val()) updateRounds(snapshot.val())
})

// const initRounds = (gameInfo) => {
//   if (Object.keys(gameInfo.value).length === 0) return
//   for (const [id, value] of Object.entries(gameInfo.value.rounds)) {
//     rounds.push({
//       id,
//       ...value,
//     })
//   }
//   console.log(rounds)
// }
const handleRoundDrag = (round) => {
  const oldIndex = round.moved.oldIndex
  const newIndex = round.moved.newIndex
  const roundAId = rounds.find((round) => round.order === oldIndex).id
  const roundBId = rounds.find((round) => round.order === newIndex).id
  changeRoundsOrder(route.query.id, roundAId, roundBId, newIndex, oldIndex)
}
// const allRounds = computed(() => {
//   if (Object.keys(gameInfo.value).length === 0) return []
//   const formattedRounds = []
//   for (const [id, value] of Object.entries(gameInfo.value.rounds)) {
//     formattedRounds.push({
//       id,
//       ...value,
//     })
//   }
//   console.log(formattedRounds)
//   return formattedRounds
// })
</script>
