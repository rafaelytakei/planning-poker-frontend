<template>
  <fieldset class="border-2 border-color3 p-5 relative">
    <legend class="text-color3 px-2 text-center text-xl">
      {{ title }}
    </legend>
    <slot></slot>
  </fieldset>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  title: {
    type: String,
    default: 'Title',
  },
})
</script>
