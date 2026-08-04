<script setup lang="ts">
const props = withDefaults(defineProps<{
  value?: number;
  max?: number;
  color?: 'primary' | 'red' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  animation?: 'pulse' | 'stripes' | 'none';
}>(), {
  value: 0,
  max: 100,
  color: 'primary',
  size: 'md',
  animation: 'none'
});

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
};

const colorMap = {
  primary: 'bg-amnimo-600',
  red: 'bg-red-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500'
};
</script>

<template>
  <div class="w-full bg-slate-200 rounded-full overflow-hidden" :class="sizeClasses[size]">
    <div 
      class="h-full rounded-full transition-all duration-300 ease-in-out"
      :class="[
        colorMap[color],
        animation === 'pulse' ? 'animate-pulse' : ''
      ]"
      :style="{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }"
    ></div>
  </div>
</template>
