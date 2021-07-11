<template>
  <div class="bg-color1 min-h-screen flex justify-center">
    <loading-overlay :active="showLoading" />
    <div
      v-if="initialized && user"
      class="absolute top-8 right-8 flex text-color2 cursor-pointer"
      @click="handleLogout"
    >
      <i-mdi-logout />
      <span class="text-sm">Sair</span>
    </div>
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { showLoading } from '~/composables/loading'
import { user, initialized, logout } from '~/composables/firebase'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
