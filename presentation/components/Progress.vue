<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ step: number; total: number }>();

const percentage = ref(props.step / props.total);
</script>

<template>
    <div
        :style="{ '--w': percentage }"
        class="w-full h-[1px] my-2 rounded relative after:absolute after:content-empty after:inset-y-0 after:left-0 after:w-[calc(100%*var(--w))] after:bg-green"
    />
</template>
