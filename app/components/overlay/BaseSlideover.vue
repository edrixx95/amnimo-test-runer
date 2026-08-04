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
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <transition
              enter-active-class="transform transition ease-in-out duration-300 sm:duration-500"
              enter-from-class="translate-x-full"
              enter-to-class="translate-x-0"
              leave-active-class="transform transition ease-in-out duration-300 sm:duration-500"
              leave-from-class="translate-x-0"
              leave-to-class="translate-x-full"
            >
              <div v-if="modelValue" class="pointer-events-auto w-screen max-w-md bg-white shadow-xl flex flex-col h-full">
                
                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                  <h2 v-if="title" class="text-lg font-semibold text-slate-900">{{ title }}</h2>
                  <div v-else></div>
                  <button @click="close" type="button" class="text-slate-400 hover:text-slate-500 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-md transition-colors focus:outline-none">
                    <span class="sr-only">Close panel</span>
                    <Icon name="heroicons:x-mark" class="h-6 w-6" />
                  </button>
                </div>

                <!-- Body -->
                <div class="relative flex-1 px-6 py-6 overflow-y-auto">
                  <slot />
                </div>

              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
