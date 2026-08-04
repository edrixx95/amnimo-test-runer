<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  items: { label: string; icon?: string; action?: () => void }[];
}>();

const isOpen = ref(false);
const position = ref({ x: 0, y: 0 });

const openMenu = (e: MouseEvent) => {
  e.preventDefault();
  isOpen.value = true;
  // Basic positioning logic. In a real app, constrain to window bounds.
  position.value = { x: e.clientX, y: e.clientY };
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleItemClick = (item: any) => {
  if (item.action) item.action();
  closeMenu();
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<template>
  <div @contextmenu.prevent="openMenu" class="relative w-full h-full">
    <slot />

    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          :style="{ top: `${position.y}px`, left: `${position.x}px` }"
          class="fixed z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1" role="menu" aria-orientation="vertical">
            <button
              v-for="(item, index) in items"
              :key="index"
              @click.stop="handleItemClick(item)"
              class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center group"
              role="menuitem"
            >
              <Icon v-if="item.icon" :name="item.icon" class="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500" />
              {{ item.label }}
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
