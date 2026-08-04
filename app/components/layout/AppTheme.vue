<script setup lang="ts">
// AppTheme.vue
// A placeholder for theme provider/switcher logic.
// In Nuxt, usually handled by @nuxtjs/color-mode.
</script>

<template>
  <div class="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
    <button class="p-2 rounded-md bg-white shadow-sm text-slate-700">
      <Icon name="heroicons:sun" class="w-5 h-5" />
    </button>
    <button class="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors">
      <Icon name="heroicons:moon" class="w-5 h-5" />
    </button>
    <button class="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors">
      <Icon name="heroicons:computer-desktop" class="w-5 h-5" />
    </button>
  </div>
</template>
