<script setup lang="ts">
// BaseCard.vue
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
      <slot name="header" />
    </div>
    <div class="p-6 flex-1">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-200 bg-slate-50">
      <slot name="footer" />
    </div>
  </div>
</template>
