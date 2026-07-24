import { defineStore } from "pinia";
import { ref } from "vue";
import type { Session } from "~~/shared/types";

export const useSessionStore = defineStore("session", () => {
  const sessions = ref<Session[]>([]);
  const currentSession = ref<Session | null>(null);
  const isLoading = ref(false);
  const hasError = ref(false);

  const fetchSessions = async (background = false) => {
    if (!background) isLoading.value = true;
    hasError.value = false;
    try {
      const data = await $fetch<Session[]>("/api/sessions");
      sessions.value = data;
    } catch (e) {
      console.error("Failed to fetch sessions:", e);
      hasError.value = true;
    } finally {
      if (!background) isLoading.value = false;
    }
  };

  const createSession = async (payload: { name: string }) => {
    isLoading.value = true;
    hasError.value = false;
    try {
      const newSession = await $fetch<Session>("/api/sessions", {
        method: "POST",
        body: payload,
      });
      sessions.value.unshift(newSession);
      return newSession;
    } catch (err: any) {
      console.error("Failed to create session:", err);
      hasError.value = true;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await $fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });
      sessions.value = sessions.value.filter((s) => s.id !== id);
      return true;
    } catch (err: any) {
      console.error("Failed to delete session:", err);
      return false;
    }
  };

  return {
    sessions,
    currentSession,
    isLoading,
    hasError,
    fetchSessions,
    createSession,
    deleteSession,
  };
});
