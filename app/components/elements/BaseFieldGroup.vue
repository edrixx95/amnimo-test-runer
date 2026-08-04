<script setup lang="ts">
const props = defineProps<{
  name?: string;
  label?: string;
  description?: string;
  error?: string | boolean;
  required?: boolean;
}>();
</script>

<template>
  <div class="space-y-1 text-sm">
    <div class="flex items-center justify-between">
      <label :for="name" class="block font-medium text-slate-700">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </label>
      <slot name="hint" />
    </div>
    
    <div v-if="description" class="text-slate-500 text-xs mb-2">
      {{ description }}
    </div>

    <slot />

    <p v-if="error" class="text-red-500 text-xs mt-1 font-medium">
      {{ typeof error === 'string' ? error : 'Invalid input' }}
    </p>
  </div>
</template>
