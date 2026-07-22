<template>
  <div class="h-screen bg-slate-50 text-slate-800 selection:bg-amnimo-200">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BaseToast />
  </div>
</template>

<style>
/* Custom Scrollbar for Webkit */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent; 
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Modal Transition - Optimized to prevent backdrop-blur lag */
.modal-enter-active,
.modal-leave-active {
  /* Dummy transition so Vue knows the duration */
  transition: color 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  color: transparent;
}

/* Animate Backdrop separately */
.modal-enter-active .modal-backdrop,
.modal-leave-active .modal-backdrop {
  transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
}
.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Animate Content separately */
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.95);
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
