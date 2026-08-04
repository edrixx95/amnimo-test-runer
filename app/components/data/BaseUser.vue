<script setup lang="ts">
const props = defineProps<{
  name: string;
  description?: string;
  avatar?: string;
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <BaseAvatar v-if="avatar" :text="avatar" size="md" />
    <div class="flex flex-col">
      <span class="text-sm font-semibold text-slate-900 leading-tight">{{ name }}</span>
      <span v-if="description" class="text-xs text-slate-500 leading-tight">{{ description }}</span>
    </div>
  </div>
</template>
