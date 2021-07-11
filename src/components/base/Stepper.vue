<template>
  <div class="flex">
    <div
      v-for="(step, i) in steps"
      class="step flex flex-col items-center flex-1 relative"
      :class="{ active: i === currentStep, activated: i < currentStep }"
    >
      <div
        class="
          step__icon
          w-10
          h-10
          border-2
          rounded-1
          flex
          justify-center
          items-center
          font-bold
          text-xl
        "
      >
        {{ i + 1 }}
      </div>
      <span class="text-color2">{{ step }}</span>
      <div class="step__line-after mt-5 ml-5"></div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  steps: {
    type: Array,
    default: () => ['Ecossistema', 'Projeto', 'Whatever'],
  },
  currentStep: { type: Number, default: 0 },
})
</script>

<style>
.step__icon {
  border-color: #35c5b4;
  color: #35c5b4;
}
.active .step__icon,
.activated .step__icon {
  background-color: #35c5b4;
  color: #264653;
}
.step:not(:last-of-type) .step__line-after {
  content: '';
  height: 5px;
  width: calc(100% - 2.5rem);
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateY(-50%);
  border-top: 1px solid #35c5b4;
  border-bottom: 1px solid #35c5b4;
  transition: background 0.5s ease-out;
  background: linear-gradient(to left, #264653 50%, #35c5b4 50%);
  background-size: 200%;
  background-position: 100%;
}
.activated.step:not(:last-of-type) .step__line-after {
  background-position: 0;
}
</style>
