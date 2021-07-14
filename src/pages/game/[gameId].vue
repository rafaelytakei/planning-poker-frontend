<template>
  <div>Game page</div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { defineProps, onMounted } from 'vue'
import { connectUserToGame } from '~/composables/game'
import { getUser } from '~/composables/firebase'
const route = useRoute()

const props = defineProps({
  gameId: {
    type: String,
    default: '',
  },
})
console.log(props.gameId)

// onMounted(async () => {
//   const user = await getUser()
//   console.log(user.uid)
//   connectUserToGame(props.gameId, user.uid)
// })
</script>
