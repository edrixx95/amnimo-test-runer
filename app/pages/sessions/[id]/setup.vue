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
          Setup:
          <span class="text-amnimo-600 font-semibold">{{
            session?.name || session?.id || "..."
          }}</span>
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-semibold text-amnimo-600 bg-amnimo-50 px-3 py-1.5 rounded-full uppercase tracking-wider"
          >Step {{ currentStep }} of {{ steps.length }}</span
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
          <AppLoader size="md" text="Loading Environment..." />
        </div>

        <form
          v-else
          @submit.prevent="nextStep"
          class="flex-1 flex flex-col min-h-0"
        >
          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto p-8 md:p-12 bg-slate-50/50">
            <div class="max-w-5xl mx-auto">
              <Transition name="step" mode="out-in">
                <!-- Step 1: Test Type -->
                <div v-if="currentStep === 1" key="step1" class="space-y-8">
                  <div>
                    <h3
                      class="text-2xl font-bold text-slate-900 tracking-tight mb-2"
                    >
                      Test Execution Type
                    </h3>
                    <p class="text-slate-500">
                      Select the scope and type of tests to run.
                    </p>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        Release Test
                      </h4>
                      <p
                        class="text-sm text-slate-500 leading-relaxed font-medium"
                      >
                        Comprehensive suite for release qualification. Runs
                        through the complete test order.
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
                        System Test
                      </h4>
                      <p
                        class="text-sm text-slate-500 leading-relaxed font-medium"
                      >
                        Select specific features for testing. Ideal for focused
                        validations.
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
                        Playground
                      </h4>
                      <p
                        class="text-sm text-slate-500 leading-relaxed font-medium"
                      >
                        Flexible environment for experimental testing. Skips environment checks.
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
                      Target Device
                    </h3>
                    <p class="text-slate-500">
                      Select the device you want to test and its connection
                      details.
                    </p>
                  </div>

                  <!-- Device Series Selection -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-slate-700 mb-3"
                      >Device Series & Board</label
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
                                  @click.stop="formData.deviceType = dtype"
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
                      >Base URL</label
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
                        Environment Variables
                      </h3>
                      <p class="text-slate-500">
                        Review and configure the .env file contents for this
                        test run.
                      </p>
                    </div>
                    <button
                      type="button"
                      @click="resetEnv"
                      class="text-sm font-bold text-amnimo-600 bg-amnimo-50 hover:bg-amnimo-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Icon name="heroicons:arrow-path" class="w-4 h-4" /> Reset
                    </button>
                  </div>

                  <div
                    class="rounded-2xl shadow-soft border-slate-200 bg-white"
                  >
                    <EnvEditor v-model="formData.envContent" :isPlayground="formData.testType === 'playground'" />
                  </div>
                </div>

                <!-- Step 4: Environment Checklist -->
                <div v-else-if="currentStep === 4" key="step4">
                  <div class="mb-6">
                    <h3
                      class="text-2xl font-bold text-slate-900 tracking-tight mb-2"
                    >
                      Environment Check
                    </h3>
                    <p class="text-slate-500">
                      Verify your local environment is ready for testing.
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
                          Connection Status
                        </h4>
                        <span
                          v-if="pingStatus === 'success'"
                          class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-sm shadow-emerald-200/50 scale-105 origin-right transition-transform"
                        >
                          <Icon
                            name="heroicons:check-badge"
                            class="w-5 h-5 text-emerald-600"
                          />
                          <span class="tracking-wide uppercase text-xs"
                            >Online</span
                          >
                        </span>
                        <span
                          v-else-if="pingStatus === 'failed'"
                          class="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-lg border border-red-300 animate-fade-in shadow-sm"
                        >
                          <Icon
                            name="heroicons:exclamation-triangle"
                            class="w-5 h-5"
                          />
                          Offline
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
                          <span class="text-slate-500 font-medium">Device</span>
                          <span class="font-bold text-slate-800"
                            >{{ formData.series }} / {{ formData.board }}
                            {{ formData.deviceType }}</span
                          >
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-slate-500 font-medium"
                            >Target URL</span
                          >
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
                          @click="pingDevice"
                          :disabled="isPinging"
                          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-amnimo-600 hover:border-amnimo-200 disabled:opacity-50 transition-all duration-300 shadow-sm active:scale-95"
                        >
                          <AppSpinner v-if="isPinging" size="md" />
                          <Icon
                            v-else
                            name="heroicons:signal"
                            class="w-5 h-5"
                          />
                          Ping Device
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
                            (p) => p.id === 'sim',
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
                            (p) => p.id === 'poe_camera',
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
                            (p) => p.id === 'usb',
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
                            (p) => p.id === 'nx_witness',
                          )
                        "
                        :base-url="formData.baseUrl"
                        v-model="checklistState.peripherals['nx_witness']"
                        class="break-inside-avoid mb-6 w-full inline-block"
                      />

                      <!-- Other Peripherals (Manual Check) -->
                      <template
                        v-if="
                          currentChecklist.peripherals?.filter(
                            (p) =>
                              ![
                                'sim',
                                'poe_camera',
                                'usb',
                                'sd_card',
                                'ssd',
                                'internal_storage',
                                'nx_witness',
                              ].includes(p.id),
                          ).length
                        "
                      >
                        <div
                          v-for="item in currentChecklist.peripherals.filter(
                            (p) =>
                              ![
                                'sim',
                                'poe_camera',
                                'usb',
                                'sd_card',
                                'ssd',
                                'internal_storage',
                                'nx_witness',
                              ].includes(p.id),
                          )"
                          :key="item.id"
                          class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 flex flex-col group cursor-pointer break-inside-avoid mb-6 w-full inline-block"
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
                          class="rounded-2xl border-2 p-6 shadow-soft transition-all duration-300 flex flex-col group cursor-pointer break-inside-avoid mb-6 w-full inline-block"
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
                            : 'border-gray-100 bg-white'
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
                      class="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-red-700 min-h-[260px] shadow-sm text-center break-inside-avoid mb-6 w-full inline-block"
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
                      class="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 min-h-[260px] text-center break-inside-avoid mb-6 w-full inline-block"
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
                      class="p-6 bg-blue-50/50 text-amnimo-800 rounded-2xl border border-amnimo-100 flex flex-col items-center justify-center font-medium min-h-[260px] text-center break-inside-avoid mb-6 w-full inline-block"
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

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  BOARDS,
  DEVICE_TYPES,
  CHECKLISTS,
  getFirmwarePrefix,
} from "~~/shared/constants";
import type { Session } from "~~/shared/types";

