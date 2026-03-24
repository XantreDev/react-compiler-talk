<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{ step: number }>()

const steps = [
  "HIR",
  "Pre opt",
  "Effect inference",
  "Reactive scopes",
  "Optimize",
  "Codegen",
]

const step = computed(() => props.step)
const percentage = computed(() =>
  Math.min((step.value - 0.5) / steps.length, 1),
)
</script>

<template>
  <div
    class="auto-cols-fr text-[0.8rem] content-center grid-flow-col list-none! grid"
  >
    <div
      v-for="(item, idx) in steps"
      class="px-2 text-center duration-350 transition-transform"
      :data-idx="idx"
      :data-step="step"
      :class="{ 'scale-115': step - 1 === idx }"
    >
      {{ item }}
    </div>
  </div>
  <div
    :style="{ '--w': percentage }"
    class="w-full duration-350 after:transition-[width] h-[1px] mt-1 mb-2 rounded relative after:absolute after:content-empty after:inset-y-0 after:left-0 after:w-[calc(100%*var(--w))] after:bg-green"
  />
</template>
