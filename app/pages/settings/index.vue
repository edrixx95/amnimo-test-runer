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
            <h3 class="text-lg font-bold text-slate-800">{{ $t('settings.envConfig') }}</h3>
            <p class="text-sm text-slate-500 mt-1">{{ $t('settings.envDesc') }}</p>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">
                {{ $t('settings.e2ePath') }}
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
                  {{ $t('settings.browse') }}
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
                <p class="font-bold text-sm">{{ validationResult.valid ? $t('settings.validConfig') : $t('settings.invalidPath') }}</p>
                <p class="text-sm mt-0.5 opacity-90">{{ validationResult.message }}</p>
              </div>
            </div>
            
            <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button 
                @click="validatePath"
                :disabled="isValidating || !e2ePath"
                class="px-5 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {{ isValidating ? $t('settings.checking') : $t('settings.validate') }}
              </button>
              <button 
                @click="saveSettings"
                :disabled="isSaving || !e2ePath"
                class="px-6 py-2 text-sm font-bold text-white bg-amnimo-600 rounded-xl hover:bg-amnimo-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {{ isSaving ? $t('settings.saving') : $t('settings.saveSettings') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Software Update Configuration (Only for Desktop App) -->
        <div v-if="isDesktopApp" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 class="text-lg font-bold text-slate-800">{{ $t('settings.softwareUpdate') }}</h3>
            <p class="text-sm text-slate-500 mt-1">{{ $t('settings.updateDesc') }}</p>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-slate-700">{{ $t('settings.currentVersion') }}</p>
                <p class="text-slate-500 font-mono text-sm mt-1">v{{ appVersion }}</p>
              </div>
              <button 
                @click="checkForUpdates"
                :disabled="isCheckingUpdate"
                class="px-5 py-2 text-sm font-bold bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Icon v-if="isCheckingUpdate" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                {{ isCheckingUpdate ? $t('settings.checkingUpdates') : $t('settings.checkUpdates') }}
              </button>
            </div>
            
            <div v-if="updateStatusMessage" class="mt-4 p-4 rounded-xl border flex items-start gap-3 bg-slate-50 border-slate-200">
              <Icon name="heroicons:information-circle" class="w-5 h-5 shrink-0 mt-0.5 text-slate-500" />
              <div class="flex-1">
                <p class="font-bold text-sm text-slate-700">{{ updateStatusMessage }}</p>
                <div v-if="updateProgress > 0 && updateProgress < 100" class="mt-3">
                  <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-amnimo-500 h-1.5 rounded-full transition-all duration-300" :style="{ width: updateProgress + '%' }"></div>
                  </div>
                </div>
                <button v-if="isUpdateReady" @click="installUpdate" class="mt-3 px-4 py-1.5 bg-amnimo-600 text-white text-xs font-bold rounded-lg shadow hover:bg-amnimo-700 transition-colors">
                  {{ $t('settings.installRestart') }}
                </button>
              </div>
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

const isDesktopApp = ref(false);
const appVersion = ref('1.0.0');
const isCheckingUpdate = ref(false);
const updateStatusMessage = ref('');
const updateProgress = ref(0);
const isUpdateReady = ref(false);

onMounted(async () => {
  try {
    const res = await $fetch<{ e2ePath: string }>('/api/settings');
    if (res && res.e2ePath) {
      e2ePath.value = res.e2ePath;
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }

  if ((window as any).electronAPI) {
    isDesktopApp.value = true;
    appVersion.value = await (window as any).electronAPI.getAppVersion();
    
    (window as any).electronAPI.onUpdateStatus((info: any) => {
      switch (info.status) {
        case 'checking':
          isCheckingUpdate.value = true;
          updateStatusMessage.value = 'Checking for updates...';
          break;
        case 'available':
          isCheckingUpdate.value = false;
          updateStatusMessage.value = `Update to version ${info.version} is available. Downloading...`;
          break;
        case 'not-available':
          isCheckingUpdate.value = false;
          updateStatusMessage.value = 'You are already on the latest version.';
          break;
        case 'downloading':
          updateProgress.value = info.percent;
          updateStatusMessage.value = `Downloading update... ${Math.round(info.percent)}%`;
          break;
        case 'downloaded':
          isCheckingUpdate.value = false;
          updateProgress.value = 100;
          isUpdateReady.value = true;
          updateStatusMessage.value = `Version ${info.version} is ready to install!`;
          break;
        case 'error':
          isCheckingUpdate.value = false;
          updateStatusMessage.value = `Error: ${info.error}`;
          break;
      }
    });
  }
});

const checkForUpdates = () => {
  if ((window as any).electronAPI) {
    isCheckingUpdate.value = true;
    updateStatusMessage.value = 'Checking for updates...';
    updateProgress.value = 0;
    isUpdateReady.value = false;
    (window as any).electronAPI.checkForUpdates();
  } else {
    updateStatusMessage.value = 'Update checking is only available in the desktop app.';
  }
};

const installUpdate = () => {
  if ((window as any).electronAPI) {
    (window as any).electronAPI.installUpdate();
  }
};

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