const route = useRoute();
const router = useRouter();
const sessionId = route.params.id as string;

const session = ref<Session | null>(null);
const isLoadingSession = ref(true);
const isSaving = ref(false);

const currentStep = ref(1);

const steps = computed(() => {
  if (formData.value.testType === 'playground') {
    return [
      { name: "Test Scope", description: "Select execution mode" },
      { name: "Target Device", description: "Select model and address" },
      { name: "Env Config", description: "Review .env variables" }
    ];
  }
  return [
    { name: "Test Scope", description: "Release or System test" },
    { name: "Target Device", description: "Select model and address" },
    { name: "Env Config", description: "Review .env variables" },
    { name: "Environment Check", description: "Verify network and peripherals" },
  ];
});

const formData = ref({
  series: "",
  board: "",
  deviceType: "",
  baseUrl: "https://192.168.0.254",
  envContent: "",
  testType: "release" as "release" | "system" | "playground",
});

// Extract firmwares for step 4 firmware preparation
const extractedPrevFw = computed(() => {
  const match = formData.value.envContent.match(/^PREV_FIRMWARE_NAME=(.*)$/m);
  return match ? match[1].trim() : "";
});

const extractedTestFw = computed(() => {
  const match = formData.value.envContent.match(/^TEST_FIRMWARE_NAME=(.*)$/m);
  return match ? match[1].trim() : "";
});

