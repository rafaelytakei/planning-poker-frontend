<template>
  <base-stepper class="w-full" :current-step="currentStep" />
  <transition name="slide" mode="out-in">
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
    <div v-else-if="currentStep === 1" class="flex flex-col align-center">
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
          @click="selectProject(project.key)"
        >
          <img :src="project.avatarUrls['16x16']" class="w-8 h-8 mr-3" />
          <span class="text-color2 text-lg">{{ project.name }}</span>
        </div>
      </div>
    </div>
    <div v-else-if="currentStep === 2" class="flex flex-col align-center">
      <h3 class="text-xl text-color3 mb-4">
        Sprints:
        <span
          v-for="sprint in allSprints"
          class="mx-2 cursor-pointer"
          :class="{
            [`text-color2`]: !inactiveSprints.includes(sprint),
            [`text-color5`]: inactiveSprints.includes(sprint),
          }"
          @click="toggleSprint(sprint)"
          >{{ sprint }}</span
        >
      </h3>
      <h3 class="text-xl text-color3 mb-4">
        Status:
        <span
          v-for="status in allStatus"
          class="mx-2 cursor-pointer"
          :class="{
            [`text-color2`]: !inactiveStatus.includes(status),
            [`text-color5`]: inactiveStatus.includes(status),
          }"
          @click="toggleStatus(status)"
          >{{ status }}</span
        >
      </h3>
      <base-card title="Lista de issues">
        <div class="flex flex-col">
          <div
            v-for="issue in filteredIssues"
            class="flex items-center cursor-pointer"
            :class="{
              [`text-color2`]: !inactiveIssues.includes(issue.key),
              [`text-color5`]: inactiveIssues.includes(issue.key),
            }"
            @click="toggleIssue(issue.key)"
          >
            <i-mdi-close
              v-if="inactiveIssues.includes(issue.key)"
              class="mr-2"
            />
            <i-mdi-check v-else class="mr-2" />
            <span>{{ issue.key }} - {{ issue.fields.summary }}</span>
          </div>
        </div>
      </base-card>
      <base-button @click="addSelectedIssuesToGame"
        >Adicionar issues à partida</base-button
      >
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  getSites,
  getProjects,
  setCloudId,
  getIssues,
} from '~/composables/atlassian'
import { addMultipleRoundsToGame } from '~/composables/game'
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
let issues = reactive([])
const sprintKey = ref('')
const route = useRoute()
const selectProject = async (projectKey) => {
  selectedProject.value = projectKey
  const issuesObj = await getIssues(projectKey)
  issues = reactive([...issuesObj.issues])
  sprintKey.value = issuesObj.sprintKey
  currentStep.value++
  initFilters(issues)
}
const allSprints = ref([])
const allStatus = ref([])
const inactiveSprints = reactive([])
const inactiveStatus = reactive([])
const inactiveIssues = reactive([])
const initFilters = (issues) => {
  allSprints.value = new Set(
    issues.map((issue) => issue.fields[sprintKey.value][0].name)
  )
  allStatus.value = new Set(issues.map((issue) => issue.fields.status.name))
}
const filteredIssues = computed(() => {
  return issues.filter(
    (issue) =>
      !inactiveSprints.includes(issue.fields[sprintKey.value][0].name) &&
      !inactiveStatus.includes(issue.fields.status.name)
  )
})
const toggleSprint = (sprintName) => {
  if (inactiveSprints.includes(sprintName)) {
    inactiveSprints.splice(inactiveSprints.indexOf(sprintName), 1)
  } else {
    inactiveSprints.push(sprintName)
  }
}
const toggleStatus = (statusName) => {
  if (inactiveStatus.includes(statusName)) {
    inactiveStatus.splice(inactiveStatus.indexOf(statusName), 1)
  } else {
    inactiveStatus.push(statusName)
  }
}
const toggleIssue = (issueKey) => {
  if (inactiveIssues.includes(issueKey)) {
    inactiveIssues.splice(inactiveIssues.indexOf(issueKey), 1)
  } else {
    inactiveIssues.push(issueKey)
  }
}
const addSelectedIssuesToGame = async () => {
  const selectedIssues = filteredIssues.value.filter(
    (issue) => !inactiveIssues.includes(issue.key)
  )
  await addMultipleRoundsToGame(
    route.query.id,
    selectedIssues.map((issue) => {
      return {
        name: `${issue.key} - ${issue.fields.summary}`,
        status: 'pending',
        jira: {
          issueKey: issue.key,
        },
        votes: [],
      }
    })
  )

  console.log(selectedIssues)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-enter {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
