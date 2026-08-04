<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  defaultOpen?: boolean;
}>();

const isOpen = ref(props.defaultOpen || false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="border border-slate-200 rounded-lg bg-white overflow-hidden">
    <button 
      @click="toggle"
      class="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
    >
      <span class="font-medium text-slate-700 text-sm">{{ title }}</span>
      <Icon 
        name="heroicons:chevron-down" 
        class="w-5 h-5 text-slate-400 transition-transform duration-200" 
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>
    <div v-show="isOpen" class="px-4 py-3 border-t border-slate-200">
      <slot />
    </div>
  </div>
</template>