// Load session data
onMounted(async () => {
  try {
    const data = await $fetch<Session>(`/api/sessions/${sessionId}`);
    session.value = data;
    if (data.series) formData.value.series = data.series;
    if (data.board) formData.value.board = data.board;
    if (data.deviceType) formData.value.deviceType = data.deviceType;
    if (data.baseUrl) formData.value.baseUrl = data.baseUrl;
    if (data.envContent) formData.value.envContent = data.envContent;
    if (data.testType) formData.value.testType = data.testType;

    if (route.query.step) {
      const s = parseInt(route.query.step as string);
      if (!isNaN(s) && s >= 1 && s <= 4) {
        currentStep.value = s;
      }
    }
  } catch (err) {
    console.error("Failed to load session:", err);
    alert("Session not found");
    router.push("/");
  } finally {
    isLoadingSession.value = false;
  }
});

// Step 1 Logic
const availableDeviceTypes = computed(() => {
  if (!formData.value.board) return [];
  return DEVICE_TYPES[formData.value.board] || [];
});

const selectBoard = (series: string, board: string) => {
  formData.value.series = series;
  formData.value.board = board;
  formData.value.deviceType = ""; // Reset type
};

// Step 2 Logic
const pingStatus = ref<"idle" | "pinging" | "success" | "failed">("idle");
const isPinging = computed(() => pingStatus.value === "pinging");
let pingInterval: any = null;

const checklistState = ref({
  peripherals: {} as Record<string, boolean>,
  partners: {} as Record<string, boolean>,
  manual: {} as Record<string, boolean>,
});

const currentChecklistKey = computed(() => {
  let key = formData.value.board;
  if (formData.value.deviceType) {
    key += ` ${formData.value.deviceType}`;
  }
  return key;
});

const currentChecklist = computed(() => {
  return (CHECKLISTS as any)[currentChecklistKey.value];
});

// Reset checklist state when device changes
watch(currentChecklistKey, () => {
  pingStatus.value = "idle";
  checklistState.value = { peripherals: {}, partners: {}, manual: {} };
});

const pingDevice = async (silent = false) => {
  if (!silent) pingStatus.value = "pinging";
  try {
    const ipMatch = formData.value.baseUrl.match(/https?:\/\/([^:]+)/);
    const ip = ipMatch ? ipMatch[1] : formData.value.baseUrl;

    const res = await $fetch<{ success: boolean }>("/api/network/ping", {
      method: "POST",
      body: { ip },
    });

    if (res.success) {
      // If we just transitioned to success, check if device needs initial setup
      if (pingStatus.value !== "success") {
        try {
          await $fetch("/api/proxy/device/startup-check", {
            method: "POST",
            body: {
              targetUrl: formData.value.baseUrl,
              defaultPassword: "yoko1234",
            },
          });
        } catch (startupErr) {
          console.warn("Startup check failed or not applicable:", startupErr);
        }
      }
      pingStatus.value = "success";
    } else {
      pingStatus.value = "failed";
    }
  } catch (err) {
    pingStatus.value = "failed";
  }
};

const startPingPolling = () => {
  stopPingPolling();
  pingDevice(pingStatus.value !== "idle"); // If idle, show loading, otherwise silent
  pingInterval = setInterval(() => {
    pingDevice(true);
  }, 3000);
};

const stopPingPolling = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
};

watch(currentStep, (newStep) => {
  if (newStep === 4) {
    startPingPolling();
  } else {
    stopPingPolling();
  }
});

import { onUnmounted } from "vue";
onUnmounted(() => {
  stopPingPolling();
});

watch(currentStep, (newStep) => {
  if (newStep === 3) {
    pingDevice();
  }
});

