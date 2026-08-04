<script setup lang="ts">
const props = defineProps<{
  links: { label: string; to: string; icon?: string; badge?: string }[];
}>();
</script>

<template>
  <nav class="flex space-x-1 border-b border-slate-200">
    <NuxtLink 
      v-for="link in links" 
      :key="link.label"
      :to="link.to"
      class="group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-slate-50 hover:text-slate-900 text-slate-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amnimo-600 transition-colors"
      active-class="text-amnimo-600 bg-amnimo-50"
    >
      <div class="flex items-center justify-center gap-2">
        <Icon v-if="link.icon" :name="link.icon" class="w-5 h-5 shrink-0" />
        <span class="truncate">{{ link.label }}</span>
        <span v-if="link.badge" class="inline-flex items-center rounded-full bg-amnimo-100 px-2 py-0.5 text-xs font-medium text-amnimo-700 shrink-0">
          {{ link.badge }}
        </span>
      </div>
      <!-- Active indicator line (mocked via active-class below, but this is a nice touch) -->
      <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 bg-transparent group-[.router-link-active]:bg-amnimo-600"></span>
    </NuxtLink>
  </nav>
</template>
