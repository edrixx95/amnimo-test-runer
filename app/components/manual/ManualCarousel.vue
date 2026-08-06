<template>
  <div class="relative w-full h-full flex flex-col group min-h-0">
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      class="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar scroll-smooth min-h-0"
      @scroll="handleScroll"
    >
      <slot />
    </div>

    <!-- Navigation Buttons -->
    <div
      class="shrink-0 flex items-center justify-between mt-6 pt-4 border-t border-slate-100"
    >
      <button
        @click="prev"
        :disabled="currentIndex === 0 && !hasPrevGroup"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:ring-offset-2"
        :class="
          currentIndex === 0 && !hasPrevGroup
            ? 'text-slate-400 bg-slate-100'
            : 'text-amnimo-700 bg-amnimo-50 hover:bg-amnimo-100 hover:-translate-x-0.5'
        "
      >
        <Icon name="heroicons:chevron-left" class="w-5 h-5" />
        {{
          currentIndex === 0 && hasPrevGroup
            ? $t(`${prevGroupText}`)
            : $t("common.prev") || "Back"
        }}
      </button>

      <!-- Indicators -->
      <div class="flex gap-2">
        <button
          v-for="(_, index) in totalSlides"
          :key="index"
          @click="scrollTo(index)"
          class="h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:ring-offset-2"
          :class="
            currentIndex === index
              ? 'bg-amnimo-600 w-8'
              : 'bg-slate-300 w-2.5 hover:bg-slate-400'
          "
          :aria-label="`Go to step ${index + 1}`"
        />
      </div>

      <button
        @click="next"
        :disabled="currentIndex === totalSlides - 1 && !hasNextGroup"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:ring-offset-2"
        :class="
          currentIndex === totalSlides - 1 && !hasNextGroup
            ? 'text-slate-400 bg-slate-100'
            : 'text-white bg-amnimo-600 hover:bg-amnimo-700 hover:translate-x-0.5 shadow-sm hover:shadow'
        "
      >
        {{
          currentIndex === totalSlides - 1 && hasNextGroup
            ? $t(`${nextGroupText}`)
            : $t("common.next") || "Next"
        }}
        <Icon name="heroicons:chevron-right" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
  hasNextGroup: { type: Boolean, default: false },
  hasPrevGroup: { type: Boolean, default: false },
  nextGroupText: { type: String, default: "Next Procedure" },
  prevGroupText: { type: String, default: "Previous Procedure" },
  initialSlide: { type: String, default: "first" }, // 'first' or 'last'
});

const emit = defineEmits(["nextGroup", "prevGroup"]);

const scrollContainer = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const totalSlides = ref(0);

const updateSlideCount = () => {
  if (scrollContainer.value) {
    // Count direct element children (slides)
    totalSlides.value = scrollContainer.value.children.length;
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const scrollLeft = scrollContainer.value.scrollLeft;
  const width = scrollContainer.value.clientWidth;
  if (width === 0) return;
  currentIndex.value = Math.round(scrollLeft / width);
};

const scrollTo = (index: number, behavior: ScrollBehavior = "smooth") => {
  if (!scrollContainer.value) return;
  const width = scrollContainer.value.clientWidth;
  scrollContainer.value.scrollTo({
    left: width * index,
    behavior,
  });
};

const next = () => {
  if (currentIndex.value < totalSlides.value - 1) {
    scrollTo(currentIndex.value + 1);
  } else if (props.hasNextGroup) {
    emit("nextGroup");
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    scrollTo(currentIndex.value - 1);
  } else if (props.hasPrevGroup) {
    emit("prevGroup");
  }
};

// Mutation observer to watch for slot changes if slides are loaded dynamically
let observer: MutationObserver;

onMounted(() => {
  nextTick(() => {
    updateSlideCount();
    if (props.initialSlide === "last" && totalSlides.value > 0) {
      currentIndex.value = totalSlides.value - 1;
      scrollTo(currentIndex.value, "instant" as ScrollBehavior); // Jump to last without animation
    }
  });

  if (scrollContainer.value) {
    observer = new MutationObserver(() => {
      updateSlideCount();
    });
    observer.observe(scrollContainer.value, { childList: true });
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
