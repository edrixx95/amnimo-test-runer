<script setup lang="ts">
const props = defineProps<{
  links: { label: string; to?: string; icon?: string }[];
}>();
</script>

<template>
  <nav class="flex text-sm text-slate-500 font-medium" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(link, index) in links" :key="index" class="flex items-center">
        <Icon v-if="index > 0" name="heroicons:chevron-right" class="w-4 h-4 mx-2 text-slate-400 shrink-0" />
        
        <component 
          :is="link.to ? 'NuxtLink' : 'span'"
          :to="link.to"
          class="flex items-center gap-1.5 transition-colors"
          :class="[
            link.to ? 'hover:text-amnimo-600 cursor-pointer' : 'text-slate-900',
            index === links.length - 1 ? 'text-slate-900 pointer-events-none' : ''
          ]"
        >
          <Icon v-if="link.icon" :name="link.icon" class="w-4 h-4" />
          {{ link.label }}
        </component>
      </li>
    </ol>
  </nav>
</template>
