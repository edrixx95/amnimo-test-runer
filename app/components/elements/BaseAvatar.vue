<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>(), {
  size: 'md'
});

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg'
};

const initials = computed(() => {
  if (props.text) {
    return props.text.substring(0, 2).toUpperCase();
  }
  if (props.alt) {
    return props.alt.substring(0, 2).toUpperCase();
  }
  return '';
});
</script>

<template>
  <span 
    class="inline-flex items-center justify-center rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shrink-0"
    :class="sizeClasses[size]"
  >
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" />
    <span v-else class="font-medium text-slate-600 leading-none">{{ initials }}</span>
  </span>
</template>
