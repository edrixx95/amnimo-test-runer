/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const */
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

export interface Firmware {
  filename: string;
  source: string;
  board: string;
  version: string;
  build: string;
  isModem: boolean;
  date: string;
  size: number;
  url: string;
}

export interface Firmware {
  filename: string;
  source: string;
  board: string;
  version: string;
  build: string;
  isModem: boolean;
  date: string;
  size: number;
  url: string;
}

export function useFirmwareManager() {
  const { t } = useI18n();

  const firmwares = ref<Firmware[]>([]);
  const isLoading = ref(false);
  const error = ref("");

  const selectedSource = ref<string | null>(null);
  const searchQuery = ref("");
  const filterBoard = ref("all");
  const sortKey = ref<keyof Firmware>("date");
  const sortOrder = ref<"asc" | "desc">("desc");

  const currentPage = ref(1);
  const itemsPerPage = ref(15);

  const isBoardDropdownOpen = ref(false);
  const BOARD_LIST = [
    "AG10",
    "AG20",
    "AX11",
    "AX12",
    "AX21",
    "AX30",
    "AR10",
    "AR20",
    "AC10",
    "AC15",
    "AC25",
  ];

  const sortBy = (key: keyof Firmware) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortKey.value = key;
      sortOrder.value = key === "date" ? "desc" : "asc";
    }
    currentPage.value = 1;
  };

  const selectBoardFilter = (board: string) => {
    filterBoard.value = board;
    isBoardDropdownOpen.value = false;
    currentPage.value = 1;
  };

  const filteredFirmwares = computed(() => {
    if (!selectedSource.value) return [];

    let result = firmwares.value.filter((fw) => {
      if (fw.source !== selectedSource.value) return false;
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        if (!fw.filename.toLowerCase().includes(query)) return false;
      }
      if (filterBoard.value !== "all") {
        const boardParts = fw.board.split("_");
        if (!boardParts.includes(filterBoard.value)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      let valA: any = a[sortKey.value];
      let valB: any = b[sortKey.value];

      if (sortKey.value === "date") {
        (valA as any) = new Date(a.date).getTime();
        (valB as any) = new Date(b.date).getTime();
      } else if (sortKey.value === "version") {
        const collator = new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return sortOrder.value === "asc"
          ? collator.compare(valA as any, valB as any)
          : collator.compare(valB as any, valA as any);
      } else if (typeof (valA as any) === "string") {
        (valA as any) = (valA as any).toLowerCase();
        (valB as any) = (valB as any as string).toLowerCase();
      }

      if ((valA as any) < (valB as any))
        return sortOrder.value === "asc" ? -1 : 1;
      if ((valA as any) > (valB as any))
        return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  });

  const totalPages = computed(() =>
    Math.ceil(filteredFirmwares.value.length / itemsPerPage.value),
  );

  const paginatedFirmwares = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredFirmwares.value.slice(start, end);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  };

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page;
  };

  const selectSource = (source: string) => {
    selectedSource.value = source;
    searchQuery.value = "";
    filterBoard.value = "all";
    currentPage.value = 1;
  };

  const clearSource = () => {
    selectedSource.value = null;
    currentPage.value = 1;
  };

  const fetchFirmwares = async () => {
    isLoading.value = true;
    error.value = "";
    try {
      firmwares.value = await $fetch<Firmware[]>("/api/firmwares/external");
      currentPage.value = 1;
    } catch (err: any) {
      console.error("Failed to fetch firmwares", err);
      error.value = t("firmware.fetchError");
    } finally {
      isLoading.value = false;
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return {
    firmwares,
    isLoading,
    error,
    selectedSource,
    searchQuery,
    filterBoard,
    sortKey,
    sortOrder,
    isBoardDropdownOpen,
    BOARD_LIST,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedFirmwares,
    nextPage,
    prevPage,
    goToPage,
    sortBy,
    selectBoardFilter,
    filteredFirmwares,
    selectSource,
    clearSource,
    fetchFirmwares,
    formatBytes,
  };
}
