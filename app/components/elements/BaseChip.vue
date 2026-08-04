<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: 'slate' | 'red' | 'yellow' | 'green' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}>(), {
  color: 'red',
  size: 'md',
  position: 'top-right'
});

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3'
};

const colorMap = {
  slate: 'bg-slate-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500'
};

const positionMap = {
  'top-right': 'top-0 right-0 -translate-y-1/2 translate-x-1/2',
  'bottom-right': 'bottom-0 right-0 translate-y-1/2 translate-x-1/2',
  'top-left': 'top-0 left-0 -translate-y-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-0 left-0 translate-y-1/2 -translate-x-1/2'
};
</script>

<template>
  <div class="relative inline-flex">
    <slot />
    <span 
      class="absolute rounded-full ring-2 ring-white"
      :class="[sizeMap[size], colorMap[color], positionMap[position]]"
    ></span>
  </div>
</template>
