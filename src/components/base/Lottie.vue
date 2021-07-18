<template>
  <div ref="wrapper"></div>
</template>

<script setup>
import lottie from 'lottie-web'
import {
  onMounted,
  ref,
  defineProps,
  defineEmits,
  watch,
  watchEffect,
} from 'vue'
import * as animation from '~/assets/check.json'

const wrapper = ref(null)

const props = defineProps({
  speed: {
    type: Number,
    default: 1,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  animationData: {
    type: Object,
    default: () => animation,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  play: {
    type: Boolean,
    default: false,
  },
})

// const emits = defineEmits(['animation-control'])

const lt = ref(null)
onMounted(() => {
  lt.value = lottie.loadAnimation({
    container: wrapper.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: JSON.parse(JSON.stringify(props.animationData)),
  })

  lt.value.setSpeed(props.speed)
  lt.value.play()
  // emits['animation-control'] = lt
})

watch(
  () => props.play,
  (play) => {
    console.log(play)
    if (play) lt.value.goToAndStop(5, true)
    else lt.value.stop()
  }
)
</script>
