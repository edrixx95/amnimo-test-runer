<template>
  <div class="h-screen bg-slate-50 text-slate-800 selection:bg-amnimo-200">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BaseToast />
    <UpdateNotifier />
    <InitialSetupModal />
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
  transition:
    opacity 0.3s ease,
    backdrop-filter 0.3s ease;
}
.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Animate Content separately */
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}
.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.95);
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Override driver.js default theme to match Amnimo design system */
.amnimo-tour-theme {
  --driver-popover-bg-color: #ffffff;
  --driver-popover-text-color: #475569; /* slate-600 */
  --driver-popover-title-color: #1e293b; /* slate-800 */
  --driver-popover-footer-text-color: #94a3b8; /* slate-400 */
  --driver-popover-btn-bg-color: #10069f; /* amnimo-600 */
  --driver-popover-btn-text-color: #ffffff;
  --driver-popover-btn-border-color: #10069f;
  --driver-popover-border-radius: 12px; /* rounded-xl */
  padding: 20px 24px !important;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
  font-family: inherit !important;
}

.amnimo-tour-theme .driver-popover-title {
  font-weight: 700 !important;
  font-size: 1.125rem !important; /* text-lg */
  margin-bottom: 0.5rem !important;
  line-height: 1.5 !important;
  letter-spacing: -0.025em !important;
}

.amnimo-tour-theme .driver-popover-description {
  font-weight: 500 !important;
  font-size: 0.875rem !important; /* text-sm */
  line-height: 1.625 !important;
  margin-bottom: 1.5rem !important;
}

.amnimo-tour-theme .driver-popover-footer {
  margin-top: 0 !important;
}

.amnimo-tour-theme .driver-popover-footer button {
  border-radius: 8px !important;
  font-weight: 600 !important;
  padding: 6px 14px !important;
  text-shadow: none !important;
  transition: all 0.2s ease-in-out !important;
}

.amnimo-tour-theme .driver-popover-next-btn,
.amnimo-tour-theme .driver-popover-prev-btn {
  padding: 8px 16px !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  transition: all 0.2s ease !important;
}

.amnimo-tour-theme .driver-popover-next-btn {
  background-color: #10069f !important; /* amnimo-600 */
  border-color: #10069f !important;
  color: #ffffff !important;
}
.amnimo-tour-theme .driver-popover-next-btn:hover {
  background-color: #0d0480 !important; /* amnimo-700 */
  transform: translateY(-1px) !important;
}
.amnimo-tour-theme .driver-popover-prev-btn {
  background-color: #f1f5f9 !important; /* slate-100 */
  color: #475569 !important; /* slate-600 */
  border-color: #e2e8f0 !important; /* slate-200 */
}
.amnimo-tour-theme .driver-popover-prev-btn:hover {
  background-color: #e2e8f0 !important; /* slate-200 */
  color: #1e293b !important; /* slate-800 */
}

/* Ensure dropdowns inside highlighted tour elements are included in the bounding box */
.driver-active [id^="tour-env-"] > [id^="dropdown-"] {
  position: static !important;
  margin-top: 0.5rem !important;
}
</style>
