<script setup lang="ts">
const props = defineProps<{
  prevent?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', event: Event): void;
}>();

const onSubmit = (e: Event) => {
  if (props.prevent !== false) {
    e.preventDefault();
  }
  emit('submit', e);
};
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <slot />
  </form>
</template>
