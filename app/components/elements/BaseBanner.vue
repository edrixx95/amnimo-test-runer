<script setup lang="ts">
const props = defineProps<{
  title?: string;
  description?: string;
  icon?: string;
}>();
</script>

<template>
  <div class="relative bg-amnimo-600 px-6 py-3 sm:px-8 shadow-sm">
    <div class="flex items-center justify-between gap-x-6">
      <div class="flex items-center gap-x-4">
        <Icon v-if="icon" :name="icon" class="h-6 w-6 text-white shrink-0" aria-hidden="true" />
        <p class="text-sm leading-6 text-white">
          <strong v-if="title" class="font-semibold">{{ title }}</strong>
          <span v-if="title && description" class="mx-2">&bull;</span>
          <span v-if="description">{{ description }}</span>
          <slot />
        </p>
      </div>
      <div class="flex items-center flex-shrink-0">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>
