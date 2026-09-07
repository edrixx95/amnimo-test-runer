import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSessionStore } from '~/composables/session/useSessionStore';

export function useSessionList() {
  const sessionStore = useSessionStore();
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    sessionStore.fetchSessions();
    pollInterval = setInterval(() => {
      // Only fetch in background if any session is running or preparing
      if (
        sessionStore.sessions.some(
          (s) => s.status === "Running" || s.status === "Preparing"
        )
      ) {
        sessionStore.fetchSessions(true);
      }
    }, 3000);
  });

  onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval);
  });

  // Filter & Sort State
  const searchQuery = ref("");
  const filterStatus = ref("All");
  const filterDevice = ref("All");
  const dateRange = ref({ start: "", end: "" });
  const sortBy = ref("Newest");

  const uniqueDevices = computed(() => {
    const devices = new Set<string>();
    for (const session of sessionStore.sessions) {
      if (session.board) {
        devices.add(session.board);
      }
    }
    return Array.from(devices).sort();
  });

  const filteredSessions = computed(() => {
    let result = [...sessionStore.sessions];

    // Apply Search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.id && s.id.toLowerCase().includes(q))
      );
    }

    // Apply Status Filter
    if (filterStatus.value !== "All") {
      result = result.filter((s) => s.status === filterStatus.value);
    }

    // Apply Device Filter
    if (filterDevice.value !== "All") {
      result = result.filter((s) => s.board === filterDevice.value);
    }

    // Apply Date Filter
    if (dateRange.value.start) {
      const startObj = new Date(dateRange.value.start);
      startObj.setHours(0, 0, 0, 0);
      result = result.filter((s) => new Date(s.createdAt) >= startObj);
    }
    if (dateRange.value.end) {
      const endObj = new Date(dateRange.value.end);
      endObj.setHours(23, 59, 59, 999);
      result = result.filter((s) => new Date(s.createdAt) <= endObj);
    }

    // Apply Sorting
    result.sort((a, b) => {
      switch (sortBy.value) {
        case "Newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "Oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "Name (A-Z)":
          return (a.name || a.id).localeCompare(b.name || b.id);
        case "Name (Z-A)":
          return (b.name || b.id).localeCompare(a.name || a.id);
        default:
          return 0;
      }
    });

    return result;
  });

  const resetFilters = () => {
    searchQuery.value = "";
    filterStatus.value = "All";
    filterDevice.value = "All";
    dateRange.value = { start: "", end: "" };
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100";
      case "Preparing":
        return "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 shadow-sky-100/50";
      case "Ready":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-blue-100/50";
      case "Running":
        return "bg-amnimo-50 text-amnimo-700 border-amnimo-300 shadow-[0_0_12px_rgba(16,6,159,0.3)] animate-pulse font-black";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-emerald-100/50 font-black";
      case "Failed":
        return "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 shadow-rose-100/50 font-black";
      case "Archived":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 shadow-purple-100/50";
      case "Closed":
        return "bg-gray-50 text-gray-500 border-gray-200 opacity-80";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return {
    sessionStore,
    searchQuery,
    filterStatus,
    filterDevice,
    dateRange,
    sortBy,
    uniqueDevices,
    filteredSessions,
    resetFilters,
    getStatusClass
  };
}
