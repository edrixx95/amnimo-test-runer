<script setup lang="ts">
const props = defineProps<{
  items: { title: string; description?: string; time?: string; icon?: string; color?: string }[];
}>();
</script>

<template>
  <div class="relative pl-3 space-y-6">
    <div class="absolute left-[15px] top-2 bottom-0 w-px bg-slate-200"></div>
    <div v-for="(item, index) in items" :key="index" class="relative pl-6">
      <div 
        class="absolute left-[-5px] top-1 h-3 w-3 rounded-full border-2 border-white ring-1 ring-slate-200 bg-amnimo-600 shadow-sm"
        :class="item.color ? `bg-${item.color}-500` : ''"
      >
        <Icon v-if="item.icon" :name="item.icon" class="absolute -top-1 -left-1 w-4 h-4 text-white" />
      </div>
      <div>
        <h4 class="text-sm font-semibold text-slate-900">{{ item.title }}</h4>
        <time v-if="item.time" class="block text-xs font-medium text-slate-500 mt-0.5">{{ item.time }}</time>
        <p v-if="item.description" class="text-sm text-slate-600 mt-1">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
