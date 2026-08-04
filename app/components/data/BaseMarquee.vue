<script setup lang="ts">
const props = withDefaults(defineProps<{
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
}>(), {
  direction: 'left',
  speed: 'normal',
  pauseOnHover: true
});

const speedClass = {
  slow: 'duration-[60s]',
  normal: 'duration-[30s]',
  fast: 'duration-[15s]'
};
</script>

<template>
  <div class="overflow-hidden flex w-full relative">
    <div 
      class="flex whitespace-nowrap min-w-full shrink-0 animate-marquee items-center justify-around gap-4"
      :class="[
        speedClass[speed], 
        direction === 'right' ? '[animation-direction:reverse]' : '',
        pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
      ]"
    >
      <slot />
    </div>
    <!-- Duplicate for seamless loop -->
    <div 
      class="flex whitespace-nowrap min-w-full shrink-0 animate-marquee items-center justify-around gap-4"
      aria-hidden="true"
      :class="[
        speedClass[speed], 
        direction === 'right' ? '[animation-direction:reverse]' : '',
        pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<style>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  animation-name: marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
