<template>
  <button
    class="
      duration-200
      transition-bg
      px-5
      py-2
      border-1
      rounded-md
      text-lg
      font-bold
      hover:bg-color1-300 hover:bg-opacity-15
    "
    :class="`border-${color} text-${color}`"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  color: {
    type: String,
    default: 'color2',
  },
})
</script>
