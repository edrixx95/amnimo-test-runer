<script setup lang="ts">
const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical';
}>(), {
  orientation: 'horizontal'
});
</script>

<template>
  <div 
    v-if="orientation === 'horizontal'" 
    class="relative flex items-center py-2"
  >
    <div class="flex-grow border-t border-slate-200"></div>
    <span v-if="$slots.default" class="mx-4 flex-shrink-0 text-sm text-slate-500 font-medium">
      <slot />
    </span>
    <div v-if="$slots.default" class="flex-grow border-t border-slate-200"></div>
  </div>

  <div 
    v-else 
    class="relative flex justify-center w-px h-full"
  >
    <div class="border-l border-slate-200 h-full"></div>
  </div>
</template>
