<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="prose prose-slate max-w-none shrink-0 mb-6">
      <h1 class="text-3xl font-bold text-slate-900 border-b pb-4">
        {{ $t("manual.sessions.page.title") }}
      </h1>
      <p
        class="text-slate-600 text-lg mt-4 mb-0"
        v-html="$t('manual.sessions.page.desc')"
      ></p>
    </div>

    <!-- Step Tabs -->
    <div class="flex items-center gap-2 mb-6 shrink-0 pl-1">
      <button
        @click="handleTabClick('create')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amnimo-500"
        :class="
          activeSubTab === 'create'
            ? 'bg-amnimo-100 text-amnimo-700 shadow-sm ring-1 ring-amnimo-200'
            : 'text-slate-500 hover:bg-slate-200 ring-1 ring-amnimo-200'
        "
      >
        {{ $t("manual.sessions.page.heading") }}
      </button>
      <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400" />
      <button
        @click="handleTabClick('setup')"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amnimo-500"
        :class="
          activeSubTab === 'setup'
            ? 'bg-amnimo-100 text-amnimo-700 shadow-sm ring-1 ring-amnimo-200'
            : 'text-slate-500 hover:bg-slate-200 ring-1 ring-amnimo-200'
        "
      >
        {{ $t("manual.sessionSetup.page.title") }}
      </button>
    </div>

    <!-- Main Content Area -->
    <div
      class="flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col"
    >
      <transition :name="transitionName" mode="out-in">
        <div
          :key="activeSubTab"
          class="flex-1 w-full h-full flex flex-col overflow-hidden p-6 pb-6"
        >
          <!-- Tab 1: Create Session -->
          <template v-if="activeSubTab === 'create'">
            <ManualCarousel
              :hasNextGroup="true"
              nextGroupText="common.NextProcedure"
              :initialSlide="targetInitialSlide"
              @nextGroup="handleNextGroup"
            >
              <!-- Step 1 -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >1</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessions.page.step1Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-sm leading-relaxed"
                      v-html="$t('manual.sessions.page.step1Desc')"
                    ></p>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/create-session/01-session-dashboard.png"
                        :alt="$t('manual.sessions.page.img1Alt')"
                        class="rounded-lg border border-slate-100 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Step 2 -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >2</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessions.page.step2Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-sm leading-relaxed"
                      v-html="$t('manual.sessions.page.step2Desc')"
                    ></p>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/create-session/02-new-session-dialog.png"
                        :alt="$t('manual.sessions.page.img2Alt')"
                        class="rounded-lg border border-slate-100 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Step 3 -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >3</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessions.page.step3Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-sm leading-relaxed"
                      v-html="$t('manual.sessions.page.step3Desc')"
                    ></p>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/create-session/03-session-setup.png"
                        :alt="$t('manual.sessions.page.img3Alt')"
                        class="rounded-lg border border-slate-100 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Note Section (Step 4) -->
              <ManualCarouselSlide>
                <div
                  class="flex flex-col md:flex-row gap-8 items-start bg-blue-50/50 border border-blue-100 p-6 md:p-8 rounded-2xl mb-4"
                >
                  <div class="md:w-1/3 shrink-0">
                    <div class="flex items-center gap-2 mb-3 text-blue-700">
                      <Icon
                        name="heroicons:information-circle-solid"
                        class="w-6 h-6"
                      />
                      <h4 class="font-bold text-lg">
                        {{ $t("manual.sessions.page.noteTitle") }}
                      </h4>
                    </div>
                    <p
                      class="text-blue-800/80 text-sm leading-relaxed"
                      v-html="$t('manual.sessions.page.noteDesc')"
                    ></p>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-blue-200/50 p-2 bg-white/60"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/create-session/04-session-draft.png"
                        :alt="$t('manual.sessions.page.img4Alt')"
                        class="rounded-lg shadow-sm border border-blue-100/50"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>
            </ManualCarousel>
          </template>

          <!-- Tab 2: Session Setup -->
          <template v-else-if="activeSubTab === 'setup'">
            <ManualCarousel
              :hasPrevGroup="true"
              prevGroupText="common.PrevProcedure"
              :initialSlide="targetInitialSlide"
              @prevGroup="handlePrevGroup"
            >
              <!-- Step 1: Test Execution Type -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0 space-y-6">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >1</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessionSetup.page.step1Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-base leading-relaxed"
                      v-html="$t('manual.sessionSetup.page.typeDesc')"
                    ></p>
                    <ul
                      class="list-disc list-outside ml-5 space-y-3 text-slate-700 text-sm"
                    >
                      <li
                        v-html="$t('manual.sessionSetup.page.typeRelease')"
                      ></li>
                      <li
                        v-html="$t('manual.sessionSetup.page.typeSystem')"
                      ></li>
                      <li
                        v-html="$t('manual.sessionSetup.page.typePlayground')"
                      ></li>
                    </ul>
                    <div
                      class="ml-11 mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800"
                      v-html="$t('manual.sessionSetup.page.typeNote')"
                    ></div>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/setup/01-session-setup.png"
                        alt="Execution Type"
                        class="rounded-lg border border-slate-100 shadow-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Step 2: Target Device -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0 space-y-6">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >2</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessionSetup.page.step2Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-base leading-relaxed"
                      v-html="$t('manual.sessionSetup.page.deviceDesc')"
                    ></p>
                    <ul
                      class="list-disc list-outside ml-5 space-y-3 text-slate-700 text-sm"
                    >
                      <li class="space-y-2">
                        <span
                          v-html="$t('manual.sessionSetup.page.deviceBoard')"
                        ></span>
                        <div class="pt-2 w-full max-w-sm">
                          <div
                            class="relative rounded-xl border p-4 cursor-pointer focus:outline-none transition-all duration-300 group bg-amnimo-50/80 border-amnimo-500 shadow-md shadow-amnimo-500/10 scale-[1.02] ring-1 ring-amnimo-500"
                          >
                            <div class="flex items-center gap-3 w-full">
                              <div
                                class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors text-amnimo-600 shadow-sm"
                              >
                                <img
                                  src="/icons/boards/AX30.png"
                                  alt="AX30"
                                  class="w-full h-full object-contain"
                                />
                              </div>
                              <div class="min-w-0 flex-1">
                                <p
                                  class="font-bold text-slate-900 text-lg group-hover:text-amnimo-700 transition-colors truncate"
                                >
                                  AX30
                                </p>
                              </div>
                              <div
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
                                  class="rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all duration-200 border bg-amnimo-600 border-amnimo-600 text-white shadow-sm"
                                >
                                  A
                                </div>
                                <div
                                  class="rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all duration-200 border bg-white text-slate-500 border-slate-200 hover:border-amnimo-300 hover:text-amnimo-600"
                                >
                                  B
                                </div>
                              </div>
                              <div
                                class="w-6 h-6 shrink-0 ml-1 flex items-center justify-center"
                              >
                                <Icon
                                  name="heroicons:check-circle"
                                  class="w-6 h-6 text-amnimo-600 transition-all duration-300 transform opacity-100 scale-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="space-y-2">
                        <span
                          v-html="$t('manual.sessionSetup.page.deviceUrl')"
                        ></span>
                        <div
                          class="pt-2 w-full max-w-sm opacity-90 pointer-events-none select-none"
                        >
                          <div>
                            <label
                              class="block text-sm font-semibold text-slate-700 mb-2"
                              >ベースURL</label
                            >
                            <input
                              type="text"
                              class="block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-600 shadow-sm sm:text-base py-3 px-4 border transition-all duration-300"
                              value="https://192.168.0.254"
                              readonly
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/setup/02-target-board.png"
                        alt="Target Device"
                        class="rounded-lg border border-slate-100 shadow-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Step 3: Environment Variables -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0 space-y-6">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >3</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessionSetup.page.step3Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-base leading-relaxed"
                      v-html="$t('manual.sessionSetup.page.envDesc')"
                    ></p>

                    <div class="space-y-4">
                      <h4 class="font-semibold text-slate-800 border-b pb-1">
                        {{ $t("manual.sessionSetup.page.envDevice") }}
                      </h4>
                      <ul
                        class="list-disc list-outside ml-4 space-y-2 text-slate-700 text-sm"
                      >
                        <li
                          v-html="$t('manual.sessionSetup.page.envDevice1')"
                        ></li>
                        <li
                          v-html="$t('manual.sessionSetup.page.envDevice2')"
                        ></li>
                        <li
                          v-html="$t('manual.sessionSetup.page.envDevice3')"
                        ></li>
                      </ul>

                      <h4
                        class="font-semibold text-slate-800 border-b pb-1 pt-4"
                      >
                        {{ $t("manual.sessionSetup.page.envNetwork") }}
                      </h4>
                      <ul
                        class="list-disc list-outside ml-4 space-y-2 text-slate-700 text-sm"
                      >
                        <li
                          v-html="$t('manual.sessionSetup.page.envNetwork1')"
                        ></li>
                        <li
                          v-html="$t('manual.sessionSetup.page.envNetwork2')"
                        ></li>
                      </ul>
                      <div
                        class="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-800 mt-2 flex gap-2"
                      >
                        <Icon
                          name="heroicons:exclamation-triangle"
                          class="w-5 h-5 shrink-0"
                        />
                        <span
                          v-html="$t('manual.sessionSetup.page.envNetworkNote')"
                        ></span>
                      </div>

                      <h4
                        class="font-semibold text-slate-800 border-b pb-1 pt-4"
                      >
                        {{ $t("manual.sessionSetup.page.envConst") }}
                      </h4>
                      <ul
                        class="list-disc list-outside ml-4 space-y-2 text-slate-700 text-sm"
                      >
                        <li
                          v-html="$t('manual.sessionSetup.page.envConst1')"
                        ></li>
                      </ul>

                      <div
                        class="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 mt-4 flex gap-2"
                      >
                        <Icon
                          name="heroicons:light-bulb"
                          class="w-5 h-5 shrink-0 text-blue-500"
                        />
                        <span
                          v-html="$t('manual.sessionSetup.page.envNote')"
                        ></span>
                      </div>
                    </div>
                  </div>

                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/setup/03-env.png"
                        alt="Environment Variables"
                        class="rounded-lg border border-slate-100 shadow-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Step 4: Environment Check -->
              <ManualCarouselSlide>
                <div class="flex flex-col md:flex-row gap-8 items-start pb-4">
                  <div class="md:w-1/3 shrink-0 space-y-6">
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >4</span
                      >
                      <h3 class="font-bold text-lg text-slate-900">
                        {{ $t("manual.sessionSetup.page.step4Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-base leading-relaxed"
                      v-html="$t('manual.sessionSetup.page.checkDesc')"
                    ></p>

                    <ul
                      class="list-disc list-outside ml-5 space-y-3 text-slate-700 text-sm"
                    >
                      <li v-html="$t('manual.sessionSetup.page.check1')"></li>
                      <li v-html="$t('manual.sessionSetup.page.check2')"></li>
                      <li v-html="$t('manual.sessionSetup.page.check3')"></li>
                      <li v-html="$t('manual.sessionSetup.page.check4')"></li>
                      <li v-html="$t('manual.sessionSetup.page.check5')"></li>
                      <li v-html="$t('manual.sessionSetup.page.check6')"></li>
                      <li v-html="$t('manual.sessionSetup.page.check7')"></li>
                    </ul>
                  </div>
                  <div class="md:w-2/3 w-full sticky top-0">
                    <div
                      class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                    >
                      <ZoomableImage
                        src="/images/manual/sessions/setup/04-env-check.png"
                        alt="Environment Check"
                        class="rounded-lg border border-slate-100 shadow-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </ManualCarouselSlide>

              <!-- Step 5: Complete & Go to Runner -->
              <ManualCarouselSlide>
                <div
                  class="flex flex-col items-center justify-center h-full py-12 gap-8 text-center pb-8"
                >
                  <div
                    class="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center"
                  >
                    <Icon name="heroicons:check" class="w-10 h-10" />
                  </div>
                  <div class="w-full max-w-lg shrink-0 space-y-6">
                    <div class="flex items-center justify-center gap-3 mb-3">
                      <span
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                        >5</span
                      >
                      <h3 class="font-bold text-2xl text-slate-900">
                        {{ $t("manual.sessionSetup.page.step5Heading") }}
                      </h3>
                    </div>
                    <p
                      class="text-slate-600 text-lg leading-relaxed break-words text-wrap"
                      v-html="$t('manual.sessionSetup.page.completeDesc')"
                    ></p>
                  </div>
                </div>
              </ManualCarouselSlide>
            </ManualCarousel>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ManualCarousel from "./ManualCarousel.vue";
import ManualCarouselSlide from "./ManualCarouselSlide.vue";

const activeSubTab = ref<"create" | "setup">("create");
const transitionName = ref("slide-next");
const targetInitialSlide = ref<"first" | "last">("first");

const handleTabClick = (tab: "create" | "setup") => {
  if (tab === activeSubTab.value) return;
  // If moving from create to setup, it's next. If moving from setup to create, it's prev.
  if (tab === "setup") {
    transitionName.value = "slide-next";
    targetInitialSlide.value = "first";
  } else {
    transitionName.value = "slide-prev";
    targetInitialSlide.value = "first"; // When clicked directly on tab, usually go to first step
  }
  activeSubTab.value = tab;
};

const handleNextGroup = () => {
  transitionName.value = "slide-next";
  targetInitialSlide.value = "first";
  activeSubTab.value = "setup";
};

const handlePrevGroup = () => {
  transitionName.value = "slide-prev";
  targetInitialSlide.value = "last"; // Returning via back button goes to last step
  activeSubTab.value = "create";
};
</script>

<style scoped>
/* Forward transition */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-next-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Backward transition */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
