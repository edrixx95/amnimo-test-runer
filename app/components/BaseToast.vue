<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="flex flex-col gap-3"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-full scale-95"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto overflow-hidden bg-white rounded-xl shadow-lg border border-slate-100 flex items-start gap-3 p-4 relative"
      >
        <div class="shrink-0 pt-0.5">
          <Icon v-if="toast.type === 'success'" name="heroicons:check-circle-solid" class="w-6 h-6 text-emerald-500" />
          <Icon v-else-if="toast.type === 'error'" name="heroicons:x-circle-solid" class="w-6 h-6 text-rose-500" />
          <Icon v-else-if="toast.type === 'warning'" name="heroicons:exclamation-triangle-solid" class="w-6 h-6 text-amber-500" />
          <Icon v-else name="heroicons:information-circle-solid" class="w-6 h-6 text-sky-500" />
        </div>
        
        <div class="flex-1 flex flex-col gap-1 min-w-0">
          <h4 class="text-sm font-bold text-slate-800 break-words">{{ toast.title }}</h4>
          <p v-if="toast.message" class="text-sm text-slate-500 break-words leading-snug">{{ toast.message }}</p>
        </div>

        <button 
          @click="removeToast(toast.id)"
          class="shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors -mr-2 -mt-2"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast';

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-move {
  transition: all 0.3s ease;
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
