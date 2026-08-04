<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  page: number;
  total: number;
  perPage?: number;
}>(), {
  perPage: 10
});

const emit = defineEmits<{
  (e: 'update:page', value: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const setPage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) {
    emit('update:page', p);
  }
};
</script>

<template>
  <div class="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <BaseButton variant="outline" :disabled="page <= 1" @click="setPage(page - 1)">Previous</BaseButton>
      <BaseButton variant="outline" :disabled="page >= totalPages" @click="setPage(page + 1)">Next</BaseButton>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-slate-700">
          Showing <span class="font-medium">{{ (page - 1) * perPage + 1 }}</span> to <span class="font-medium">{{ Math.min(page * perPage, total) }}</span> of <span class="font-medium">{{ total }}</span> results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button 
            @click="setPage(page - 1)"
            :disabled="page <= 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Previous</span>
            <Icon name="heroicons:chevron-left" class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button 
            v-for="p in totalPages" 
            :key="p"
            @click="setPage(p)"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0 transition-colors"
            :class="p === page ? 'z-10 bg-amnimo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amnimo-600' : 'text-slate-900 hover:bg-slate-50'"
          >
            {{ p }}
          </button>
          
          <button 
            @click="setPage(page + 1)"
            :disabled="page >= totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Next</span>
            <Icon name="heroicons:chevron-right" class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
