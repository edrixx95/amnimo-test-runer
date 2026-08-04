<script setup lang="ts">
const props = withDefaults(defineProps<{
  shape?: 'circle' | 'text' | 'rect';
}>(), {
  shape: 'rect'
});
</script>

<template>
  <div 
    class="bg-slate-200 animate-pulse"
    :class="[
      shape === 'circle' ? 'rounded-full' : 'rounded-md',
      shape === 'text' ? 'h-4 w-full' : ''
    ]"
  ></div>
</template>
