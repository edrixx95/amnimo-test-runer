<template>
  <div
    class="w-full h-full shrink-0 snap-center overflow-y-auto custom-scrollbar px-2 relative"
    ref="slideRef"
    @scroll="onScroll"
  >
    <slot />

    <!-- Scroll indicator -->
    <transition name="fade">
      <div
        v-if="canScroll && !isAtBottom"
        class="sticky bottom-0 left-0 right-0 w-full h-24 flex items-end justify-center pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent pb-4"
      >
        <div class="flex flex-col items-center text-slate-400 animate-bounce">
          <span
            class="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1 opacity-60"
            >Scroll</span
          >
          <Icon name="heroicons:chevron-down" class="w-4 h-4 opacity-60" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const slideRef = ref<HTMLElement | null>(null);
const canScroll = ref(false);
const isAtBottom = ref(false);

const checkScroll = () => {
  if (!slideRef.value) return;
  const el = slideRef.value;
  // If scrollHeight is noticeably larger than clientHeight
  canScroll.value = el.scrollHeight > el.clientHeight + 5;

  // Check if we are at bottom
  isAtBottom.value =
    Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 20;
};

const onScroll = () => {
  checkScroll();
};

let observer: ResizeObserver;
let mutObserver: MutationObserver;

onMounted(() => {
  nextTick(() => {
    checkScroll();
    // setTimeout to re-check after images might have loaded
    setTimeout(checkScroll, 500);
  });

  if (slideRef.value) {
    observer = new ResizeObserver(() => checkScroll());
    observer.observe(slideRef.value);

    mutObserver = new MutationObserver(() => checkScroll());
    mutObserver.observe(slideRef.value, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  if (mutObserver) mutObserver.disconnect();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
