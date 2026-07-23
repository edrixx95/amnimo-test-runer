<template>
  <div
    class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300"
    :class="[
      modelValue ? 'border-emerald-300 bg-emerald-50/40' : '',
      !modelValue && (pingStatus === 'failed' || apiStatus === 'failed') ? 'border-amber-300 bg-amber-50/30' : '',
      !modelValue && pingStatus !== 'failed' && apiStatus !== 'failed'
        ? 'border-slate-200 bg-white hover:border-slate-300'
        : '',
    ]"
  >
    <div class="flex justify-between items-start mb-5">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm transition-colors duration-500 border"
          :class="[
            modelValue
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
              : '',
            !modelValue && (pingStatus === 'failed' || apiStatus === 'failed')
              ? 'bg-amber-100 border-amber-200 text-amber-600'
              : '',
            !modelValue && pingStatus !== 'failed' && apiStatus !== 'failed'
              ? 'bg-slate-50 border-slate-100 text-slate-500 group-hover:text-amnimo-500'
              : '',
          ]"
        >
          <Icon name="heroicons:computer-desktop" class="w-7 h-7" />
        </div>
        <h4
          class="font-bold text-xl transition-colors duration-300"
          :class="[
            modelValue ? 'text-emerald-800' : '',
            !modelValue && (pingStatus === 'failed' || apiStatus === 'failed') ? 'text-amber-800' : '',
            !modelValue && pingStatus !== 'failed' && apiStatus !== 'failed' ? 'text-slate-900' : '',
          ]"
        >
          DHCP Client (Partner GW) Check
        </h4>
      </div>
      <span
        v-if="modelValue"
        class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-sm shadow-emerald-200/50 scale-105 origin-right transition-transform"
      >
        <Icon name="heroicons:check-badge" class="w-5 h-5 text-emerald-600" />
        <span class="tracking-wide uppercase text-xs">Ready</span>
      </span>
      <span
        v-else-if="!modelValue && (pingStatus === 'failed' || apiStatus === 'failed')"
        class="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 animate-fade-in shadow-sm shadow-amber-100/50"
      >
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
        Warning
      </span>
    </div>

    <div
      class="space-y-4 mb-6 text-sm bg-slate-50 p-4 rounded-xl border transition-all duration-500"
      :class="[
        modelValue ? 'opacity-60 grayscale-[30%] border-slate-100' : '',
        !modelValue && (pingStatus === 'failed' || apiStatus === 'failed') ? 'border-amber-100 bg-white' : '',
        !modelValue && pingStatus !== 'failed' && apiStatus !== 'failed' ? 'border-slate-100' : '',
      ]"
    >
      <div class="flex justify-between items-center">
        <span class="text-slate-500 font-medium">Requirement</span>
        <span class="font-bold text-slate-800">Partner GW connected to HUB (IP: {{ dhcpClientIp || 'Not configured' }})</span>
      </div>

      <!-- Error & Progress Box -->
      <Transition name="fade">
        <div v-if="pingStatus !== 'idle'" class="mt-4 pt-4 border-t border-slate-200 space-y-3">
          
          <!-- Step 1: Ping -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div v-if="pingStatus === 'running'" class="w-6 h-6 flex items-center justify-center">
                <AppSpinner size="sm" class="text-amnimo-500" />
              </div>
              <div v-else-if="pingStatus === 'success'" class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Icon name="heroicons:check" class="w-4 h-4" />
              </div>
              <div v-else-if="pingStatus === 'failed'" class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Icon name="heroicons:x-mark" class="w-4 h-4" />
              </div>
              <span class="font-medium" :class="{'text-slate-500': pingStatus === 'running', 'text-emerald-700': pingStatus === 'success', 'text-amber-700': pingStatus === 'failed'}">
                1. Ping Partner GW ({{ dhcpClientIp }})
              </span>
            </div>
          </div>

          <!-- Step 2: API Check -->
          <div v-if="pingStatus === 'success' && apiStatus !== 'idle'" class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div v-if="apiStatus === 'running'" class="w-6 h-6 flex items-center justify-center">
                  <AppSpinner size="sm" class="text-amnimo-500" />
                </div>
                <div v-else-if="apiStatus === 'success'" class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Icon name="heroicons:check" class="w-4 h-4" />
                </div>
                <div v-else-if="apiStatus === 'failed'" class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Icon name="heroicons:x-mark" class="w-4 h-4" />
                </div>
                <span class="font-medium" :class="{'text-slate-500': apiStatus === 'running', 'text-emerald-700': apiStatus === 'success', 'text-amber-700': apiStatus === 'failed'}">
                  2. Verify DHCP Configuration on br0 via API
                </span>
              </div>
            </div>
            
            <div v-if="configData" class="ml-9 mt-2 flex flex-col gap-1.5">
              <div class="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700/50 w-fit">
                <Icon name="heroicons:server" class="w-4 h-4 text-slate-400" />
                <span class="font-medium text-slate-500">dhcp4:</span>
                <span class="font-bold" :class="configData.dhcp4?.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                  {{ configData.dhcp4?.enabled === true ? 'true' : 'false' }}
                </span>
              </div>
              <details class="text-xs mt-1 group">
                <summary class="cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline underline-offset-2 transition-colors select-none">
                  <span class="group-open:hidden">View full config details</span>
                  <span class="hidden group-open:inline">Hide config details</span>
                </summary>
                <div class="mt-2 p-3 bg-slate-800 text-slate-100 rounded-lg overflow-x-auto font-mono text-xs shadow-inner">
                  <pre>{{ JSON.stringify(configData, null, 2) }}</pre>
                </div>
              </details>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="mt-2 text-amber-700 text-xs bg-amber-50 p-2 rounded border border-amber-100">
            {{ errorMsg }}
          </div>

        </div>
      </Transition>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <button
        type="button"
        @click="skipCheck"
        class="text-sm font-medium text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
      >
        Skip (Force Check)
      </button>

      <button
        type="button"
        @click="runCheck"
        :disabled="isRunning || !dhcpClientIp"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 disabled:opacity-50 transition-all duration-300 shadow-sm shadow-slate-200 active:scale-95"
      >
        <AppSpinner v-if="isRunning" size="sm" class="text-white" />
        <Icon v-else name="heroicons:play" class="w-4 h-4" />
        {{ isRunning ? "Checking..." : (pingStatus === 'failed' || apiStatus === 'failed' ? "Retry Check" : "Run Check") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  baseUrl: string;
  dhcpClientIp: string;
  username?: string;
  password?: string;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const pingStatus = ref<"idle" | "running" | "success" | "failed">("idle");
const apiStatus = ref<"idle" | "running" | "success" | "failed">("idle");
const errorMsg = ref("");
const configData = ref<any>(null);

const isRunning = computed(() => pingStatus.value === 'running' || apiStatus.value === 'running');

const runCheck = async () => {
  if (!props.dhcpClientIp) {
    errorMsg.value = "DHCP_CLIENT_IP is not configured in Environment variables.";
    pingStatus.value = "failed";
    return;
  }

  errorMsg.value = "";
  configData.value = null;
  apiStatus.value = "idle";
  pingStatus.value = "running";

  try {
    // Step 1: Ping
    const pingRes = await $fetch<{ success: boolean }>("/api/network/ping", {
      method: "POST",
      body: { ip: props.dhcpClientIp },
    });

    if (!pingRes.success) {
      pingStatus.value = "failed";
      errorMsg.value = "Cannot ping Partner GW. Please ensure it is powered on, connected to the hub, and your PC has an IP in the same subnet.";
      return;
    }
    
    pingStatus.value = "success";
    
    // Step 2: API check
    apiStatus.value = "running";
    
    const apiRes = await $fetch<{ success: boolean, message?: string, config?: any }>("/api/proxy/device/dhcp-partner", {
      method: "POST",
      body: {
        targetUrl: `https://${props.dhcpClientIp}`,
        username: props.username || "admin",
        password: props.password || "yoko1234",
      },
    });

    if (apiRes.config) {
      configData.value = apiRes.config;
    }

    if (apiRes.success) {
      apiStatus.value = "success";
      emit("update:modelValue", true);
    } else {
      apiStatus.value = "failed";
      errorMsg.value = apiRes.message || "Failed to verify DHCP configuration on the Partner GW.";
    }

  } catch (err: any) {
    if (pingStatus.value === "running") {
      pingStatus.value = "failed";
      errorMsg.value = "Error during ping execution.";
    } else {
      apiStatus.value = "failed";
      errorMsg.value = err.data?.statusMessage || err.message || "Unknown error occurred.";
    }
  }
};

const skipCheck = () => {
  emit("update:modelValue", true);
};

onMounted(() => {
  if (!props.modelValue && props.dhcpClientIp) {
    runCheck();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
