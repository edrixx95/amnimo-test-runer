<template>
  <div class="flex flex-col items-center justify-center gap-4 py-8">
    <div
      class="relative flex items-center justify-center text-amnimo-500"
      :class="sizeClass"
    >
      <svg
        class="animate-spin w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-opacity="0.2"
          stroke-width="3"
        />
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7632 3.11977 17.2632 4.92893 19.0711L6.34315 17.6569C4.89543 16.2091 4 14.2091 4 12C4 7.58172 7.58172 4 12 4V2Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <!-- Optional Label -->
    <span v-if="text" class="text-sm font-bold text-slate-500 tracking-wide">
      {{ text === "Loading..." ? $t("appLoader.loading") : text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String as () => "sm" | "md" | "lg",
    default: "lg",
  },
  text: {
    type: String,
    default: "Loading...",
  },
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-8 h-8";
    case "md":
      return "w-10 h-10";
    case "lg":
      return "w-14 h-14";
  }
});
</script>
