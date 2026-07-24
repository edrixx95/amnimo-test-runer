<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String as () => "sm" | "md" | "lg",
    default: "md",
  },
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4";
    case "md":
      return "w-5 h-5";
    case "lg":
      return "w-6 h-6";
    default:
      return "w-5 h-5";
  }
});
</script>

<template>
  <svg
    :class="['animate-spin', sizeClass]"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-opacity="0.25"
      stroke-width="3"
    />
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7632 3.11977 17.2632 4.92893 19.0711L6.34315 17.6569C4.89543 16.2091 4 14.2091 4 12C4 7.58172 7.58172 4 12 4V2Z"
      fill="currentColor"
    />
  </svg>
</template>
