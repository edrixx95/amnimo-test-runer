<script setup lang="ts">
// Simple wrapper around Nuxt Icon
const props = defineProps<{
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>();

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
};
</script>

<template>
  <Icon :name="name" :class="[sizeClasses[size || 'md'], 'shrink-0']" />
</template>
