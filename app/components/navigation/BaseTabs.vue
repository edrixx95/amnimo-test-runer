<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  items: { label: string; key?: string; icon?: string; disabled?: boolean }[];
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const activeIndex = ref(props.modelValue || 0);

watch(() => props.modelValue, (val) => {
  if (val !== undefined) activeIndex.value = val;
});

const selectTab = (index: number, disabled?: boolean) => {
  if (disabled) return;
  activeIndex.value = index;
  emit('update:modelValue', index);
};
</script>

<template>
  <div class="w-full">
    <div class="sm:hidden mb-4">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select 
        id="tabs" 
        class="block w-full rounded-md border-slate-300 focus:border-amnimo-500 focus:ring-amnimo-500 text-sm"
        :value="activeIndex"
        @change="(e) => selectTab(parseInt((e.target as HTMLSelectElement).value))"
      >
        <option v-for="(item, index) in items" :key="index" :value="index" :disabled="item.disabled">
          {{ item.label }}
        </option>
      </select>
    </div>
    
    <div class="hidden sm:block">
      <div class="border-b border-slate-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="(item, index) in items"
            :key="index"
            @click="selectTab(index, item.disabled)"
            class="whitespace-nowrap flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="[
              activeIndex === index
                ? 'border-amnimo-500 text-amnimo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
            :aria-current="activeIndex === index ? 'page' : undefined"
          >
            <Icon v-if="item.icon" :name="item.icon" class="mr-2 w-5 h-5" :class="activeIndex === index ? 'text-amnimo-500' : 'text-slate-400 group-hover:text-slate-500'" />
            {{ item.label }}
          </button>
        </nav>
      </div>
    </div>
    
    <div class="py-4">
      <slot :name="items[activeIndex]?.key || 'item-' + activeIndex" :item="items[activeIndex]"></slot>
    </div>
  </div>
</template>
