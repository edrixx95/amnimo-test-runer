<template>
  <div
    class="relative cursor-pointer group flex flex-col items-center w-full"
    @click="isOpen = true"
  >
    <img
      :src="src"
      :alt="alt"
      class="rounded-lg shadow-sm border border-slate-200 w-full max-w-full h-auto object-contain group-hover:opacity-90 transition-opacity"
      :class="imageClass"
    />
    <div
      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
    >
      <div
        class="bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0 backdrop-blur-sm shadow-xl"
      >
        <Icon name="heroicons:magnifying-glass-plus" class="w-6 h-6 shrink-0" />
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity"
      @click="isOpen = false"
    >
      <button
        class="absolute top-6 right-6 w-12 h-12 flex items-center justify-center shrink-0 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-[210]"
      >
        <Icon name="heroicons:x-mark" class="w-8 h-8" />
      </button>

      <div
        class="overflow-auto w-full h-full flex items-center justify-center p-4 custom-scrollbar"
        @click.stop="isOpen = false"
      >
        <img
          :src="src"
          :alt="alt"
          class="max-w-full max-h-full object-contain rounded-md shadow-2xl transition-transform duration-300"
          :class="
            isZoomed
              ? 'scale-[1.75] cursor-zoom-out'
              : 'scale-100 cursor-zoom-in'
          "
          @click.stop="isZoomed = !isZoomed"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

defineProps<{
  src: string;
  alt: string;
  imageClass?: string;
}>();

const isOpen = ref(false);
const isZoomed = ref(false);

// Reset zoom when closing
watch(isOpen, (val) => {
  if (!val) isZoomed.value = false;
});
</script>
