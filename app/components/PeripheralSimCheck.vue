<template>
  <div
    class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300"
    :class="[
      modelValue ? 'border-emerald-300 bg-emerald-50/40' : '',
      !modelValue && errorMsg ? 'border-amber-300 bg-amber-50/30' : '',
      !modelValue && !errorMsg
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
            !modelValue && errorMsg
              ? 'bg-amber-100 border-amber-200 text-amber-600'
              : '',
            !modelValue && !errorMsg
              ? 'bg-slate-50 border-slate-100 text-slate-500 group-hover:text-amnimo-500'
              : '',
          ]"
        >
          <SimIcon class="w-7 h-7" />
        </div>
        <h4
          class="font-bold text-xl transition-colors duration-300"
          :class="[
            modelValue ? 'text-emerald-800' : '',
            !modelValue && errorMsg ? 'text-amber-800' : '',
            !modelValue && !errorMsg ? 'text-slate-900' : '',
          ]"
        >
          {{ $t('peripheralSimCheck.title') }}
        </h4>
      </div>
      <span
        v-if="modelValue"
        class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-sm shadow-emerald-200/50 scale-105 origin-right transition-transform"
      >
        <Icon name="heroicons:check-badge" class="w-5 h-5 text-emerald-600" />
        <span class="tracking-wide uppercase text-xs">{{ $t('peripheralSimCheck.pluggedIn') }}</span>
      </span>
      <span
        v-else-if="!modelValue && errorMsg"
        class="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 animate-fade-in shadow-sm shadow-amber-100/50"
      >
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
        {{ $t('peripheralSimCheck.warning') }}
      </span>
    </div>

    <div
      class="space-y-4 mb-6 text-sm bg-slate-50 p-4 rounded-xl border transition-all duration-500"
      :class="[
        modelValue ? 'opacity-60 grayscale-[30%] border-slate-100' : '',
        !modelValue && errorMsg ? 'border-amber-100 bg-white' : '',
        !modelValue && !errorMsg ? 'border-slate-100' : '',
      ]"
    >
      <div class="flex justify-between items-center">
        <span class="text-slate-500 font-medium">{{ $t('peripheralSimCheck.requirement') }}</span>
        <span class="font-bold text-slate-800">{{ $t('peripheralSimCheck.requirementDesc') }}</span>
      </div>

      <!-- Error & Login Box -->
      <Transition name="fade">
        <div v-if="errorMsg" class="mt-4 pt-4 border-t border-slate-200">
          <div class="flex items-start gap-2 text-amber-700 mb-3">
            <Icon
              name="heroicons:exclamation-triangle"
              class="w-5 h-5 shrink-0 mt-0.5"
            />
            <span class="font-medium">{{ errorMsg }}</span>
          </div>

          <div
            v-if="needsLogin"
            class="flex items-center gap-3 bg-white p-3 rounded-lg border border-rose-100 shadow-sm mt-3"
          >
            <div class="relative flex-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Icon name="heroicons:user" class="w-4 h-4 text-slate-400" />
              </div>
              <input
                v-model="username"
                :placeholder="$t('peripheralSimCheck.username')"
                class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-amnimo-500 focus:border-amnimo-500 bg-transparent"
                @keyup.enter="checkSim"
              />
            </div>
            <div class="relative flex-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Icon name="heroicons:key" class="w-4 h-4 text-slate-400" />
              </div>
              <input
                v-model="password"
                type="password"
                :placeholder="$t('peripheralSimCheck.password')"
                class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-amnimo-500 focus:border-amnimo-500 bg-transparent"
                @keyup.enter="checkSim"
              />
            </div>
            <button
              @click="checkSim"
              class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-rose-700 transition-colors shrink-0 flex items-center gap-2"
            >
              <AppSpinner v-if="isChecking" size="sm" />
              {{ $t('peripheralSimCheck.loginRetry') }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Success / Info Box -->
      <Transition name="fade">
        <div
          v-if="simInfo"
          class="mt-4 pt-4 border-t border-slate-200 space-y-3"
        >
          <div
            v-if="simInfo.isBusy"
            class="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 mb-2"
          >
            <Icon
              name="heroicons:information-circle"
              class="w-5 h-5 shrink-0"
            />
            <span class="text-xs font-medium"
              >{{ $t('peripheralSimCheck.simConnected') }}</span
            >
          </div>

          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">{{ $t('peripheralSimCheck.moduleModel') }}</span>
            <span class="font-bold text-slate-800">{{ simInfo.model }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">{{ $t('peripheralSimCheck.moduleImei') }}</span>
            <span class="font-bold text-slate-800 font-mono">{{
              simInfo.imei
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">{{ $t('peripheralSimCheck.firmware') }}</span>
            <span
              class="font-medium text-slate-600 text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200"
              >{{ simInfo.fw_version }}</span
            >
          </div>
          <template v-if="simInfo.sim_iccid">
            <div
              class="flex justify-between items-center pt-2 border-t border-slate-100"
            >
              <span class="text-slate-500 font-medium flex items-center gap-1.5"
                ><Icon name="heroicons:credit-card" class="w-4 h-4" /> {{ $t('peripheralSimCheck.iccid') }}</span
              >
              <span class="font-bold text-slate-800 font-mono text-xs">{{
                simInfo.sim_iccid
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium flex items-center gap-1.5"
                ><Icon name="heroicons:finger-print" class="w-4 h-4" />
                {{ $t('peripheralSimCheck.imsi') }}</span
              >
              <span class="font-bold text-slate-800 font-mono text-xs">{{
                simInfo.sim_imsi
              }}</span>
            </div>
          </template>
        </div>
      </Transition>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="checkSim"
        :disabled="isChecking"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-amnimo-600 hover:border-amnimo-200 disabled:opacity-50 transition-all duration-300 shadow-sm active:scale-95"
      >
        <AppSpinner v-if="isChecking" size="md" />
        <Icon v-else name="heroicons:arrow-path" class="w-5 h-5" />
        {{ $t('peripheralSimCheck.checkApi') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const { t } = useI18n();

const props = defineProps<{ baseUrl: string; modelValue: boolean }>();
const emit = defineEmits<{ (e: "update:modelValue", val: boolean): void }>();

const isChecking = ref(false);
const needsLogin = ref(false);
const errorMsg = ref("");
const username = ref("admin");
const password = ref("yoko1234");

const simInfo = ref<any>(null);

onMounted(() => {
  if (props.baseUrl) {
    checkSim();
  }
});

// Reset state if un-checked manually via other means
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      simInfo.value = null;
      errorMsg.value = "";
      needsLogin.value = false;
    }
  },
);

async function checkSim() {
  if (!props.baseUrl) {
    errorMsg.value = t('peripheralSimCheck.errorNoUrl');
    return;
  }

  isChecking.value = true;
  errorMsg.value = "";
  needsLogin.value = false;
  simInfo.value = null;
  emit("update:modelValue", false);

  try {
    const res = await $fetch("/api/proxy/device/mobile", {
      method: "POST",
      body: {
        baseUrl: props.baseUrl,
        username: username.value,
        password: password.value,
      },
    });

    const module = res?.content?.module?.[0];
    if (!module) {
      throw new Error(t('peripheralSimCheck.errorInvalidFormat'));
    }

    if (module.sim && module.sim.length > 0) {
      // Find SIM in slot 0
      const sim0 = module.sim.find((s: any) => s.number === 0);

      if (sim0) {
        simInfo.value = {
          ...module,
          sim_iccid: sim0.iccid,
          sim_imsi: sim0.imsi,
          isBusy: res.isBusy,
        };
        emit("update:modelValue", true);
      } else {
        simInfo.value = module;
        errorMsg.value = t('peripheralSimCheck.errorWrongSlot');
      }
    } else {
      // No SIM
      simInfo.value = module;
      errorMsg.value = t('peripheralSimCheck.errorNoSim');
    }
  } catch (err: any) {
    if (err.data?.statusCode === 401) {
      errorMsg.value = t('peripheralSimCheck.errorAuth');
      needsLogin.value = true;
    } else {
      errorMsg.value =
        err.data?.statusMessage ||
        err.message ||
        t('peripheralSimCheck.errorConnect');
    }
  } finally {
    isChecking.value = false;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
