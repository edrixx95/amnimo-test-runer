<script setup lang="ts">
const props = withDefaults(defineProps<{
  icon?: string;
  label?: string;
}>(), {
  icon: 'heroicons:circle-stack',
  label: 'No data available'
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="bg-slate-50 p-4 rounded-full mb-4">
      <Icon :name="icon" class="w-8 h-8 text-slate-400" />
    </div>
    <h3 class="text-sm font-medium text-slate-900 mb-1">
      <slot name="label">{{ label }}</slot>
    </h3>
    <p v-if="$slots.default" class="text-sm text-slate-500 max-w-sm">
      <slot />
    </p>
  </div>
</template>
