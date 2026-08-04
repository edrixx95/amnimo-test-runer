<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
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
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="close" />

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <!-- Modal panel -->
            <transition
              enter-active-class="ease-out duration-300"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div v-if="modelValue" class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
                
                <!-- Header -->
                <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 class="text-lg font-semibold text-slate-900" id="modal-title">{{ title }}</h3>
                  <button @click="close" type="button" class="text-slate-400 hover:text-slate-500 focus:outline-none bg-slate-50 hover:bg-slate-100 p-1.5 rounded-md transition-colors">
                    <span class="sr-only">Close</span>
                    <Icon name="heroicons:x-mark" class="h-5 w-5" />
                  </button>
                </div>

                <!-- Body -->
                <div class="px-6 py-4">
                  <slot />
                </div>

                <!-- Footer -->
                <div v-if="$slots.footer" class="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <slot name="footer" />
                </div>

              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
