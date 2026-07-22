<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: boolean;
  baseUrl: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const status = ref<'idle' | 'configuring' | 'waiting_client' | 'connected' | 'error'>('idle');
const errorMessage = ref("");
let pollingInterval: any = null;

const nxLink = computed(() => {
  try {
    const url = new URL(props.baseUrl);
    url.port = '7001';
    return url.toString().replace(/\/$/, '');
  } catch (e) {
    return `${props.baseUrl}:7001`;
  }
});

const startProcess = async () => {
  status.value = 'configuring';
  errorMessage.value = "";
  emit("update:modelValue", false);

  try {
    // 1. Authenticate, GET current config, and PUT new config on the router
    const setupRes = await $fetch<any>("/api/proxy/configs/nxwitness-setup", {
      method: "POST",
      body: { 
        targetUrl: props.baseUrl,
        username: "admin",
        password: "yoko1234"
      },
      timeout: 20000,
    });

    // 2. Initialize Nx Witness Media Server on port 7001
    // Only attempt registration if it wasn't already enabled
    if (!setupRes?.alreadyEnabled) {
      let registered = false;
      let attempts = 0;
      let lastError = "";
      while (!registered && attempts < 5) {
        try {
          await new Promise(res => setTimeout(res, 3000));
          await $fetch<any>("/api/proxy/configs/nxwitness-register", {
            method: "POST",
            body: {
              targetUrl: props.baseUrl,
              defaultPassword: "admin",
              newPassword: "yoko1234",
              systemName: "amnimo"
            },
            timeout: 20000,
          });
          registered = true;
        } catch (err: any) {
          attempts++;
          lastError = err?.data?.statusMessage || err.message || "Unknown error";
          if (attempts >= 5) {
            throw new Error(`Failed to initialize Nx Witness Media Server: ${lastError}`);
          }
        }
      }
    }

    // 3. Start polling netstat to verify client login
    status.value = 'waiting_client';
    startPolling();

  } catch (err: any) {
    console.error("Nx Witness Setup Error:", err);
    status.value = 'error';
    errorMessage.value = err?.data?.statusMessage || err.message || "Failed to configure Nx Witness on router";
  }
};

const checkClientConnection = async () => {
  try {
    // Assuming the router IP is 192.168.0.254, which we extract from baseUrl
    let targetIp = "192.168.0.254";
    try {
      targetIp = new URL(props.baseUrl).hostname;
    } catch (e) {}

    const res = await $fetch<any>("/api/local/netstat", {
      params: {
        targetIp,
        targetPort: 7001
      },
      timeout: 3000
    });

    if (res?.connected) {
      status.value = 'connected';
      emit("update:modelValue", true);
      stopPolling();
    }
  } catch (err) {
    // Ignore polling errors, just keep waiting
  }
};

const startPolling = () => {
  stopPolling();
  // Check immediately
  checkClientConnection();
  // Then poll every 3 seconds
  pollingInterval = setInterval(checkClientConnection, 3000);
};

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

onUnmounted(() => {
  stopPolling();
});

onMounted(() => {
  if (status.value === 'idle') {
    startProcess();
  }
});
</script>

<template>
  <div
    class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 group flex flex-col break-inside-avoid mb-6"
    :class="[
      status === 'connected'
        ? 'border-emerald-300 bg-emerald-50/40'
        : status === 'waiting_client'
        ? 'border-indigo-300 bg-indigo-50/30'
        : status === 'error'
        ? 'border-amber-300 bg-amber-50/30'
        : 'border-slate-200 bg-white hover:border-amnimo-300 hover:shadow-md'
    ]"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-5">
      <div class="flex items-center gap-3">
        <div
          class="p-2.5 rounded-xl transition-colors duration-300 flex items-center justify-center"
          :class="[
            status === 'connected'
              ? 'bg-emerald-100 text-emerald-600'
              : status === 'waiting_client' || status === 'configuring'
              ? 'bg-indigo-100 text-indigo-600'
              : status === 'error'
              ? 'bg-amber-100 text-amber-600'
              : 'bg-slate-100 text-slate-500 group-hover:text-amnimo-600 group-hover:bg-amnimo-50'
          ]"
        >
          <Icon name="heroicons:video-camera" class="w-6 h-6" />
        </div>
        <div>
          <h4
            class="font-bold text-lg transition-colors duration-300 flex items-center gap-2"
            :class="status === 'connected' ? 'text-emerald-800' : 'text-slate-900'"
          >
            Nx Witness
            <a :href="nxLink" target="_blank" @click.stop class="text-xs font-semibold text-amnimo-500 hover:text-amnimo-600 bg-amnimo-50 hover:bg-amnimo-100 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 border border-amnimo-100">
              Web Client <Icon name="heroicons:arrow-top-right-on-square" class="w-3 h-3" />
            </a>
          </h4>
          <p
            class="text-sm font-medium transition-colors"
            :class="
              status === 'connected'
                ? 'text-emerald-600'
                : status === 'waiting_client'
                ? 'text-indigo-600'
                : status === 'error'
                ? 'text-amber-600'
                : 'text-slate-500'
            "
          >
            {{
              status === 'idle'
                ? 'Ready to setup'
                : status === 'configuring'
                ? 'Configuring router...'
                : status === 'waiting_client'
                ? 'Waiting for Nx Client login...'
                : status === 'connected'
                ? 'Connected and verified'
                : errorMessage
            }}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <button
        v-if="status === 'idle' || status === 'error'"
        type="button"
        @click="startProcess"
        class="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
      >
        Setup
      </button>
      <div v-else-if="status === 'configuring' || status === 'waiting_client'" class="p-2 text-indigo-500">
        <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
      </div>
      <div v-else-if="status === 'connected'" class="p-2 text-emerald-500">
        <Icon name="heroicons:check-circle" class="w-6 h-6" />
      </div>
    </div>

    <!-- Status Details -->
    <div class="mt-auto flex flex-col gap-3">
      <div 
        class="flex items-center justify-between p-3 rounded-xl border transition-colors"
        :class="status === 'connected' ? 'bg-emerald-50 border-emerald-200' : (status === 'waiting_client' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100')"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            :class="status === 'connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'"
          >
            <Icon name="heroicons:computer-desktop" class="w-5 h-5" />
          </div>
          <div>
            <span class="block font-bold text-sm text-slate-700">
              PC Client Connection
            </span>
            <span class="block text-xs font-medium text-slate-500 mt-0.5">
              {{ status === 'connected' ? 'Established via TCP:7001' : 'No connection found' }}
            </span>
          </div>
        </div>
        
        <div class="shrink-0 text-slate-400">
          <Icon v-if="status === 'connected'" name="heroicons:check" class="w-5 h-5 text-emerald-500" />
          <div v-else-if="status === 'waiting_client'" class="flex gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.2s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0.4s"></span>
          </div>
          <Icon v-else name="heroicons:minus" class="w-5 h-5" />
        </div>
      </div>
    </div>
  </div>
</template>
