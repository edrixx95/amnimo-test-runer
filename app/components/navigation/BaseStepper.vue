<script setup lang="ts">
const props = defineProps<{
  steps: { title: string; description?: string }[];
  currentStep: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentStep', value: number): void;
}>();
</script>

<template>
  <nav aria-label="Progress">
    <ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
      <li v-for="(step, index) in steps" :key="step.title" class="md:flex-1">
        <button 
          class="group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 w-full text-left transition-colors"
          :class="[
            index < currentStep ? 'border-amnimo-600 hover:border-amnimo-800' : '',
            index === currentStep ? 'border-amnimo-600' : '',
            index > currentStep ? 'border-slate-200 hover:border-slate-300' : ''
          ]"
          @click="emit('update:currentStep', index)"
        >
          <span 
            class="text-sm font-medium transition-colors"
            :class="[
              index < currentStep ? 'text-amnimo-600 group-hover:text-amnimo-800' : '',
              index === currentStep ? 'text-amnimo-600' : '',
              index > currentStep ? 'text-slate-500 group-hover:text-slate-700' : ''
            ]"
          >
            Step {{ index + 1 }}
          </span>
          <span class="text-sm font-semibold text-slate-900">{{ step.title }}</span>
          <span v-if="step.description" class="text-xs text-slate-500 mt-0.5">{{ step.description }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>
