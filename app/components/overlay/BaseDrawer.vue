<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="relative z-50">
      <!-- Backdrop -->
      <transition
        enter-active-class="ease-in-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in-out duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="close" />
      </transition>

      <!-- Panel -->
      <div class="fixed inset-x-0 bottom-0 z-50 flex">
        <transition
          enter-active-class="transform transition ease-in-out duration-300"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transform transition ease-in-out duration-300"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div v-if="modelValue" class="w-full h-auto max-h-[90vh] bg-white shadow-xl rounded-t-2xl flex flex-col pointer-events-auto">
            <!-- Drag handle (visual only) -->
            <div class="flex justify-center p-2 border-b border-slate-100" @click="close">
              <div class="w-12 h-1.5 bg-slate-200 rounded-full cursor-pointer hover:bg-slate-300 transition-colors"></div>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              <slot />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Teleport>
</template>
