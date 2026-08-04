<script setup lang="ts">
const props = defineProps<{
  columns: { key: string; label: string }[];
  rows: any[];
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200">
    <table class="min-w-full divide-y divide-slate-200 text-sm text-left">
      <thead class="bg-slate-50 text-slate-900 font-semibold">
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.key" 
            scope="col" 
            class="px-4 py-3"
          >
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white text-slate-600">
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-slate-50 transition-colors">
          <td 
            v-for="col in columns" 
            :key="col.key" 
            class="px-4 py-3 whitespace-nowrap"
          >
            <slot :name="`cell-${col.key}`" :row="row" :column="col" :index="rowIndex">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-slate-500">
            No data available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
