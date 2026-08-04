<script setup lang="ts">
const props = defineProps<{
  columns: { title: string; links: { label: string; to: string }[] }[];
}>();
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
    <div v-for="col in columns" :key="col.title">
      <h3 class="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">{{ col.title }}</h3>
      <ul class="space-y-3">
        <li v-for="link in col.links" :key="link.label">
          <NuxtLink :to="link.to" class="text-sm text-slate-600 hover:text-amnimo-600 transition-colors">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
