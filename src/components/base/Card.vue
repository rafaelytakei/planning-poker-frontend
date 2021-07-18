<template>
  <fieldset class="border-2 border-color3 p-5 relative">
    <legend class="text-color3 px-2 text-center text-xl">
      {{ title }}
    </legend>
    <base-lottie
      v-if="loading"
      :animation-data="loader"
      :speed="1"
      class="w-full h-full"
    />
    <slot> </slot>
  </fieldset>
</template>
<script setup>
import { defineProps } from 'vue'
import * as loader from '~/assets/lottie/hourglass.json'
defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>
