<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import IconInternalStorage from "./icons/IconInternalStorage.vue";
import IconUsb from "./icons/IconUsb.vue";
import IconSdCard from "./icons/IconSdCard.vue";

const props = defineProps<{
  modelValue: boolean;
  baseUrl: string;
  board: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isLoading = ref(true);
const storageData = ref<any[]>([]);
const hasError = ref(false);

interface ExpectedDevice {
  id: string;
  name: string;
  regex: RegExp;
  icon: any;
}

const expectedDevices = computed<ExpectedDevice[]>(() => {
  const b = props.board.toUpperCase();
  if (['AG10', 'AG20'].includes(b)) {
    return [
      { id: 'internal', name: 'Internal Storage', regex: /^sda$/, icon: IconInternalStorage },
      { id: 'usb', name: 'USB Drive', regex: /^sdb$/, icon: IconUsb },
      { id: 'sd', name: 'SD Card', regex: /^mmcblk1$/, icon: IconSdCard }
    ];
  } else if (['AX11', 'AX21'].includes(b)) {
    return [
      { id: 'internal', name: 'Internal Storage', regex: /^nvme0p1$/, icon: IconInternalStorage },
      { id: 'usb', name: 'USB Drive', regex: /^sda$/, icon: IconUsb },
      { id: 'sd', name: 'SD Card', regex: /^mmc/, icon: IconSdCard }
    ];
  } else if (['AX30'].includes(b)) {
    return [
      { id: 'usb', name: 'USB Drive', regex: /^(sda|sdb)$/, icon: IconUsb }
    ];
  }
  return [
    { id: 'usb', name: 'USB Drive', regex: /^sda$/, icon: IconUsb }
  ];
});

// A mapped list of expected devices along with their detection status
const checkList = computed(() => {
  return expectedDevices.value.map(expected => {
    const matchedStorage = storageData.value.find(s => {
      const name = s.device?.name || '';
      return expected.regex.test(name);
    });

    return {
      ...expected,
      isConnected: !!matchedStorage,
      storage: matchedStorage
    };
  });
});

const isFullyConnected = computed(() => {
  if (checkList.value.length === 0) return false;
  return checkList.value.every(item => item.isConnected);
});

// Sync with parent
watch(isFullyConnected, (newVal) => {
  emit("update:modelValue", newVal);
});

const checkStorage = async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    const res = await $fetch<any>("/api/proxy/device/storage/partitions", {
      method: "POST",
      body: { targetUrl: props.baseUrl },
      timeout: 10000,
    });
    if (res?.content?.storages) {
      storageData.value = res.content.storages;
    } else {
      storageData.value = [];
    }
  } catch (err) {
    console.error("Failed to check storage status:", err);
    hasError.value = true;
    storageData.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  checkStorage();
});
</script>

<template>
  <div
    class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 group flex flex-col break-inside-avoid mb-6"
    :class="[
      isFullyConnected
        ? 'border-emerald-300 bg-emerald-50/40'
        : hasError || (!isLoading && !isFullyConnected)
        ? 'border-amber-300 bg-amber-50/30'
        : 'border-slate-200 bg-white hover:border-amnimo-300 hover:shadow-md'
    ]"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-5">
      <div class="flex items-center gap-3">
        <div
          class="p-2.5 rounded-xl transition-colors duration-300"
          :class="[
            isFullyConnected
              ? 'bg-emerald-100 text-emerald-600'
              : hasError || (!isLoading && !isFullyConnected)
              ? 'bg-amber-100 text-amber-600'
              : 'bg-slate-100 text-slate-500 group-hover:text-amnimo-600 group-hover:bg-amnimo-50'
          ]"
        >
          <Icon name="heroicons:circle-stack" class="w-6 h-6" />
        </div>
        <div>
          <h4
            class="font-bold text-lg transition-colors duration-300"
            :class="isFullyConnected ? 'text-emerald-800' : 'text-slate-900'"
          >
            Storage Device
          </h4>
          <p
            class="text-sm font-medium transition-colors"
            :class="
              isFullyConnected
                ? 'text-emerald-600'
                : hasError || (!isLoading && !isFullyConnected)
                ? 'text-amber-600'
                : 'text-slate-500'
            "
          >
            {{
              isLoading
                ? "Checking storage devices..."
                : isFullyConnected
                ? "All devices mounted"
                : "Missing or invalid devices"
            }}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <button
        type="button"
        @click="checkStorage"
        :disabled="isLoading"
        class="p-2 text-slate-400 hover:text-amnimo-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
        title="Check Storage Status"
      >
        <Icon
          name="heroicons:arrow-path"
          class="w-5 h-5"
          :class="{ 'animate-spin': isLoading }"
        />
      </button>
    </div>

    <!-- Storage List -->
    <div class="mt-auto flex flex-col gap-3">
      <div v-if="isLoading" class="flex justify-center py-6">
        <AppSpinner size="md" />
      </div>
      
      <template v-else>
        <!-- Individual Storage Rows -->
        <div 
          v-for="item in checkList" 
          :key="item.id"
          class="flex items-center justify-between p-3 rounded-xl border transition-colors"
          :class="item.isConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-amber-200'"
        >
          <div class="flex items-center gap-3">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
              :class="item.isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'"
            >
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <div>
              <span class="block font-bold" :class="item.isConnected ? 'text-emerald-900' : 'text-slate-700'">
                {{ item.name }}
              </span>
              <div class="flex items-center gap-2 mt-0.5 text-xs font-semibold uppercase tracking-wide" :class="item.isConnected ? 'text-emerald-600/80' : 'text-amber-500'">
                <template v-if="item.isConnected">
                  <span>{{ item.storage.device.name }}</span>
                  <span class="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span v-if="item.storage.device.size">{{ (item.storage.device.size / (1024 * 1024)).toFixed(1) }} GB</span>
                </template>
                <template v-else>
                  <span>Not Found</span>
                </template>
              </div>
            </div>
          </div>
          
          <div v-if="item.isConnected" class="flex items-center gap-1.5 shrink-0">
            <span 
              v-for="part in item.storage.partitions" 
              :key="part.name"
              class="px-2 py-0.5 bg-emerald-100/80 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-md"
            >
              {{ part.name }}
            </span>
          </div>
          <div v-else class="shrink-0 text-amber-500">
            <Icon name="heroicons:exclamation-circle" class="w-5 h-5" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
