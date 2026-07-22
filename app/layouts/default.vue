<template>
  <div class="flex h-screen w-full font-sans bg-slate-50">
    <!-- Sidebar -->
    <aside 
      class="bg-white border-r border-gray-100 shadow-soft flex flex-col z-10 transition-[width] duration-300 ease-out relative"
      :style="{ width: isCollapsed ? '80px' : '256px' }"
    >
      <!-- Logo Section as Toggle Button -->
      <button 
        @click="toggleSidebar"
        class="h-16 w-full flex items-center border-b border-gray-100 bg-white overflow-hidden shrink-0 relative hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
        title="Toggle Sidebar"
      >
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300" :class="isCollapsed ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'">
          <img src="/amnimo-icon.ico" class="w-8 h-8 object-contain" alt="Amnimo" />
        </div>
        <div class="absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 whitespace-nowrap" :class="isCollapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'">
          <AmnimoLogo class="h-6 w-auto text-amnimo-900" />
        </div>
      </button>
      
      <!-- Navigation -->
      <nav class="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <!-- Sessions Link (Home) -->
        <UTooltip text="Sessions" :disabled="!isCollapsed" placement="right" :popper="{ arrow: true }">
          <NuxtLink
            to="/"
            class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
            active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          >
            <Icon name="heroicons:queue-list" class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-300" :class="isCollapsed ? 'opacity-0' : 'opacity-100'">
              Sessions
            </span>
          </NuxtLink>
        </UTooltip>

        <!-- Firmware Link -->
        <UTooltip text="Firmware" :disabled="!isCollapsed" placement="right" :popper="{ arrow: true }">
          <NuxtLink
            to="/firmware"
            class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
            active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          >
            <Icon name="heroicons:cpu-chip" class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-300" :class="isCollapsed ? 'opacity-0' : 'opacity-100'">
              Firmware
            </span>
          </NuxtLink>
        </UTooltip>

        <!-- Add more nav items here in the future following the same pattern -->
      </nav>

      <!-- Bottom Settings Link (Fixed above footer) -->
      <div class="p-3 border-t border-gray-100 bg-white">
        <UTooltip text="Settings" :disabled="!isCollapsed" placement="right" :popper="{ arrow: true }">
          <NuxtLink
            to="/settings"
            class="group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-gray-500 hover:bg-slate-50 hover:text-gray-900 overflow-hidden"
            active-class="!bg-amnimo-50 !text-amnimo-900 shadow-sm ring-1 ring-amnimo-100"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span class="ml-3 whitespace-nowrap transition-opacity duration-300" :class="isCollapsed ? 'opacity-0' : 'opacity-100'">
              Settings
            </span>
          </NuxtLink>
        </UTooltip>
      </div>

      <!-- Footer -->
      <div class="h-12 border-t border-gray-100 bg-slate-50/50 overflow-hidden shrink-0 relative flex items-center justify-center">
        <p class="absolute text-[10px] text-gray-400 font-bold uppercase transition-opacity duration-300" :class="isCollapsed ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'">V1</p>
        <p class="absolute text-xs text-gray-400 font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-300" :class="isCollapsed ? 'opacity-0 -translate-x-2 pointer-events-none' : 'opacity-100 translate-x-0'">Version 1.0.0</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isCollapsed = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('sidebar_collapsed');
  if (saved) {
    isCollapsed.value = saved === 'true';
  }
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebar_collapsed', String(isCollapsed.value));
};
</script>
