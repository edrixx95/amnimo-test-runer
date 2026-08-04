<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
  >
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Welcome Header -->
      <div
        class="px-8 pt-8 pb-6 text-center border-b border-slate-100 bg-slate-50/50"
      >
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amnimo-100 text-amnimo-600 mb-4"
        >
          <Icon name="heroicons:rocket-launch" class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-bold text-slate-800">
          {{ $t("initialSetup.welcome") }}
        </h2>
        <p class="text-sm text-slate-500 mt-2">
          {{ $t("initialSetup.description") }}
        </p>
      </div>

      <!-- Content -->
      <div class="p-8">
        <label class="block text-sm font-semibold text-slate-700 mb-2">{{
          $t("initialSetup.e2ePath")
        }}</label>
        <div class="flex gap-2">
          <input
            v-model="e2ePath"
            type="text"
            :placeholder="$t('initialSetup.e2ePlaceholder')"
            class="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500 text-sm outline-none transition-shadow"
          />
          <button
            @click="isFolderPickerOpen = true"
            class="px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap text-sm border border-slate-200"
          >
            {{ $t("initialSetup.browse") }}
          </button>
        </div>
        <p
          v-if="errorMsg"
          class="mt-2 text-sm text-red-500 flex items-center gap-1"
        >
          <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
          {{ errorMsg }}
        </p>
        <p v-else class="mt-2 text-xs text-slate-500">
          {{ $t("initialSetup.hint") }}
        </p>
      </div>

      <!-- Footer -->
      <div
        class="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end"
      >
        <button
          @click="saveSettings"
          :disabled="isSaving || !e2ePath.trim()"
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amnimo-600 text-white font-semibold rounded-lg hover:bg-amnimo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-amnimo-500 w-full sm:w-auto"
        >
          <Icon v-if="isSaving" name="svg-spinners:180-ring" class="w-4 h-4" />
          <Icon v-else name="heroicons:check" class="w-4 h-4" />
          {{
            isSaving
              ? $t("initialSetup.saving")
              : $t("initialSetup.saveContinue")
          }}
        </button>
      </div>
    </div>

    <!-- Folder Picker Dialog -->
    <FolderPickerDialog
      v-model="isFolderPickerOpen"
      :initial-path="e2ePath"
      @select="handleFolderSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const { t } = useI18n();

const isOpen = ref(false);
const e2ePath = ref("");
const isFolderPickerOpen = ref(false);
const isSaving = ref(false);
const errorMsg = ref("");

onMounted(async () => {
  try {
    const res = await $fetch<{ e2ePath: string }>("/api/settings");
    if (!res || !res.e2ePath || res.e2ePath.trim() === "") {
      isOpen.value = true;
    }
  } catch (e) {
    console.error("Failed to fetch initial settings", e);
    isOpen.value = true;
  }
});

const handleFolderSelected = (path: string) => {
  e2ePath.value = path;
  errorMsg.value = "";
};

const saveSettings = async () => {
  if (!e2ePath.value.trim()) return;

  isSaving.value = true;
  errorMsg.value = "";

  try {
    await $fetch("/api/settings", {
      method: "PUT",
      body: { e2ePath: e2ePath.value },
    });
    isOpen.value = false;
  } catch (e: any) {
    console.error("Failed to save settings", e);
    errorMsg.value =
      e.data?.message || e.message || t("initialSetup.saveError");
  } finally {
    isSaving.value = false;
  }
};
</script>
