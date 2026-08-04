<script setup lang="ts">
const props = defineProps<{
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
}>();

const emit = defineEmits<{
  (e: 'change', files: FileList | null): void;
}>();

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('change', target.files);
};
</script>

<template>
  <div class="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 transition-colors hover:bg-slate-50 relative" :class="{'opacity-50 cursor-not-allowed': disabled}">
    <div class="text-center">
      <Icon name="heroicons:photo" class="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
      <div class="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
        <label class="relative cursor-pointer rounded-md bg-white font-semibold text-amnimo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-amnimo-600 focus-within:ring-offset-2 hover:text-amnimo-500">
          <span>Upload a file</span>
          <input type="file" class="sr-only" :accept="accept" :multiple="multiple" :disabled="disabled" @change="onChange" />
        </label>
        <p class="pl-1">or drag and drop</p>
      </div>
      <p class="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 10MB</p>
    </div>
  </div>
</template>
