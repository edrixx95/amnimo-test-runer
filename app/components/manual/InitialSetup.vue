<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="prose prose-slate max-w-none shrink-0 mb-6">
      <h1 class="text-3xl font-bold text-slate-900 border-b pb-4">
        {{ $t("manual.initialSetup.title") }}
      </h1>
      <p
        class="text-slate-600 text-lg mt-4 mb-0"
        v-html="$t('manual.initialSetup.desc')"
      ></p>
    </div>

    <div
      class="flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col"
    >
      <div
        class="flex-1 w-full h-full flex flex-col overflow-hidden p-6 md:p-10 pb-6"
      >
        <h3 class="text-lg font-bold text-slate-900 mb-4 shrink-0">
          {{ $t("manual.initialSetup.stepsTitle") }}
        </h3>

        <ManualCarousel>
          <!-- Steps 1-3 -->
          <ManualCarouselSlide>
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="md:w-1/3 shrink-0 space-y-6">
                <div class="flex items-start gap-3">
                  <span
                    class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                    >1</span
                  >
                  <p
                    class="text-slate-600 text-sm leading-relaxed mt-1"
                    v-html="$t('manual.initialSetup.step1')"
                  ></p>
                </div>
                <div class="flex items-start gap-3">
                  <span
                    class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                    >2</span
                  >
                  <p
                    class="text-slate-600 text-sm leading-relaxed mt-1"
                    v-html="$t('manual.initialSetup.step2')"
                  ></p>
                </div>
                <div class="flex items-start gap-3">
                  <span
                    class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                    >3</span
                  >
                  <p
                    class="text-slate-600 text-sm leading-relaxed mt-1"
                    v-html="$t('manual.initialSetup.step3')"
                  ></p>
                </div>
              </div>
              <div class="md:w-2/3 w-full md:sticky md:top-6 md:self-start">
                <div
                  class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                >
                  <ZoomableImage
                    src="/images/manual/initial-setup/01-welcome.png"
                    :alt="$t('manual.initialSetup.img1Alt')"
                    class="rounded-lg border border-slate-100 shadow-sm"
                  />
                </div>
                <p class="text-sm text-slate-500 italic mt-3 text-center">
                  {{ $t("manual.initialSetup.img1Caption") }}
                </p>
              </div>
            </div>
          </ManualCarouselSlide>

          <!-- Step 4 -->
          <ManualCarouselSlide>
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="md:w-1/3 shrink-0 space-y-6">
                <div class="flex items-start gap-3">
                  <span
                    class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                    >4</span
                  >
                  <div class="text-slate-600 text-sm leading-relaxed mt-1">
                    <span v-html="$t('manual.initialSetup.step4')"></span>
                    <ul class="list-disc list-outside ml-4 mt-2 space-y-2">
                      <li v-html="$t('manual.initialSetup.step4_1')"></li>
                      <li v-html="$t('manual.initialSetup.step4_2')"></li>
                      <li v-html="$t('manual.initialSetup.step4_3')"></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="md:w-2/3 w-full md:sticky md:top-6 md:self-start">
                <div
                  class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                >
                  <ZoomableImage
                    src="/images/manual/initial-setup/02-folder-select.png"
                    :alt="$t('manual.initialSetup.img2Alt')"
                    class="rounded-lg border border-slate-100 shadow-sm"
                  />
                </div>
                <p class="text-sm text-slate-500 italic mt-3 text-center">
                  {{ $t("manual.initialSetup.img2Caption") }}
                </p>
              </div>
            </div>
          </ManualCarouselSlide>

          <!-- Step 5-6 -->
          <ManualCarouselSlide>
            <div class="flex flex-col md:flex-row gap-8 items-start">
              <div class="md:w-1/3 shrink-0 space-y-6">
                <div class="flex items-start gap-3">
                  <span
                    class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                    >5</span
                  >
                  <p
                    class="text-slate-600 text-sm leading-relaxed mt-1"
                    v-html="$t('manual.initialSetup.step5')"
                  ></p>
                </div>
                <div class="flex items-start gap-3">
                  <span
                    class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amnimo-600 text-white font-bold shadow-sm"
                    >6</span
                  >
                  <p
                    class="text-slate-600 text-sm leading-relaxed mt-1"
                    v-html="$t('manual.initialSetup.step6')"
                  ></p>
                </div>
              </div>
              <div class="md:w-2/3 w-full md:sticky md:top-6 md:self-start">
                <div
                  class="rounded-xl border border-slate-200 p-2 bg-slate-50/50"
                >
                  <ZoomableImage
                    src="/images/manual/initial-setup/03-save.png"
                    :alt="$t('manual.initialSetup.img3Alt')"
                    class="rounded-lg border border-slate-100 shadow-sm"
                  />
                </div>
                <p class="text-sm text-slate-500 italic mt-3 text-center">
                  {{ $t("manual.initialSetup.img3Caption") }}
                </p>
              </div>
            </div>
          </ManualCarouselSlide>
        </ManualCarousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ManualCarousel from "./ManualCarousel.vue";
import ManualCarouselSlide from "./ManualCarouselSlide.vue";
</script>