// Step 3 Logic
const DEFAULT_ENV_TEMPLATE = `# ====================================================
# [ブロック1] 機種・テストごとの変更項目
# ====================================================

# テスト対象のボード名とシリーズ名
BOARD=
SERIES=

# 読み込む設定ファイルを切り替えるため、対象機種に応じて以下を指定してください（不要な場合は空欄）
# - AC15/AC25 : V2A または V3A
# - ARシリーズ: WoM または 空欄
# - AX30      : A または B
DEVICE_TYPE=

# リリースFWの｢1つ前｣のバージョンのFWファイル名
PREV_FIRMWARE_NAME=

# 今回テストするリリースFWのファイル名
TEST_FIRMWARE_NAME=

# ====================================================
# [ブロック2] テスト環境（担当者）ごとの設定項目
# ※初回セットアップ時にご自身の環境に合わせて設定し、以降は使い回します。
# ====================================================

# ファイルサーバーのアクセスURLとポート（ポート指定がない場合は空欄）
# ※URLには必要に応じてパス（/firmwareなど）まで含めて設定してください
PC_SERVER_URL=http://192.168.0.6
PC_SERVER_PORT=10068

# テストに使用するインターネット回線設定
# ※注意：GUIアクセス用ネットワーク(192.168.0.x)とアドレス帯が重複しないよう設定してください。
INTERNET_ADDRESS=192.168.1.90/24
INTERNET_GATEWAY_ADDRESS=192.168.1.10

# テストに使用するSIM情報
SIM_APN=soracom.io
SIM_USERNAME=sora
SIM_PASSWORD=sora

# ====================================================
# [ブロック3] システム固定値（変更禁止）
# ====================================================

# デバイス接続情報（デフォルト設定）
BASE_URL=https://192.168.0.254
HOST=192.168.0.254

# 認証情報
TEST_USERNAME=admin
TEST_PASSWORD=yoko1234

# CLIバックエンド接続情報
CLI_SERVER_URL=http://localhost
CLI_SERVER_PORT=8080`;

const updateEnvVariables = () => {
  let env = formData.value.envContent || DEFAULT_ENV_TEMPLATE;

  // If the env doesn't contain the standard comments block, it was probably saved in an older format.
  // We will re-apply the template to restore comments but keep the current values.
  if (!env.includes("# [ブロック1]")) {
    const oldValues: Record<string, string> = {};
    env.split("\n").forEach((line) => {
      const idx = line.indexOf("=");
      if (idx > -1 && !line.trim().startsWith("#")) {
        const k = line.substring(0, idx).trim();
        const v = line.substring(idx + 1).trim();
        oldValues[k] = v;
      }
    });

    env = DEFAULT_ENV_TEMPLATE;

    const mergeUpsert = (key: string, value: string) => {
      if (!value) return;
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (env.match(regex)) {
        env = env.replace(regex, `${key}=${value}`);
      } else {
        env += (env && !env.endsWith("\n") ? "\n" : "") + `${key}=${value}`;
      }
    };

    Object.entries(oldValues).forEach(([k, v]) => mergeUpsert(k, v));
  }

  const upsert = (key: string, value: string) => {
    if (value === undefined || value === null) return;
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (env.match(regex)) {
      env = env.replace(regex, `${key}=${value}`);
    } else {
      env += (env && !env.endsWith("\n") ? "\n" : "") + `${key}=${value}`;
    }
  };

  upsert("BOARD", formData.value.board);
  upsert("SERIES", formData.value.series);

  let deviceTypeValue = formData.value.deviceType || "";
  if (formData.value.board === "AR10" && deviceTypeValue.toLowerCase() === "normal") {
    deviceTypeValue = "";
  }
  upsert("DEVICE_TYPE", deviceTypeValue);
  
  upsert("BASE_URL", formData.value.baseUrl);

  try {
    const host = new URL(formData.value.baseUrl).hostname;
    upsert("HOST", host || formData.value.baseUrl.replace(/^https?:\/\//, ""));
  } catch (e) {
    upsert("HOST", formData.value.baseUrl.replace(/^https?:\/\//, ""));
  }

  // Set defaults if not exist
  if (!env.includes("TEST_USERNAME=")) upsert("TEST_USERNAME", "admin");
  if (!env.includes("TEST_PASSWORD=")) upsert("TEST_PASSWORD", "yoko1234");
  if (!env.includes("CLI_SERVER_URL="))
    upsert("CLI_SERVER_URL", "http://localhost");
  if (!env.includes("CLI_SERVER_PORT=")) upsert("CLI_SERVER_PORT", "8080");

  formData.value.envContent = env;
};

const resetEnv = () => {
  formData.value.envContent = DEFAULT_ENV_TEMPLATE;
  updateEnvVariables();
};

// Auto update env when device settings change
watch(
  [
    () => formData.value.board,
    () => formData.value.series,
    () => formData.value.deviceType,
    () => formData.value.baseUrl,
  ],
  () => {
    if (formData.value.board) {
      updateEnvVariables();
    }
  },
);

// Navigation Logic
const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    // Test Scope
    return !!formData.value.testType;
  }
  if (currentStep.value === 2) {
    // Target Device
    if (!formData.value.board || !formData.value.baseUrl) return false;
    if (availableDeviceTypes.value.length > 0 && !formData.value.deviceType)
      return false;
    return true;
  }
  if (currentStep.value === 3) {
    // Env Config
    return formData.value.envContent.length > 0;
  }
  if (currentStep.value === 4) {
    // Environment Check
    if (pingStatus.value !== "success") return false;

    const cl = currentChecklist.value;
    if (cl) {
      // Check all peripherals checked
      for (const p of cl.peripherals || []) {
        if (!checklistState.value.peripherals[p.id]) return false;
      }
      for (const p of cl.partners || []) {
        if (!checklistState.value.partners[p.id]) return false;
      }
      for (const p of cl.manual || []) {
        if (!checklistState.value.manual[p.id]) return false;
      }
    }
    return true;
  }
  return true;
});

const saveProgress = async () => {
  isSaving.value = true;
  try {
    await $fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      body: formData.value,
    });
  } catch (err) {
    console.error("Failed to save progress", err);
  } finally {
    isSaving.value = false;
  }
};

