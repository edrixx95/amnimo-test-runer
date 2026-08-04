<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  items: { label: string; icon?: string; action?: () => void }[];
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', close);
});

onUnmounted(() => {
  document.removeEventListener('click', close);
});
</script>

<template>
  <div class="relative inline-block text-left" ref="containerRef">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger">
        <BaseButton variant="outline" trailing-icon="heroicons:chevron-down">Options</BaseButton>
      </slot>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <button
            v-for="(item, index) in items"
            :key="index"
            @click="item.action ? item.action() : null; isOpen = false"
            class="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Icon v-if="item.icon" :name="item.icon" class="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
