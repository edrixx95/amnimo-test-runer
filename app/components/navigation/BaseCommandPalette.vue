<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const query = ref('');

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-20">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="close"></div>
      
      <!-- Palette Panel -->
      <div class="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200 transition-all">
        <!-- Search Input -->
        <div class="flex items-center px-4 border-b border-slate-100">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-slate-400 shrink-0" />
          <input 
            v-model="query"
            type="text" 
            class="w-full h-14 border-0 bg-transparent pl-4 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm" 
            placeholder="Search commands, files, or settings..." 
            autofocus
          />
          <BaseKbd>ESC</BaseKbd>
        </div>

        <!-- Mock Results -->
        <div class="max-h-72 overflow-y-auto py-2 px-2 text-sm text-slate-700">
          <div class="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent</div>
          <button class="w-full flex items-center px-3 py-2.5 hover:bg-amnimo-50 hover:text-amnimo-700 rounded-lg group transition-colors">
            <Icon name="heroicons:document-text" class="w-5 h-5 text-slate-400 group-hover:text-amnimo-500 mr-3" />
            <span class="flex-1 text-left">View Test Report #1234</span>
            <span class="text-xs text-slate-400">Reports</span>
          </button>
          <button class="w-full flex items-center px-3 py-2.5 hover:bg-amnimo-50 hover:text-amnimo-700 rounded-lg group transition-colors">
            <Icon name="heroicons:cog-8-tooth" class="w-5 h-5 text-slate-400 group-hover:text-amnimo-500 mr-3" />
            <span class="flex-1 text-left">Environment Variables</span>
            <span class="text-xs text-slate-400">Settings</span>
          </button>
        </div>
        
        <!-- Footer -->
        <div class="flex items-center bg-slate-50 px-4 py-3 border-t border-slate-100 gap-4">
          <div class="flex items-center gap-1.5 text-xs text-slate-500">
            <BaseKbd>↑</BaseKbd> <BaseKbd>↓</BaseKbd> to navigate
          </div>
          <div class="flex items-center gap-1.5 text-xs text-slate-500">
            <BaseKbd>↵</BaseKbd> to select
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