const lastAutoFilledBoard = ref<string>("");

const nextStep = async () => {
  if (!isStepValid.value) return;

  if (
    currentStep.value === 2 &&
    lastAutoFilledBoard.value !== formData.value.board
  ) {
    try {
      const allFirmwares = await $fetch<string[]>("/api/firmwares");
      if (allFirmwares && allFirmwares.length > 0) {
        const boardName = formData.value.board.toLowerCase();
        const requiredPrefix = getFirmwarePrefix(boardName);

        const boardFws = allFirmwares.filter((fw) => {
          const isBootloader = fw.toLowerCase().includes("bootloader");
          // Allow any string between version and build (e.g. -release-)
          const isValid = /^.*-v?\d+\.\d+\.\d+.*-b\d+.*\.amf$/i.test(fw);
          if (isBootloader || !isValid) return false;

          const prefix = fw.split("-")[0]?.toLowerCase() || "";
          return prefix === requiredPrefix;
        });

        if (boardFws.length > 0) {
          const testFw = boardFws[0]; // Already sorted numerically descending by API

          // Helper to extract base version (e.g., "3.8.0" from "ax30-3.8.0-release-b123.amf")
          const getBaseVersion = (fw: string) => {
            const match = fw.match(/-(v?\d+\.\d+\.\d+)/);
            return match ? match[1] : fw;
          };

          const testBaseVer = getBaseVersion(testFw!);
          let prevFw = "";

          // Find the first firmware that belongs to an older version
          for (let i = 1; i < boardFws.length; i++) {
            if (getBaseVersion(boardFws[i]!) !== testBaseVer) {
              prevFw = boardFws[i]!;
              break;
            }
          }

          let env = formData.value.envContent;
          const upsert = (key: string, value: string) => {
            if (!value) return;
            const regex = new RegExp(`^${key}=.*$`, "m");
            if (env.match(regex)) {
              env = env.replace(regex, `${key}=${value}`);
            } else {
              env +=
                (env && !env.endsWith("\n") ? "\n" : "") + `${key}=${value}`;
            }
          };

          upsert("TEST_FIRMWARE_NAME", testFw!);
          if (prevFw) {
            upsert("PREV_FIRMWARE_NAME", prevFw);
          }

          formData.value.envContent = env;
        }
      }
      lastAutoFilledBoard.value = formData.value.board;
    } catch (err) {
      console.error("Failed to auto-select firmware:", err);
    }
  }

  await saveProgress();
  if (currentStep.value < steps.value.length) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const finishSetup = async () => {
  if (!isStepValid.value) return;
  await saveProgress();
  // Status is now preparing or ready
  const nextStatus = formData.value.testType === 'playground' ? 'Ready' : 'Preparing';
  await $fetch(`/api/sessions/${sessionId}`, {
    method: "PUT",
    body: { status: nextStatus },
  });
  router.push(`/sessions/${sessionId}/runner`);
};
</script>

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
