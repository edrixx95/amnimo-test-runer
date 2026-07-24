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
          <Icon name="heroicons:video-camera" class="w-7 h-7" />
        </div>
        <h4
          class="font-bold text-xl transition-colors duration-300"
          :class="[
            modelValue ? 'text-emerald-800' : '',
            !modelValue && errorMsg ? 'text-amber-800' : '',
            !modelValue && !errorMsg ? 'text-slate-900' : '',
          ]"
        >
          {{ $t("peripheralPoeCheck.title") }}
        </h4>
      </div>
      <span
        v-if="modelValue"
        class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-sm shadow-emerald-200/50 scale-105 origin-right transition-transform"
      >
        <Icon name="heroicons:check-badge" class="w-5 h-5 text-emerald-600" />
        <span class="tracking-wide uppercase text-xs">{{
          $t("peripheralPoeCheck.connected")
        }}</span>
      </span>
      <span
        v-else-if="!modelValue && errorMsg"
        class="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 animate-fade-in shadow-sm shadow-amber-100/50"
      >
        <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
        {{ $t("peripheralPoeCheck.warning") }}
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
        <span class="text-slate-500 font-medium">{{
          $t("peripheralPoeCheck.requirement")
        }}</span>
        <span class="font-bold text-slate-800">{{
          $t("peripheralPoeCheck.requirementDesc")
        }}</span>
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
                :placeholder="$t('peripheralPoeCheck.username')"
                class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-amnimo-500 focus:border-amnimo-500 bg-transparent"
                @keyup.enter="checkPoe"
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
                :placeholder="$t('peripheralPoeCheck.password')"
                class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-amnimo-500 focus:border-amnimo-500 bg-transparent"
                @keyup.enter="checkPoe"
              />
            </div>
            <button
              @click="checkPoe"
              class="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-rose-700 transition-colors shrink-0 flex items-center gap-2"
            >
              <AppSpinner v-if="isChecking" size="sm" />
              {{ $t("peripheralPoeCheck.loginRetry") }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Success / Info Box -->
      <Transition name="fade">
        <div
          v-if="poeInfo"
          class="mt-4 pt-4 border-t border-slate-200 space-y-3"
        >
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">{{
              $t("peripheralPoeCheck.interface")
            }}</span>
            <span class="font-bold text-slate-800 uppercase tracking-wide">{{
              poeInfo.name
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">{{
              $t("peripheralPoeCheck.state")
            }}</span>
            <span
              class="font-bold font-mono px-2 py-0.5 rounded text-xs"
              :class="
                poeInfo.state === 'connected'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              "
              >{{ poeInfo.state }}</span
            >
          </div>
          <template
            v-if="
              poeInfo.state === 'connected' || poeInfo.voltage !== undefined
            "
          >
            <div
              class="flex justify-between items-center pt-2 border-t border-slate-100"
            >
              <span class="text-slate-500 font-medium">{{
                $t("peripheralPoeCheck.voltage")
              }}</span>
              <span class="font-bold text-slate-800 font-mono"
                >{{ poeInfo.voltage?.toFixed(2) }} V</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">{{
                $t("peripheralPoeCheck.current")
              }}</span>
              <span class="font-bold text-slate-800 font-mono"
                >{{ poeInfo.current?.toFixed(2) }} mA</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">{{
                $t("peripheralPoeCheck.power")
              }}</span>
              <span class="font-bold text-slate-800 font-mono"
                >{{ poeInfo.watt?.toFixed(2) }} W</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">{{
                $t("peripheralPoeCheck.class")
              }}</span>
              <span class="font-medium text-slate-600">{{
                poeInfo.class
              }}</span>
            </div>
          </template>
        </div>
      </Transition>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="checkPoe"
        :disabled="isChecking"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-amnimo-600 hover:border-amnimo-200 disabled:opacity-50 transition-all duration-300 shadow-sm active:scale-95"
      >
        <AppSpinner v-if="isChecking" size="md" />
        <Icon v-else name="heroicons:arrow-path" class="w-5 h-5" />
        {{ $t("peripheralPoeCheck.checkApi") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const { t } = useI18n();

const props = defineProps<{ baseUrl: string; modelValue?: boolean }>();
const emit = defineEmits<{ (e: "update:modelValue", val: boolean): void }>();

const isChecking = ref(false);
const needsLogin = ref(false);
const errorMsg = ref("");
const username = ref("admin");
const password = ref("yoko1234");

const poeInfo = ref<any>(null);

onMounted(() => {
  if (props.baseUrl) {
    checkPoe();
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      poeInfo.value = null;
      errorMsg.value = "";
      needsLogin.value = false;
    }
  },
);

async function checkPoe() {
  if (!props.baseUrl) {
    errorMsg.value = t("peripheralPoeCheck.errorNoUrl");
    return;
  }

  isChecking.value = true;
  errorMsg.value = "";
  needsLogin.value = false;
  poeInfo.value = null;
  emit("update:modelValue", false);

  try {
    const res = await $fetch("/api/proxy/device/poe", {
      method: "POST",
      body: {
        baseUrl: props.baseUrl,
        username: username.value,
        password: password.value,
      },
    });

    const poes = res?.content?.poes;
    if (!poes || !Array.isArray(poes)) {
      throw new Error(t("peripheralPoeCheck.errorInvalidFormat"));
    }

    if (poes.length > 0) {
      const lan1 = poes.find((p: any) => p.name === "lan1");

      if (lan1) {
        poeInfo.value = lan1;
        if (lan1.state === "connected") {
          emit("update:modelValue", true);
        } else {
          errorMsg.value = t("peripheralPoeCheck.errorState", {
            state: lan1.state,
          });
        }
      } else {
        errorMsg.value = t("peripheralPoeCheck.errorNotFound");
      }
    } else {
      errorMsg.value = t("peripheralPoeCheck.errorNoInterfaces");
    }
  } catch (err: any) {
    if (err.data?.statusCode === 401) {
      errorMsg.value = t("peripheralPoeCheck.errorAuth");
      needsLogin.value = true;
    } else {
      errorMsg.value =
        err.data?.statusMessage ||
        err.message ||
        t("peripheralPoeCheck.errorConnect");
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
