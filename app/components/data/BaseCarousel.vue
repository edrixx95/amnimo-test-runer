<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  items: any[];
  arrows?: boolean;
}>();

const scrollContainer = ref<HTMLElement | null>(null);

const scroll = (direction: 'left' | 'right') => {
  if (scrollContainer.value) {
    const scrollAmount = scrollContainer.value.clientWidth;
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};
</script>

<template>
  <div class="relative group">
    <div 
      ref="scrollContainer"
      class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="snap-center shrink-0"
      >
        <slot :item="item" :index="index"></slot>
      </div>
    </div>

    <button 
      v-if="arrows"
      @click="scroll('left')"
      class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-slate-600 hover:text-amnimo-600 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
    >
      <Icon name="heroicons:chevron-left" class="w-5 h-5" />
    </button>
    <button 
      v-if="arrows"
      @click="scroll('right')"
      class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md border border-slate-100 text-slate-600 hover:text-amnimo-600 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
    >
      <Icon name="heroicons:chevron-right" class="w-5 h-5" />
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
