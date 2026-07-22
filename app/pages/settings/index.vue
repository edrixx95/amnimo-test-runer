<template>
  <div class="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
    <header class="h-16 flex items-center px-8 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10 relative">
      <h2 class="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
        <Icon name="heroicons:cog-6-tooth" class="w-6 h-6 text-slate-500" />
        Settings
      </h2>
    </header>

    <div class="flex-1 p-8 overflow-auto custom-scrollbar">
      <div class="max-w-3xl mx-auto space-y-6">
        
        <!-- E2E Path Configuration -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 class="text-lg font-bold text-slate-800">Environment Configuration</h3>
            <p class="text-sm text-slate-500 mt-1">Configure the path to your amnimo-e2e test repository.</p>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">
                Amnimo E2E Directory Path
              </label>
              <div class="flex gap-3">
                <input 
                  type="text" 
                  v-model="e2ePath"
                  class="flex-1 px-4 py-2 border border-slate-300 rounded-xl font-mono text-sm focus:ring-amnimo-500 focus:border-amnimo-500 bg-slate-50"
                  placeholder="C:\path\to\amnimo-e2e"
                  @input="resetValidation"
                />
                <button 
                  @click="isFolderPickerOpen = true"
                  class="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors shrink-0"
                >
                  Browse...
                </button>
              </div>
            </div>

            <!-- Validation Result -->
            <div v-if="validationResult !== null" 
                 class="p-4 rounded-xl border flex items-start gap-3"
                 :class="validationResult.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'"
            >
              <Icon :name="validationResult.valid ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'" class="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p class="font-bold text-sm">{{ validationResult.valid ? 'Valid Configuration' : 'Invalid Path' }}</p>
                <p class="text-sm mt-0.5 opacity-90">{{ validationResult.message }}</p>
              </div>
            </div>
            
            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button 
                @click="validatePath"
                :disabled="isValidating || !e2ePath"
                class="px-5 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {{ isValidating ? 'Checking...' : 'Validate' }}
              </button>
              <button 
                @click="saveSettings"
                :disabled="isSaving || !e2ePath"
                class="px-6 py-2 text-sm font-bold text-white bg-amnimo-600 rounded-xl hover:bg-amnimo-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <FolderPickerDialog 
      v-model="isFolderPickerOpen" 
      :initial-path="e2ePath"
      @select="handleFolderSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FolderPickerDialog from '~/components/FolderPickerDialog.vue';

import { useToast } from '~/composables/useToast';

const e2ePath = ref('');
const isFolderPickerOpen = ref(false);
const isSaving = ref(false);
const isValidating = ref(false);
const { addToast } = useToast();

const validationResult = ref<{ valid: boolean, message: string } | null>(null);

onMounted(async () => {
  try {
    const res = await $fetch<{ e2ePath: string }>('/api/settings');
    if (res && res.e2ePath) {
      e2ePath.value = res.e2ePath;
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
});

const handleFolderSelected = (path: string) => {
  e2ePath.value = path;
  resetValidation();
  validatePath();
};

const resetValidation = () => {
  validationResult.value = null;
};

const validatePath = async () => {
  if (!e2ePath.value) return;
  isValidating.value = true;
  try {
    const res = await $fetch('/api/settings/validate', {
      method: 'POST',
      body: { e2ePath: e2ePath.value }
    });
    validationResult.value = res as any;
  } catch (e: any) {
    validationResult.value = { valid: false, message: e.message || 'Validation failed' };
  } finally {
    isValidating.value = false;
  }
};

const saveSettings = async () => {
  if (!e2ePath.value) return;
  isSaving.value = true;
  try {
    await $fetch('/api/settings', {
      method: 'PUT',
      body: { e2ePath: e2ePath.value }
    });
    addToast({
      title: 'Success',
      message: 'Settings saved successfully!',
      type: 'success'
    });
  } catch (e: any) {
    addToast({
      title: 'Error',
      message: 'Failed to save settings: ' + (e.message || String(e)),
      type: 'error'
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
