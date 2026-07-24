import { ref } from 'vue';
import { useToast } from '~/composables/useToast';
import { useI18n } from 'vue-i18n';

export function useConfirmModal() {
  const { t } = useI18n();
  const { addToast } = useToast();

  const confirmModal = ref({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    type: "danger" as "danger" | "warning" | "info",
    isLoading: false,
    action: null as null | (() => Promise<void>),
  });

  const executeConfirm = async () => {
    if (!confirmModal.value.action) return;
    confirmModal.value.isLoading = true;
    try {
      await confirmModal.value.action();
      confirmModal.value.isOpen = false;
    } catch (err: any) {
      addToast({
        title: t("home.errorTitle") || "Error",
        message: `${t("home.operationFailed") || "Operation failed"}: ${err.message || err.data?.message || err}`,
        type: "error",
      });
    } finally {
      confirmModal.value.isLoading = false;
    }
  };

  const openConfirm = (options: {
    title: string;
    message: string;
    confirmText: string;
    type?: "danger" | "warning" | "info";
    action: () => Promise<void>;
  }) => {
    confirmModal.value = {
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      type: options.type || "danger",
      isLoading: false,
      action: options.action,
    };
  };

  return {
    confirmModal,
    executeConfirm,
    openConfirm
  };
}
