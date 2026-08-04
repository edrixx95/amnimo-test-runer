<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  text: string;
}>();

const show = ref(false);
</script>

<template>
  <div 
    class="relative inline-block" 
    @mouseenter="show = true" 
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
  >
    <slot />
    
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-show="show" 
        class="absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md shadow-sm pointer-events-none whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 mb-2"
        role="tooltip"
      >
        {{ text }}
        <!-- Arrow -->
        <div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </transition>
  </div>
</template>
