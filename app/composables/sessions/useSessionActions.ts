import { ref } from 'vue';
import { useSessionStore } from '~/composables/session/useSessionStore';
import { useI18n } from 'vue-i18n';
import { useToast } from '~/composables/useToast';
import { useRouter } from 'vue-router';
import { useConfirmModal } from '~/composables/ui/useConfirmModal';

export function useSessionActions() {
  const sessionStore = useSessionStore();
  const { t } = useI18n();
  const { addToast } = useToast();
  const router = useRouter();
  const { openConfirm } = useConfirmModal();

  const isModalOpen = ref(false);
  const newSessionName = ref("");
  const isCreating = ref(false);

  const openCreateModal = () => {
    const timestamp = new Date().getTime();
    newSessionName.value = `session-${timestamp}`;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    if (isCreating.value) return;
    isModalOpen.value = false;
  };

  const handleCreateSession = async () => {
    if (!newSessionName.value.trim()) return;

    isCreating.value = true;
    try {
      const session = await sessionStore.createSession({
        name: newSessionName.value,
      });
      if (session) {
        closeModal();
        router.push(`/sessions/${session.id}/setup`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      addToast({
        title: t("home.errorTitle"),
        message: t("home.createSessionError"),
        type: "error",
      });
    } finally {
      isCreating.value = false;
    }
  };

  const handleDeleteSession = (id: string) => {
    openConfirm({
      title: t("home.deleteSessionTitle"),
      message: t("home.deleteSessionDesc"),
      confirmText: t("home.delete"),
      type: "danger",
      action: async () => {
        await sessionStore.deleteSession(id);
      },
    });
  };

  const handleCloseSession = (id: string) => {
    openConfirm({
      title: t("home.closeSessionTitle"),
      message: t("home.closeSessionDesc"),
      confirmText: t("home.closeSessionConfirm"),
      type: "warning",
      action: async () => {
        await $fetch(`/api/sessions/${id}/close`, { method: "POST" });
        await sessionStore.fetchSessions();
      },
    });
  };

  const navigateToSession = (session: unknown) => {
    if ((session as Record<string, unknown>).status === "Draft") {
      router.push(`/sessions/${(session as Record<string, unknown>).id}/setup`);
    } else {
      router.push(`/sessions/${(session as Record<string, unknown>).id}/runner`);
    }
  };

  return {
    isModalOpen,
    newSessionName,
    isCreating,
    openCreateModal,
    closeModal,
    handleCreateSession,
    handleDeleteSession,
    handleCloseSession,
    navigateToSession
  };
}
