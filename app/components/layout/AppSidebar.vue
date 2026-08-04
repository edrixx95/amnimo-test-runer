<script setup lang="ts">
const props = withDefaults(defineProps<{
  collapsible?: boolean;
}>(), {
  collapsible: false
});
</script>

<template>
  <aside class="flex flex-col w-64 h-full bg-slate-50 border-r border-slate-200 overflow-hidden shrink-0">
    <div v-if="$slots.header" class="p-4 border-b border-slate-200">
      <slot name="header" />
    </div>
    
    <div class="flex-1 overflow-y-auto p-4">
      <slot />
    </div>

    <div v-if="$slots.footer" class="p-4 border-t border-slate-200 mt-auto">
      <slot name="footer" />
    </div>
  </aside>
</template>
