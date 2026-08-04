<script setup lang="ts">
const props = defineProps<{
  value?: string;
}>();
</script>

<template>
  <kbd class="inline-flex items-center justify-center px-1.5 py-0.5 font-sans text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md ring-1 ring-slate-900/5 shadow-sm">
    <slot>{{ value }}</slot>
  </kbd>
</template>
