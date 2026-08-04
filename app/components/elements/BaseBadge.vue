<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: 'slate' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  variant?: 'solid' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}>(), {
  color: 'slate',
  variant: 'solid',
  size: 'md'
});

const baseClasses = 'inline-flex items-center font-medium rounded-full';

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
};

const colorMap = {
  slate: {
    solid: 'bg-slate-500 text-white',
    subtle: 'bg-slate-100 text-slate-700',
    outline: 'border border-slate-500 text-slate-600'
  },
  red: {
    solid: 'bg-red-500 text-white',
    subtle: 'bg-red-100 text-red-700',
    outline: 'border border-red-500 text-red-600'
  },
  yellow: {
    solid: 'bg-yellow-500 text-white',
    subtle: 'bg-yellow-100 text-yellow-800',
    outline: 'border border-yellow-500 text-yellow-600'
  },
  green: {
    solid: 'bg-green-500 text-white',
    subtle: 'bg-green-100 text-green-700',
    outline: 'border border-green-500 text-green-600'
  },
  blue: {
    solid: 'bg-blue-500 text-white',
    subtle: 'bg-blue-100 text-blue-700',
    outline: 'border border-blue-500 text-blue-600'
  },
  indigo: {
    solid: 'bg-indigo-500 text-white',
    subtle: 'bg-indigo-100 text-indigo-700',
    outline: 'border border-indigo-500 text-indigo-600'
  },
  purple: {
    solid: 'bg-purple-500 text-white',
    subtle: 'bg-purple-100 text-purple-700',
    outline: 'border border-purple-500 text-purple-600'
  },
  pink: {
    solid: 'bg-pink-500 text-white',
    subtle: 'bg-pink-100 text-pink-700',
    outline: 'border border-pink-500 text-pink-600'
  }
};
</script>

<template>
  <span :class="[baseClasses, sizeClasses[size], colorMap[color]?.[variant] || colorMap['slate'][variant]]">
    <slot />
  </span>
</template>
