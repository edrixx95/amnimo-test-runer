<script setup lang="ts">
// This is a UI mockup component for the Design System showcase.
// A real Toast system would use a global state manager (like Pinia or a composable)
// and render multiple toasts dynamically.

const props = defineProps<{
  title: string;
  description?: string;
  icon?: string;
  color?: string; // e.g. 'green', 'red', 'amnimo'
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0" v-if="icon">
          <Icon 
            :name="icon" 
            class="h-6 w-6" 
            :class="color ? `text-${color}-500` : 'text-slate-400'" 
          />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-slate-900">{{ title }}</p>
          <p v-if="description" class="mt-1 text-sm text-slate-500">{{ description }}</p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <button @click="emit('close')" type="button" class="inline-flex rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:ring-offset-2 transition-colors">
            <span class="sr-only">Close</span>
            <Icon name="heroicons:x-mark" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
