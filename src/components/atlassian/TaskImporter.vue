<template>
  <base-stepper class="w-full" :current-step="currentStep" />
  <base-button @click="currentStep--">Return step</base-button>
  <base-button @click="currentStep++">Advance step</base-button>
  <div v-if="currentStep === 0" class="flex flex-col align-center">
    <h5 class="text-2xl text-color3 text-center mb-4">
      Escolha um ecossistema:
    </h5>
    <div class="flex justify-center">
      <div
        v-for="(site, i) in sites"
        :key="i"
        class="
          bg-color2-100
          px-10
          py-4
          justify-center
          flex flex-col
          items-center
          rounded-lg
          cursor-pointer
        "
        @click="selectSite(site.id)"
      >
        <img :src="site.avatarUrl" alt="" class="w-10" />
        <h5 class="text-lg">{{ site.name }}</h5>
      </div>
    </div>
  </div>
  <div v-if="currentStep === 1" class="flex flex-col align-center">
    <h5 class="text-2xl text-color3 text-center mb-4">Escolha um projeto:</h5>
    <div class="flex flex-wrap justify-around">
      <div
        v-for="project in projects"
        class="
          cursor-pointer
          w-3/10
          flex-grow-0 flex-shrink-1
          border-1 border-color2
          px-4
          py-2
          flex
          items-center
          mx-3
          my-1
        "
        @click="selectProject(project)"
      >
        <img :src="project.avatarUrls['16x16']" class="w-8 h-8 mr-3" />
        <span class="text-color2 text-lg">{{ project.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  getSites,
  getProjects,
  setCloudId,
  getIssues,
} from '~/composables/atlassian'
import { showLoading } from '~/composables/loading'
const currentStep = ref(0)
const sites = ref([])
const projects = ref([])
const selectedProject = ref(null)
onMounted(async () => {
  showLoading.value = true
  sites.value = await getSites()
  showLoading.value = false
})
const selectSite = async (siteId) => {
  showLoading.value = true
  setCloudId(siteId)
  projects.value = await getProjects()
  showLoading.value = false
  currentStep.value++
  console.log(projects)
}
const issues = ref([])
const selectProject = async (project) => {
  console.log(project)
  issues.value = await getIssues()
}
</script>

<style scoped></style>
