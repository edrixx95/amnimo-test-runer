<script setup lang="ts">
const props = defineProps<{
  to?: string;
  href?: string;
  target?: string;
}>();
</script>

<template>
  <component 
    :is="to ? 'NuxtLink' : 'a'" 
    :to="to" 
    :href="href" 
    :target="target"
    class="text-amnimo-600 hover:text-amnimo-700 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amnimo-600 focus:ring-offset-1 rounded-sm"
  >
    <slot />
  </component>
</template>
