<script setup>
import { useSlideContext } from "@slidev/client";
import { computed } from "vue";
const { $slidev } = useSlideContext();
const currentStep = computed(() => {
  return $slidev.nav.slides[$slidev.nav.currentPage - 1].meta.slide?.frontmatter
    ?.step;
});
</script>

<template>
  <Transition>
    <div
      v-if="currentStep !== undefined"
      class="absolute top-0 inset-x-12 py-4"
    >
      <Progress :step="currentStep" />
    </div>
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
