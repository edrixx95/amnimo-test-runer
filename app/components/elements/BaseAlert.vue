<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
}>(), {
  type: 'info'
});

const typeClasses = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200'
};

const iconClasses = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500'
};
</script>

<template>
  <div :class="['p-4 rounded-lg border flex gap-3', typeClasses[type]]" role="alert">
    <div v-if="icon || $slots.icon" class="flex-shrink-0 mt-0.5" :class="iconClasses[type]">
      <slot name="icon">
        <Icon v-if="icon" :name="icon" class="w-5 h-5" />
      </slot>
    </div>
    <div class="flex-1 text-sm">
      <h3 v-if="title" class="font-medium mb-1">{{ title }}</h3>
      <div v-if="description || $slots.default" class="opacity-90">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <div v-if="$slots.close" class="flex-shrink-0">
      <slot name="close" />
    </div>
  </div>
</template>
