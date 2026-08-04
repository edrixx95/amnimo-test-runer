<script setup lang="ts">
import { clearError } from "nuxt/app";

const props = defineProps<{
  error?: {
    statusCode?: number;
    message?: string;
  } | null;
}>();

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[400px] bg-slate-50 text-center p-8 rounded-xl border border-slate-200"
  >
    <div
      class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6"
    >
      <Icon name="heroicons:exclamation-triangle" class="w-8 h-8" />
    </div>

    <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
      {{ error?.statusCode || "Error" }}
    </h1>

    <p class="text-lg text-slate-500 mb-8 max-w-md mx-auto">
      {{ error?.message || "Something went wrong." }}
    </p>

    <button
      class="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
      @click="handleError"
    >
      Return Home
    </button>
  </div>
</template>
