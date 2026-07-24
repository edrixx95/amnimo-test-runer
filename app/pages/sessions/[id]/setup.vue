<script setup lang="ts">
import { useSessionSetup } from "~/composables/sessions/useSessionSetup";
import { BOARDS, DEVICE_TYPES } from "~~/shared/constants";

const {
  sessionId,
  session,
  isLoadingSession,
  isSaving,
  currentStep,
  steps,
  formData,
  extractedPrevFw,
  extractedTestFw,
  extractedDhcpIp,
  extractedUsername,
  extractedPassword,
  availableDeviceTypes,
  selectBoard,
  pingStatus,
  isPinging,
  pingDevice,
  checklistState,
  currentChecklist,
  resetEnv,
  isStepValid,
  nextStep,
  prevStep,
  finishSetup,
} = useSessionSetup();
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 text-slate-900">
    <!-- Header -->
    <header
      class="h-16 flex items-center justify-between px-8 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10"
    >
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="text-slate-400 hover:text-amnimo-600 transition-colors bg-slate-50 hover:bg-amnimo-50 p-2 rounded-xl"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <h2 class="text-lg font-bold text-slate-800 tracking-tight">
          {{ $t("setup.title") }}
          <span class="text-amnimo-600 font-semibold">{{
            session?.name || session?.id || "..."
          }}</span>
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-semibold text-amnimo-600 bg-amnimo-50 px-3 py-1.5 rounded-full uppercase tracking-wider"
          >{{
            $t("setup.stepProgress", {
              current: currentStep,
              total: steps.length,
            })
          }}</span
        >
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar / Stepper -->
      <aside
        class="w-72 border-r border-gray-100 bg-white/80 backdrop-blur-xl flex-shrink-0 p-8 hidden md:block shadow-soft z-0"
      >
        <nav aria-label="Progress">
          <ol role="list" class="overflow-hidden">
            <li
              v-for="(step, index) in steps"
              :key="step.name"
              class="relative pb-10"
            >
              <div
                v-if="index !== steps.length - 1"
                class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 transition-colors duration-500"
                :class="
                  currentStep > index + 1 ? 'bg-amnimo-500' : 'bg-slate-200'
                "
                aria-hidden="true"
              ></div>

              <div class="relative flex items-start group">
                <span class="h-9 flex items-center">
                  <span
                    class="relative z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm"
                    :class="[
                      currentStep > index + 1
                        ? 'bg-amnimo-600 border-amnimo-600'
                        : currentStep === index + 1
                          ? 'border-amnimo-600 bg-white ring-4 ring-amnimo-50'
                          : 'border-slate-300 bg-white group-hover:border-slate-400',
                    ]"
                  >
                    <Icon
                      v-if="currentStep > index + 1"
                      name="heroicons:check"
                      class="w-4 h-4 text-white"
                    />
                    <span
                      v-else
                      class="text-sm font-bold"
                      :class="
                        currentStep === index + 1
                          ? 'text-amnimo-600'
                          : 'text-slate-400'
                      "
                      >{{ index + 1 }}</span
                    >
                  </span>
                </span>
                <span class="ml-4 min-w-0 flex flex-col">
                  <span
                    class="text-sm font-bold tracking-tight transition-colors duration-300"
                    :class="
                      currentStep >= index + 1
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    "
                    >{{ step.name }}</span
                  >
                  <span class="text-xs text-slate-500 mt-0.5">{{
                    step.description
                  }}</span>
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 relative flex flex-col overflow-hidden bg-white">
        <div v-if="isLoadingSession" class="flex justify-center p-20">
          <AppLoader size="md" :text="$t('setup.loading')" />
        </div>

        <form
          v-else
          @submit.prevent="nextStep"
          class="flex-1 flex flex-col min-h-0"
        >
          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto p-8 md:p-12 bg-slate-50/50">
            <div class="max-w-6xl mx-auto">
              <Transition name="step" mode="out-in">
                <!-- Step 1: Test Type -->
                <div v-if="currentStep === 1" key="step1" class="space-y-8">
                  <div>
                    <h3
                      class="text-2xl font-bold text-slate-900 tracking-tight mb-2"
                    >
                      {{ $t("setup.step1Title") }}
                    </h3>
                    <p class="text-slate-500">
                      {{ $t("setup.step1Desc") }}
                    </p>
                  </div>

                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <div
                      @click="formData.testType = 'release'"
                      class="relative rounded-2xl border p-8 cursor-pointer focus:outline-none transition-all duration-300 flex flex-col items-center text-center group"
                      :class="
                        formData.testType === 'release'
                          ? 'bg-amnimo-50/50 border-amnimo-500 shadow-lg shadow-amnimo-500/20 scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-amnimo-300 hover:shadow-soft'
                      "
                    >
                      <div
                        class="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        :class="
                          formData.testType === 'release'
                            ? 'bg-amnimo-600 border-transparent text-white'
                            : 'text-slate-400'
                        "
                      >
                        <Icon
                          name="heroicons:rocket-launch"
                          class="w-8 h-8"
                          :class="
                            formData.testType === 'release'
                              ? 'text-amnimo-600'
                              : 'text-gray-600'
                          "
                        />
                      </div>
                      <h4
                        class="font-bold text-xl text-slate-900 mb-3 group-hover:text-amnimo-700 transition-colors"
                      >
                        {{ $t("setup.releaseTest") }}
                      </h4>
                      <p
                        class="text-sm text-slate-500 leading-relaxed font-medium"
                      >
                        {{ $t("setup.releaseTestDesc") }}
                      </p>
                    </div>

                    <div
                      @click="formData.testType = 'system'"
                      class="relative rounded-2xl border p-8 cursor-pointer focus:outline-none transition-all duration-300 flex flex-col items-center text-center group"
                      :class="
                        formData.testType === 'system'
                          ? 'bg-amnimo-50/50 border-amnimo-500 shadow-lg shadow-amnimo-500/20 scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-amnimo-300 hover:shadow-soft'
                      "
                    >
                      <div
                        class="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        :class="
                          formData.testType === 'system'
                            ? 'bg-amnimo-600 border-transparent text-white'
                            : 'text-slate-400'
                        "
                      >
                        <Icon
                          name="heroicons:cpu-chip"
                          class="w-8 h-8"
                          :class="
                            formData.testType === 'system'
                              ? 'text-amnimo-600'
                              : 'text-gray-600'
                          "
                        />
                      </div>
                      <h4
                        class="font-bold text-xl text-slate-900 mb-3 group-hover:text-amnimo-700 transition-colors"
                      >
                        {{ $t("setup.systemTest") }}
                      </h4>
                      <p
                        class="text-sm text-slate-500 leading-relaxed font-medium"
                      >
                        {{ $t("setup.systemTestDesc") }}
                      </p>
                    </div>

                    <!-- Playground Type -->
                    <div
                      @click="formData.testType = 'playground'"
                      class="relative rounded-2xl border p-8 cursor-pointer focus:outline-none transition-all duration-300 flex flex-col items-center text-center group"
                      :class="
                        formData.testType === 'playground'
                          ? 'bg-amnimo-50/50 border-amnimo-500 shadow-lg shadow-amnimo-500/20 scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-amnimo-300 hover:shadow-soft'
                      "
                    >
                      <div
                        class="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                        :class="
                          formData.testType === 'playground'
                            ? 'bg-amnimo-600 border-transparent text-white'
                            : 'text-slate-400'
                        "
                      >
                        <Icon
                          name="heroicons:beaker"
                          class="w-8 h-8"
                          :class="
                            formData.testType === 'playground'
                              ? 'text-amnimo-600'
                              : 'text-gray-600'
                          "
                        />
                      </div>
                      <h4
                        class="font-bold text-xl text-slate-900 mb-3 group-hover:text-amnimo-700 transition-colors"
                      >
                        {{ $t("setup.playground") }}
                      </h4>
                      <p
                        class="text-sm text-slate-500 leading-relaxed font-medium"
                      >
                        {{ $t("setup.playgroundDesc") }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Target Device -->
                <div
                  v-else-if="currentStep === 2"
                  key="step2"
                  class="space-y-8"
                >
                  <div>
                    <h3
                      class="text-2xl font-bold text-slate-900 tracking-tight mb-2"
                    >
                      {{ $t("setup.step2Title") }}
                    </h3>
                    <p class="text-slate-500">
                      {{ $t("setup.step2Desc") }}
                    </p>
                  </div>

                  <!-- Device Series Selection -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-slate-700 mb-3"
                      >{{ $t("setup.deviceSeriesBoard") }}</label
                    >
                    <div class="space-y-8">
                      <div
                        v-for="(boards, seriesKey) in BOARDS"
                        :key="seriesKey"
                        class="relative"
                      >
                        <h4
                          class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"
                        >
                          <span
                            class="w-1.5 h-1.5 rounded-full bg-amnimo-400"
                          ></span>
                          Series {{ seriesKey }}
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div
                            v-for="board in boards"
                            :key="board"
                            @click="selectBoard(seriesKey, board)"
                            class="relative rounded-xl border p-4 cursor-pointer focus:outline-none transition-all duration-300 group"
                            :class="
                              formData.board === board
                                ? 'bg-amnimo-50/80 border-amnimo-500 shadow-md shadow-amnimo-500/10 scale-[1.02] ring-1 ring-amnimo-500'
                                : 'bg-slate-50/50 border-slate-200 hover:border-amnimo-300 hover:bg-white hover:shadow-soft'
                            "
                          >
                            <div class="flex items-center gap-3 w-full">
                              <div
                                class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                                :class="
                                  formData.board === board
                                    ? 'text-amnimo-600 shadow-sm'
                                    : 'text-slate-400 group-hover:text-amnimo-500 group-hover:border-amnimo-200'
                                "
                              >
                                <!-- Board Icon -->
                                <img
                                  :src="`/icons/boards/${board}.png`"
                                  alt=""
                                  class="w-full h-ful"
                                />
                              </div>
                              <div class="min-w-0 flex-1">
                                <p
                                  class="font-bold text-slate-900 text-lg group-hover:text-amnimo-700 transition-colors truncate"
                                >
                                  {{ board }}
                                </p>
                              </div>

                              <!-- Embedded Device Types (Inline) -->
                              <div
                                v-if="
                                  formData.board === board &&
                                  DEVICE_TYPES[board]?.length
                                "
                                class="flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-right-2"
                              >
                                <div
                                  class="h-5 w-px bg-slate-200 mx-1 rounded-full"
                                ></div>
                                <span
                                  class="text-[10px] uppercase text-slate-400 font-bold tracking-widest"
                                  >Type</span
                                >
                                <div
                                  v-for="dtype in DEVICE_TYPES[board]"
                                  :key="dtype"
                                  @click.stop="
                                    formData.deviceType =
                                      formData.deviceType === dtype ? '' : dtype
                                  "
                                  class="rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all duration-200 border"
                                  :class="
                                    formData.deviceType === dtype
                                      ? 'bg-amnimo-600 border-amnimo-600 text-white shadow-sm'
                                      : 'bg-white text-slate-500 border-slate-200 hover:border-amnimo-300 hover:text-amnimo-600'
                                  "
                                >
                                  {{ dtype }}
                                </div>
                              </div>

                              <div
                                class="w-6 h-6 shrink-0 ml-1 flex items-center justify-center"
                              >
                                <Icon
                                  name="heroicons:check-circle"
                                  class="w-6 h-6 text-amnimo-600 transition-all duration-300 transform"
                                  :class="
                                    formData.board === board &&
                                    (!DEVICE_TYPES[board]?.length ||
                                      formData.deviceType)
                                      ? 'opacity-100 scale-100'
                                      : 'opacity-0 scale-50'
                                  "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Base URL -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-slate-700 mb-2"
                      >{{ $t("setup.baseUrl") }}</label
                    >
                    <input
                      v-model="formData.baseUrl"
                      type="text"
                      class="block w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm focus:border-amnimo-500 focus:ring-4 focus:ring-amnimo-500/20 sm:text-base py-3 px-4 border transition-all duration-300"
                      placeholder="https://192.168.0.254"
                      required
                    />
                  </div>
                </div>

                <!-- Step 3: Env Configuration -->
                <div
                  v-else-if="currentStep === 3"
                  key="step3"
                  class="space-y-6"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <h3
                        class="text-2xl font-bold text-slate-900 tracking-tight mb-2"
                      >
                        {{ $t("setup.step3Title") }}
                      </h3>
                      <p class="text-slate-500">
                        {{ $t("setup.step3Desc") }}
                      </p>
                    </div>
                    <button
                      type="button"
                      @click="resetEnv"
                      class="text-sm font-bold text-amnimo-600 bg-amnimo-50 hover:bg-amnimo-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Icon name="heroicons:arrow-path" class="w-4 h-4" />
                      {{ $t("setup.reset") }}
                    </button>
                  </div>

                  <div
                    class="rounded-2xl shadow-soft border-slate-200 bg-white"
                  >
                    <EnvEditor
                      v-model="formData.envContent"
                      :isPlayground="formData.testType === 'playground'"
                    />
                  </div>
                </div>

                <!-- Step 4: Environment Checklist -->
                <div v-else-if="currentStep === 4" key="step4">
                  <div class="mb-6">
                    <h3
                      class="text-2xl font-bold text-slate-900 tracking-tight mb-2"
                    >
                      {{ $t("setup.step4Title") }}
                    </h3>
                    <p class="text-slate-500">
                      {{ $t("setup.step4Desc") }}
                    </p>
                  </div>

                  <!-- Masonry Layout Container -->
                  <div class="columns-1 md:columns-2 gap-6">
                    <!-- Connection Status Card -->
                    <div
                      class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 break-inside-avoid mb-6 inline-block w-full"
                      :class="
                        pingStatus === 'success'
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : pingStatus === 'failed'
                            ? 'border-red-500 bg-red-50 shadow-md shadow-red-500/10'
                            : 'border-gray-100 bg-white'
                      "
                    >
                      <div class="flex justify-between items-start mb-5">
                        <h4
                          class="font-bold flex items-center gap-2 text-lg transition-colors duration-300"
                          :class="
                            pingStatus === 'success'
                              ? 'text-emerald-700'
                              : pingStatus === 'failed'
                                ? 'text-red-700'
                                : 'text-slate-900'
                          "
                        >
                          <Icon
                            name="heroicons:wifi"
                            class="w-6 h-6 transition-colors"
                            :class="
                              pingStatus === 'success'
                                ? 'text-emerald-500'
                                : pingStatus === 'failed'
                                  ? 'text-red-600'
                                  : 'text-amnimo-500'
                            "
                          />
                          {{ $t("setup.connectionStatus") }}
                        </h4>
                        <span
                          v-if="pingStatus === 'success'"
                          class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-sm shadow-emerald-200/50 scale-105 origin-right transition-transform"
                        >
                          <Icon
                            name="heroicons:check-badge"
                            class="w-5 h-5 text-emerald-600"
                          />
                          <span class="tracking-wide uppercase text-xs">{{
                            $t("setup.online")
                          }}</span>
                        </span>
                        <span
                          v-else-if="pingStatus === 'failed'"
                          class="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-lg border border-red-300 animate-fade-in shadow-sm"
                        >
                          <Icon
                            name="heroicons:exclamation-triangle"
                            class="w-5 h-5"
                          />
                          {{ $t("setup.offline") }}
                        </span>
                      </div>

                      <div
                        class="space-y-4 mb-6 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all duration-500"
                        :class="{
                          'opacity-60 grayscale-[30%]':
                            pingStatus === 'success',
                        }"
                      >
                        <div class="flex justify-between items-center">
                          <span class="text-slate-500 font-medium">{{
                            $t("setup.device")
                          }}</span>
                          <span class="font-bold text-slate-800"
                            >{{ formData.series }} / {{ formData.board }}
                            {{ formData.deviceType }}</span
                          >
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-slate-500 font-medium">{{
                            $t("setup.targetUrl")
                          }}</span>
                          <div class="flex items-center gap-2">
                            <a
                              :href="formData.baseUrl"
                              target="_blank"
                              class="text-amnimo-600 font-semibold hover:text-amnimo-700 hover:underline flex items-center gap-1 transition-colors"
                            >
                              {{ formData.baseUrl }}
                              <Icon
                                name="heroicons:arrow-top-right-on-square"
                                class="w-4 h-4"
                              />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="flex justify-end">
                        <button
                          type="button"
                          @click="() => pingDevice()"
                          :disabled="isPinging"
                          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-amnimo-600 hover:border-amnimo-200 disabled:opacity-50 transition-all duration-300 shadow-sm active:scale-95"
                        >
                          <AppSpinner v-if="isPinging" size="md" />
                          <Icon
                            v-else
                            name="heroicons:signal"
                            class="w-5 h-5"
                          />
                          {{ $t("setup.pingDevice") }}
                        </button>
                      </div>
                    </div>

                    <template
                      v-if="currentChecklist && pingStatus === 'success'"
                    >
                      <!-- SIM Verification Card -->
                      <PeripheralSimCheck
                        v-if="
                          currentChecklist.peripherals?.some(
                            (p: any) => p.id === 'sim',
                          )
                        "
                        :base-url="formData.baseUrl"
                        v-model="checklistState.peripherals['sim']"
                        class="break-inside-avoid mb-6 w-full"
                      />

                      <!-- PoE Verification Card -->
                      <PeripheralPoeCheck
                        v-if="
                          currentChecklist.peripherals?.some(
                            (p: any) => p.id === 'poe_camera',
                          )
                        "
                        :base-url="formData.baseUrl"
                        v-model="checklistState.peripherals['poe_camera']"
                        class="break-inside-avoid mb-6 w-full"
                      />

                      <!-- Storage Verification Card -->
                      <PeripheralStorageCheck
                        v-if="
                          currentChecklist.peripherals?.some(
                            (p: any) => p.id === 'usb',
                          )
                        "
                        :base-url="formData.baseUrl"
                        :board="formData.board"
                        v-model="checklistState.peripherals['usb']"
                        class="break-inside-avoid mb-6 w-full inline-block"
                      />

                      <!-- Nx Witness Verification Card -->
                      <PeripheralNxWitnessCheck
                        v-if="
                          currentChecklist.peripherals?.some(
                            (p: any) => p.id === 'nx_witness',
                          )
                        "
                        :base-url="formData.baseUrl"
                        v-model="checklistState.peripherals['nx_witness']"
                        class="break-inside-avoid mb-6 w-full inline-block"
                      />

                      <!-- DHCP Client Verification Card -->
                      <PeripheralDhcpCheck
                        v-if="
                          currentChecklist.peripherals?.some(
                            (p: any) => p.id === 'dhcp',
                          )
                        "
                        :base-url="formData.baseUrl"
                        :dhcp-client-ip="extractedDhcpIp"
                        :username="extractedUsername"
                        :password="extractedPassword"
                        v-model="checklistState.peripherals['dhcp']"
                        class="break-inside-avoid mb-6 w-full inline-block"
                      />

                      <!-- Other Peripherals (Manual Check) -->
                      <template
                        v-if="
                          currentChecklist.peripherals?.filter(
                            (p: any) =>
                              ![
                                'sim',
                                'poe_camera',
                                'usb',
                                'sd_card',
                                'ssd',
                                'internal_storage',
                                'nx_witness',
                                'dhcp',
                              ].includes(p.id),
                          ).length
                        "
                      >
                        <div
                          v-for="item in currentChecklist.peripherals.filter(
                            (p: any) =>
                              ![
                                'sim',
                                'poe_camera',
                                'usb',
                                'sd_card',
                                'ssd',
                                'internal_storage',
                                'nx_witness',
                                'dhcp',
                              ].includes(p.id),
                          )"
                          :key="item.id"
                          class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 flex flex-col group cursor-pointer break-inside-avoid mb-6 w-full"
                          :class="
                            checklistState.peripherals[item.id]
                              ? 'border-emerald-300 bg-emerald-50/40'
                              : 'border-slate-200 bg-white hover:border-amnimo-300 hover:shadow-md'
                          "
                          @click="
                            checklistState.peripherals[item.id] =
                              !checklistState.peripherals[item.id]
                          "
                        >
                          <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3">
                              <div
                                class="p-2.5 rounded-xl transition-colors duration-300 flex items-center justify-center"
                                :class="
                                  checklistState.peripherals[item.id]
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500 group-hover:text-amnimo-600 group-hover:bg-amnimo-50'
                                "
                              >
                                <Icon :name="item.icon" class="w-6 h-6" />
                              </div>
                              <div>
                                <h4
                                  class="font-bold text-lg transition-colors duration-300"
                                  :class="
                                    checklistState.peripherals[item.id]
                                      ? 'text-emerald-800'
                                      : 'text-slate-900'
                                  "
                                >
                                  {{ item.label }}
                                </h4>
                                <p
                                  class="text-sm font-medium transition-colors"
                                  :class="
                                    checklistState.peripherals[item.id]
                                      ? 'text-emerald-600'
                                      : 'text-slate-500'
                                  "
                                >
                                  {{
                                    checklistState.peripherals[item.id]
                                      ? "Checked manually"
                                      : "Click to verify"
                                  }}
                                </p>
                              </div>
                            </div>

                            <div class="p-2">
                              <input
                                type="checkbox"
                                v-model="checklistState.peripherals[item.id]"
                                @click.stop
                                class="w-5 h-5 text-amnimo-600 rounded border-slate-300 focus:ring-amnimo-500 transition-colors cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </template>

                      <!-- Partners (Manual Check) -->
                      <template v-if="currentChecklist.partners?.length">
                        <div
                          v-for="item in currentChecklist.partners"
                          :key="item.id"
                          class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 flex flex-col group cursor-pointer break-inside-avoid mb-6 w-full"
                          :class="
                            checklistState.partners[item.id]
                              ? 'border-emerald-300 bg-emerald-50/40'
                              : 'border-slate-200 bg-white hover:border-amnimo-300 hover:shadow-md'
                          "
                          @click="
                            checklistState.partners[item.id] =
                              !checklistState.partners[item.id]
                          "
                        >
                          <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3">
                              <div
                                class="p-2.5 rounded-xl transition-colors duration-300 flex items-center justify-center"
                                :class="
                                  checklistState.partners[item.id]
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500 group-hover:text-amnimo-600 group-hover:bg-amnimo-50'
                                "
                              >
                                <Icon :name="item.icon" class="w-6 h-6" />
                              </div>
                              <div>
                                <h4
                                  class="font-bold text-lg transition-colors duration-300"
                                  :class="
                                    checklistState.partners[item.id]
                                      ? 'text-emerald-800'
                                      : 'text-slate-900'
                                  "
                                >
                                  {{ item.label }}
                                </h4>
                                <p
                                  class="text-sm font-medium transition-colors"
                                  :class="
                                    checklistState.partners[item.id]
                                      ? 'text-emerald-600'
                                      : 'text-slate-500'
                                  "
                                >
                                  {{
                                    checklistState.partners[item.id]
                                      ? "Checked manually"
                                      : "Click to verify"
                                  }}
                                </p>
                              </div>
                            </div>

                            <div class="p-2">
                              <input
                                type="checkbox"
                                v-model="checklistState.partners[item.id]"
                                @click.stop
                                class="w-5 h-5 text-amnimo-600 rounded border-slate-300 focus:ring-amnimo-500 transition-colors cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </template>

                      <!-- Manual Preps -->
                      <div
                        v-for="item in currentChecklist.manual"
                        :key="item.id"
                        class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 break-inside-avoid mb-6 w-full inline-block"
                        :class="
                          checklistState.manual[item.id]
                            ? 'border-emerald-300 bg-emerald-50/40'
                            : 'border-gray-100 bg-white hover:border-slate-300'
                        "
                      >
                        <FirmwarePreparation
                          v-if="item.id === 'fw_prep'"
                          :prev-fw="extractedPrevFw"
                          :test-fw="extractedTestFw"
                          v-model="checklistState.manual[item.id]"
                        />
                        <div v-else class="flex items-start">
                          <div class="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              v-model="checklistState.manual[item.id]"
                              class="w-5 h-5 text-amnimo-600 rounded border-slate-300 focus:ring-amnimo-500 cursor-pointer transition-colors"
                            />
                          </div>
                          <div class="ml-4">
                            <h4 class="font-bold text-slate-900">
                              {{ item.title }}
                            </h4>
                            <ul class="mt-2 space-y-1.5 text-sm text-slate-600">
                              <li
                                v-for="(inst, i) in item.instructions"
                                :key="i"
                                class="whitespace-pre-wrap leading-relaxed"
                              >
                                {{ inst }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-else-if="currentChecklist && pingStatus === 'failed'"
                      class="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-red-700 min-h-[260px] shadow-sm text-center break-inside-avoid mb-6 w-full"
                    >
                      <Icon
                        name="heroicons:exclamation-triangle"
                        class="w-12 h-12 mb-2 text-red-500"
                      />
                      <span class="font-bold text-xl tracking-tight"
                        >The device is offline.</span
                      >
                      <span class="text-sm font-medium px-4 opacity-90"
                        >Please check the device (power, network connection)
                        again to proceed with checking the next items.</span
                      >
                    </div>
                    <div
                      v-else-if="currentChecklist && pingStatus === 'idle'"
                      class="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 min-h-[260px] text-center break-inside-avoid mb-6 w-full"
                    >
                      <Icon
                        name="heroicons:cursor-arrow-rays"
                        class="w-10 h-10 mb-2 opacity-60"
                      />
                      <span class="font-bold text-xl tracking-tight"
                        >Connection Not Verified</span
                      >
                      <span class="text-sm font-medium px-4 opacity-90"
                        >Please ping the device to establish connection and
                        start the environment verification process.</span
                      >
                    </div>
                    <div
                      v-else
                      class="p-6 bg-blue-50/50 text-amnimo-800 rounded-2xl border border-amnimo-100 flex flex-col items-center justify-center font-medium min-h-[260px] text-center break-inside-avoid mb-6 w-full"
                    >
                      No specific checklist defined for this device type. You
                      can proceed.
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Fixed Action Buttons Footer -->
          <div
            class="shrink-0 bg-white/95 backdrop-blur border-t border-slate-200 px-8 py-5 flex justify-center z-40 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]"
          >
            <div class="max-w-5xl w-full flex justify-between items-center">
              <button
                type="button"
                @click="prevStep"
                :disabled="currentStep === 1 || isSaving"
                class="px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-all duration-300 shadow-sm active:scale-95"
              >
                Back
              </button>

              <button
                v-if="currentStep < steps.length"
                type="submit"
                :disabled="!isStepValid || isSaving"
                class="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-amnimo-600 rounded-xl hover:bg-amnimo-700 hover:shadow-lg hover:shadow-amnimo-500/30 disabled:opacity-50 transition-all duration-300 active:scale-95"
              >
                Next Step
                <Icon name="heroicons:arrow-right" class="w-5 h-5" />
              </button>

              <button
                v-else
                type="button"
                @click="finishSetup"
                :disabled="!isStepValid || isSaving"
                class="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all duration-300 active:scale-95"
              >
                <AppSpinner v-if="isSaving" size="md" />
                <Icon v-else name="heroicons:play" class="w-5 h-5" />
                Complete & Go to Runner
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
