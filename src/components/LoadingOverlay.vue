<template>
  <loading
    :active="showLoading"
    :is-full-page="true"
    :can-cancel="false"
  ></loading>
</template>

<script setup>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { showLoading } from '~/composables/loading'
</script>
