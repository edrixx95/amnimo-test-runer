<script setup lang="ts">
import { useI18n } from "vue-i18n";
import InitialSetup from "~/components/manual/InitialSetup.vue";
import Sessions from "~/components/manual/Sessions.vue";
import { ref, computed } from "vue";

const { locale, t } = useI18n();

useHead({
  title: t("nav.manual") + " - Amnimo Test Runner",
});

const activeTab = ref("initialSetup");

const menuItems = computed(() => [
  {
    id: "initialSetup",
    title: "1. " + t("manual.sections.initialSetup"),
    component: InitialSetup,
  },
  {
    id: "sessions",
    title: "2. " + t("manual.sections.sessions"),
    component: Sessions,
  },
  {
    id: "firmware",
    title: "3. " + t("manual.sections.firmware"),
    component: null,
  },
  {
    id: "releaseSpec",
    title: "4. " + t("manual.sections.releaseSpec"),
    component: null,
  },
  {
    id: "settings",
    title: "5. " + t("manual.sections.settings"),
    component: null,
  },
]);

const currentMenu = computed(() =>
  menuItems.value.find((m) => m.id === activeTab.value),
);
</script>

<template>
  <div class="h-full flex flex-col bg-slate-50/50">
    <!-- Header -->
    <header
      class="h-16 flex items-center px-8 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10 relative"
    >
      <div class="flex items-center gap-4">
        <div class="p-2 bg-amnimo-50 text-amnimo-600 rounded-lg">
          <Icon name="heroicons:book-open" class="w-6 h-6" />
        </div>
        <div>
          <h2
            class="text-xl font-semibold text-slate-800 tracking-tight leading-tight"
          >
            {{ $t("nav.manual") }}
          </h2>
        </div>
      </div>
    </header>

    <!-- Main Content Area with 2 Columns -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar (Menu) -->
      <aside
        class="w-72 bg-white border-r border-slate-200 shrink-0 overflow-y-auto custom-scrollbar p-6"
      >
        <nav class="space-y-2">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeTab = item.id"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === item.id
                ? 'bg-amnimo-50 text-amnimo-700 shadow-sm ring-1 ring-amnimo-100/50'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            ]"
          >
            {{ item.title }}
          </button>
        </nav>
      </aside>

      <!-- Right Content Area -->
      <main class="flex-1 overflow-hidden bg-slate-50 relative flex flex-col">
        <div
          class="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 flex flex-col overflow-hidden"
        >
          <transition name="fade" mode="out-in">
            <div
              :key="activeTab"
              class="w-full h-full flex flex-col overflow-hidden"
            >
              <template v-if="currentMenu?.component">
                <component :is="currentMenu.component" />
              </template>
              <div
                v-else
                class="flex flex-col items-center justify-center h-full text-slate-400"
              >
                <Icon
                  name="heroicons:wrench-screwdriver"
                  class="w-16 h-16 mb-4 text-slate-300"
                />
                <p class="text-lg font-medium">
                  {{ $t("manual.sections." + activeTab) }}
                </p>
                <p class="text-sm">
                  Content for this section is currently under construction.
                </p>
              </div>
            </div>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
