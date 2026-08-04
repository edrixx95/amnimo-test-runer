<script setup lang="ts">
// AppHeader.vue
</script>

<template>
  <header class="flex-shrink-0 bg-white border-b border-slate-200 z-10">
    <AppContainer class="flex items-center justify-between h-16">
      <div class="flex items-center gap-4">
        <slot name="logo" />
      </div>
      <div class="flex-1 px-6 flex justify-center">
        <slot />
      </div>
      <div class="flex items-center gap-4">
        <slot name="right" />
      </div>
    </AppContainer>
  </header>
</template>
