<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  mode?: 'click' | 'hover';
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
let timeout: any;

const show = () => {
  clearTimeout(timeout);
  isOpen.value = true;
};

const hide = () => {
  timeout = setTimeout(() => {
    isOpen.value = false;
  }, 150);
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const onClickOutside = (e: MouseEvent) => {
  if (props.mode !== 'click') return;
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <div 
    class="relative inline-block" 
    ref="containerRef"
    @mouseenter="mode === 'hover' ? show() : null"
    @mouseleave="mode === 'hover' ? hide() : null"
  >
    <div @click="mode === 'click' ? toggle() : null" class="cursor-pointer inline-block">
      <slot name="trigger" />
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen"
        class="absolute left-1/2 z-10 mt-2 w-max max-w-xs -translate-x-1/2 px-4"
      >
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 bg-white">
          <slot name="panel" />
        </div>
      </div>
    </transition>
  </div>
</template>
