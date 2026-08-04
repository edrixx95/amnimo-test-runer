<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  code: string;
}>();

// Syntax highlighting matching Nuxt UI light theme
const highlightedCode = computed(() => {
  let code = props.code.replace(/&quot;/g, '"');
  
  // 1. Escape HTML
  code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Temporarily replace user quotes and equals with unique characters 
  // so we don't accidentally match injected HTML attributes like class="text-teal-500"
  code = code.replace(/=/g, '🌈');
  code = code.replace(/"/g, '🎈');
  
  // 2. Strings (Green)
  code = code.replace(/🎈([^🎈]*)🎈/g, '<span class="text-green-500">&quot;$1&quot;</span>');
  
  // 3. Attributes (Purple name, Teal '=')
  code = code.replace(/\s([a-zA-Z0-9:@.-]+)🌈/g, ' <span class="text-purple-500">$1</span><span class="text-teal-500">=</span>');
  
  // 4. Tags (Teal brackets, Rose names)
  code = code.replace(/&lt;(\/?)([a-zA-Z0-9]+)/g, '<span class="text-teal-500">&lt;$1</span><span class="text-rose-500">$2</span>');

  // 5. Closing Brackets (Teal)
  code = code.replace(/(\/?)&gt;/g, '<span class="text-teal-500">$1&gt;</span>');
  
  // Restore any unmatched characters
  code = code.replace(/🌈/g, '=');
  code = code.replace(/🎈/g, '&quot;');
  
  return code;
});
</script>

<template>
  <div class="border border-slate-200 rounded-xl bg-white my-4 shadow-sm">
    <!-- Controls Slot (Top) -->
    <div v-if="$slots.controls" class="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap rounded-t-xl gap-4 items-center">
      <slot name="controls" />
    </div>

    <!-- Preview Slot (Middle) -->
    <div class="p-8 flex justify-center items-center relative bg-white min-h-[160px]">
      <!-- Background pattern (optional, Nuxt UI has it sometimes, we'll keep it clean) -->
      <slot />
    </div>

    <!-- Code Slot (Bottom) -->
    <div class="border-t border-slate-200 bg-slate-50 overflow-x-auto rounded-b-xl">
      <pre class="p-4 text-sm font-mono text-slate-700"><code v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

