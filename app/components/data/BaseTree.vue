<script setup lang="ts">
import { ref } from 'vue';

type TreeNode = {
  id: string | number;
  label: string;
  icon?: string;
  children?: TreeNode[];
};

const props = defineProps<{
  nodes: TreeNode[];
}>();

const expandedIds = ref<Set<string | number>>(new Set());

const toggle = (id: string | number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
};
</script>

<template>
  <ul class="space-y-1">
    <li v-for="node in nodes" :key="node.id" class="text-sm">
      <div 
        class="flex items-center py-1 px-2 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
        @click="node.children ? toggle(node.id) : null"
      >
        <Icon 
          v-if="node.children"
          name="heroicons:chevron-right" 
          class="w-4 h-4 mr-1 text-slate-400 transition-transform duration-200"
          :class="{'rotate-90': expandedIds.has(node.id)}"
        />
        <div v-else class="w-5 shrink-0"></div>
        
        <Icon v-if="node.icon" :name="node.icon" class="w-4 h-4 mr-2 text-slate-500" />
        <span class="text-slate-700 font-medium select-none">{{ node.label }}</span>
      </div>
      <div v-if="node.children && expandedIds.has(node.id)" class="pl-6 mt-1">
        <BaseTree :nodes="node.children" />
      </div>
    </li>
  </ul>
</template>
