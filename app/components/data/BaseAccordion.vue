<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  items: { label: string; content: string; icon?: string; disabled?: boolean }[];
  multiple?: boolean;
}>();

const openIndexes = ref<number[]>([]);

const toggle = (index: number, disabled?: boolean) => {
  if (disabled) return;
  if (props.multiple) {
    const i = openIndexes.value.indexOf(index);
    if (i > -1) {
      openIndexes.value.splice(i, 1);
    } else {
      openIndexes.value.push(index);
    }
  } else {
    if (openIndexes.value[0] === index) {
      openIndexes.value = [];
    } else {
      openIndexes.value = [index];
    }
  }
};
</script>

<template>
  <div class="w-full flex flex-col space-y-2">
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
      :class="{ 'opacity-50': item.disabled }"
    >
      <button 
        type="button" 
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amnimo-600 transition-colors"
        :class="{ 'cursor-not-allowed': item.disabled }"
        @click="toggle(index, item.disabled)"
      >
        <div class="flex items-center gap-2">
          <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5 text-slate-500" />
          <span>{{ item.label }}</span>
        </div>
        <Icon 
          name="heroicons:chevron-down" 
          class="w-5 h-5 text-slate-400 transition-transform duration-200"
          :class="{ 'rotate-180': openIndexes.includes(index) }"
        />
      </button>
      
      <div 
        v-show="openIndexes.includes(index)"
        class="px-4 py-3 text-sm text-slate-600 border-t border-slate-200 bg-slate-50/50"
      >
        <slot :name="`item-${index}`" :item="item">
          {{ item.content }}
        </slot>
      </div>
    </div>
  </div>
</template>
