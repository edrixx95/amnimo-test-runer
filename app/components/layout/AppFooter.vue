<script setup lang="ts">
// AppFooter.vue
</script>

<template>
  <footer class="flex-shrink-0 bg-white border-t border-slate-200 py-4 mt-auto">
    <AppContainer class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      <div class="flex items-center gap-4">
        <slot name="left" />
      </div>
      <div class="flex-1 text-center">
        <slot />
      </div>
      <div class="flex items-center gap-4 justify-end">
        <slot name="right" />
      </div>
    </AppContainer>
  </footer>
</template>
