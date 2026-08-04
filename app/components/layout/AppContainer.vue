<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: string;
  fluid?: boolean;
}>(), {
  as: 'div',
  fluid: false
});
</script>

<template>
  <component 
    :is="as" 
    :class="[
      'mx-auto px-4 sm:px-6 lg:px-8',
      fluid ? 'w-full' : 'max-w-7xl w-full'
    ]"
  >
    <slot />
  </component>
</template>
