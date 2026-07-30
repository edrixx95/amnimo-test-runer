<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import type { Session } from "~~/shared/types";

import { useToast } from "~/composables/useToast";
const { t } = useI18n();

const { addToast } = useToast();
const { activeLocks, eventLogs, showEventLog } = useLocks();

const route = useRoute();
const sessionId = route.params.id as string;
const session = ref<Session | null>(null);
const isLoading = ref(true);
const isParsingTests = ref(false);

const showReportModal = ref(false);

// Confirm Modal state
const confirmModal = ref({
  isOpen: false,
  title: "",
  message: "",
  confirmText: "",
  type: "danger" as "danger" | "warning" | "info",
  isLoading: false,
  action: null as null | (() => Promise<void>),
});

const executionMode = ref<"single" | "order">("single");
const testViewMode = ref<"tree" | "filter">("tree");
const filterCategory = ref("");
const filterPage = ref("");
const playgroundSource = ref<"release" | "system">("release");

watch(playgroundSource, () => {
  fetchTests();
});

watch(filterCategory, () => {
  filterPage.value = "";
});

type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
  cases?: string[];
};
const availableTests = ref<FileNode[]>([]);
const selectedTests = ref<string[]>([]);

type TestOrder = { name: string; tests: string[] };
const testOrders = ref<TestOrder[]>([]);
const selectedOrder = ref<TestOrder | null>(null);

const isTesting = ref(false);
const isStartingReport = ref(false);

const filterCategories = computed(() => {
  return availableTests.value.filter((n) => n.type === "folder");
});

const filterPages = computed(() => {
  if (!filterCategory.value) return [];
  const cat = availableTests.value.find((n) => n.name === filterCategory.value);
  if (!cat || !cat.children) return [];
  return cat.children.filter((n) => n.type === "folder");
});

const filterFiles = computed(() => {
  if (!filterCategory.value || !filterPage.value) return [];
  const cat = availableTests.value.find((n) => n.name === filterCategory.value);
  if (!cat || !cat.children) return [];
  const page = cat.children.find((n) => n.name === filterPage.value);
  if (!page || !page.children) return [];

  const getFiles = (nodes: FileNode[]): FileNode[] => {
    let files: FileNode[] = [];
    for (const node of nodes) {
      if (node.type === "file") files.push(node);
      else if (node.type === "folder" && node.children) {
        files = files.concat(getFiles(node.children));
      }
    }
    return files;
  };

  return getFiles(page.children);
});

const isAllCasesSelected = (node: FileNode) => {
  if (!node.cases || node.cases.length === 0) return false;
  return node.cases.every(c => selectedTests.value.includes(`${node.path}::${c}`));
};

const isFileSelected = (node: FileNode) => {
  if (!node.path) return false;
  return selectedTests.value.includes(node.path) || isAllCasesSelected(node);
};

const toggleFilterFile = (node: FileNode) => {
  if (!node.path) return;
  if (isFileSelected(node)) {
    const toRemove = new Set([node.path, ...(node.cases || []).map(c => `${node.path}::${c}`)]);
    selectedTests.value = selectedTests.value.filter(t => !toRemove.has(t));
  } else {
    const toRemove = new Set((node.cases || []).map(c => `${node.path}::${c}`));
    selectedTests.value = selectedTests.value.filter(t => !toRemove.has(t));
    selectedTests.value.push(node.path);
  }
};

const toggleFilterTestCase = (node: FileNode, tc: string) => {
  if (!node.path) return;
  const caseId = `${node.path}::${tc}`;
  
  const pathIndex = selectedTests.value.indexOf(node.path);
  if (pathIndex > -1) {
    selectedTests.value.splice(pathIndex, 1);
    const otherCases = (node.cases || []).filter(c => c !== tc);
    for (const c of otherCases) {
      selectedTests.value.push(`${node.path}::${c}`);
    }
  } else {
    const index = selectedTests.value.indexOf(caseId);
    if (index > -1) {
      selectedTests.value.splice(index, 1);
    } else {
      selectedTests.value.push(caseId);
    }
  }
};

const removeFileFromQueue = (path: string) => {
  selectedTests.value = selectedTests.value.filter(
    (t) => t !== path && !t.startsWith(path + "::"),
  );
};

const findCasesByPath = (nodes: FileNode[], targetPath: string): string[] => {
  for (const node of nodes) {
    if (node.type === "file" && node.path === targetPath) {
      return node.cases || [];
    }
    if (node.type === "folder" && node.children) {
      const found = findCasesByPath(node.children, targetPath);
      if (found.length > 0) return found;
    }
  }
  return [];
};

const removeCaseFromQueue = (path: string, tc: string) => {
  const caseId = `${path}::${tc}`;
  const pathIndex = selectedTests.value.indexOf(path);
  if (pathIndex > -1) {
    selectedTests.value.splice(pathIndex, 1);
    const allCases = findCasesByPath(availableTests.value, path);
    const otherCases = allCases.filter(c => c !== tc);
    for (const c of otherCases) {
      selectedTests.value.push(`${path}::${c}`);
    }
  } else {
    selectedTests.value = selectedTests.value.filter((t) => t !== caseId);
  }
};

const computedQueuedSpecs = computed(() => {
  if (isTesting.value) return queuedSpecs.value;

  if (executionMode.value === "order") {
    if (!selectedOrder.value) return [];
    return selectedOrder.value.tests.map((t, idx) => ({
      id: idx + 1,
      path: t,
      status: "waiting",
      innerTests: [],
    }));
  }



  const map: Record<string, any> = {};
  for (const item of selectedTests.value) {
    let path = item;
    let tc = "";
    if (item.includes("::")) {
      const parts = item.split("::");
      path = parts[0]!;
      tc = parts[1]!;
    }

    if (!map[path]) {
      map[path] = {
        id: Object.keys(map).length + 1,
        path: path,
        status: "waiting",
        innerTests: [],
      };

      // If the whole file was selected (no tc specified initially), populate with all cases
      if (!tc && !item.includes("::")) {
        const allCases = findCasesByPath(availableTests.value, path);
        for (const caseName of allCases) {
          map[path].innerTests.push({
            id: "",
            name: caseName,
            status: "waiting",
          });
        }
      }
    }

    if (tc) {
      // Check if it's already added by the whole file selection
      const exists = map[path].innerTests.find((t: any) => t.name === tc);
      if (!exists) {
        map[path].innerTests.push({
          id: "",
          name: tc,
          status: "waiting",
        });
      }
    }
  }
  return Object.values(map);
});

const executeTests = async () => {
  if (!session.value || isTesting.value) return;

  if (executionMode.value === "single" && selectedTests.value.length === 0) {
    addToast({
      title: t("runner.errorTitle"),
      message: t("runner.selectTestError"),
      type: "error",
    });
    return;
  }
  if (executionMode.value === "order" && !selectedOrder.value) {
    addToast({
      title: t("runner.errorTitle"),
      message: t("runner.selectOrderError"),
      type: "error",
    });
    return;
  }

  isTesting.value = true;
  queuedSpecs.value = [];

  try {
    const payload: any = {
      mode: executionMode.value,
      testType: session.value.testType,
      sessionName: session.value.name,
    };
    if (executionMode.value === "single") {
      payload.tests = selectedTests.value;
    } else {
      payload.order = selectedOrder.value?.name;
    }

    await $fetch(`/api/tests/run`, {
      method: "POST",
      body: {
        sessionId,
        ...payload,
      },
    });
  } catch (err) {
    console.error("Failed to start tests:", err);
    isTesting.value = false;
    addToast({
      title: "Error",
      message: "Failed to start tests. Check console.",
      type: "error",
    });
  }
};

// Test Progress State
type InnerTest = {
  id: string;
  name: string;
  status: "running" | "PASSED" | "FAILED" | "SKIPPED";
  duration?: string;
};

type Spec = {
  id: number;
  path: string;
  status: "waiting" | "running" | "passed" | "failed";
  innerTests: InnerTest[];
};

const queuedSpecs = ref<Spec[]>([]);
let parsingHeader = false;

// Env config states
const showEnvModal = ref(false);
const tempEnvContent = ref("");
const isSavingEnv = ref(false);

// Logs state
const MAX_DOM_LOGS = 200;
type LogEntry = { htmlText: string };
const e2eLogs = ref<LogEntry[]>([]);
const backendLogs = ref<LogEntry[]>([]);

let rawE2ELogs: string[] = [];
let rawBackendLogs: string[] = [];

const clearE2ELogs = () => {
  e2eLogs.value = [];
  rawE2ELogs = [];
};

const clearBackendLogs = () => {
  backendLogs.value = [];
  rawBackendLogs = [];
};

const e2eLogContainer = ref<HTMLElement | null>(null);
const backendLogContainer = ref<HTMLElement | null>(null);

let eventSource: EventSource | null = null;

const ansiToHtml = (text: string) => {
  return (
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\x1B\[31(?:;1)?m/g, '<span style="color: #f87171;">') // red
      .replace(/\x1B\[32(?:;1)?m/g, '<span style="color: #4ade80;">') // green
      .replace(/\x1B\[33(?:;1)?m/g, '<span style="color: #facc15;">') // yellow
      .replace(/\x1B\[34(?:;1)?m/g, '<span style="color: #60a5fa;">') // blue
      .replace(/\x1B\[35(?:;1)?m/g, '<span style="color: #c084fc;">') // magenta
      .replace(/\x1B\[36(?:;1)?m/g, '<span style="color: #22d3ee;">') // cyan
      .replace(/\x1B\[90(?:;1)?m/g, '<span style="color: #9ca3af;">') // gray
      .replace(/\x1B\[0m/g, "</span>")
      // Fallback catch-all for any other ANSI escape sequence so it doesn't leak to screen
      .replace(/\x1B(?:\[[0-9;]*[a-zA-Z]|\].*?\x07|\].*?\x1B\\)/g, "")
  );
};

const parseLogLine = (line: string) => {
  const cleanLine = line
    .replace(/\x1B(?:\[[0-9;]*[a-zA-Z]|\].*?\x07|\].*?\x1B\\)/g, "")
    .trim();

  if (cleanLine.startsWith("Failed tests to rerun:")) {
    parsingHeader = true;
    // Always clear the old queue for rerun-failed because the previous queue is obsolete
    queuedSpecs.value = [];
    return;
  }
  
  if (cleanLine === "--- Executing Playwright Tests in Order ---") {
    parsingHeader = true;
    // DO NOT clear queuedSpecs here for normal runs, as we prefer the perfect UI state
    return;
  }
  if (
    cleanLine.startsWith("-------------------------------------------") ||
    (parsingHeader && cleanLine === "")
  ) {
    parsingHeader = false;
    return;
  }

  if (parsingHeader) {
    // If we already built the perfect queue from the UI before execution,
    // we don't need to push specs again from the log header.
    if (queuedSpecs.value.length > 0) return;

    // Otherwise (e.g. for rerun-failed), we must parse the header to build the queue
    const match = cleanLine.match(/^(\d+)\.\s+(.*\.spec\.ts)$/);
    if (match) {
      queuedSpecs.value.push({
        id: parseInt(match[1]!),
        path: match[2]!,
        status: "waiting",
        innerTests: [],
      });
      return;
    }
    const matchRerun = cleanLine.match(/-\s+\w+:\s+.*\((.*\.spec\.ts):\d+\)/);
    if (matchRerun) {
      const specPath = matchRerun[1]!;
      if (!queuedSpecs.value.find((s) => s.path === specPath)) {
        queuedSpecs.value.push({
          id: queuedSpecs.value.length + 1,
          path: specPath,
          status: "waiting",
          innerTests: [],
        });
      }
      return;
    }
    return;
  }

  const execMatch = cleanLine.match(
    /^\[(\d+)\/(\d+)\] Executing:\s+(.*?\.spec\.ts)(?::\d+)?$/,
  );
  if (execMatch) {
    const index = parseInt(execMatch[1]!) - 1;
    if (queuedSpecs.value[index]) {
      queuedSpecs.value[index].status = "running";
    } else {
      queuedSpecs.value.push({
        id: index + 1,
        path: execMatch[3]!,
        status: "running",
        innerTests: [],
      });
    }
    return;
  }

  const testStartMatch = cleanLine.match(/^\[.*?\] TEST START (.*?):\s+(.*)$/);
  if (testStartMatch) {
    const activeSpec = queuedSpecs.value.find((s) => s.status === "running");
    if (activeSpec) {
      const testName = testStartMatch[2]!.trim();
      const testId = testStartMatch[1]!.trim();
      // Match by includes because the UI might have 'SYSTEM-RELEASE-8: アカウント...'
      // while the log just outputs 'アカウント...'
      const existing = activeSpec.innerTests.find(
        (t) => t.name.includes(testName) || testName.includes(t.name) || (t.name.includes(testId) && testId !== "")
      );
      if (existing) {
        existing.status = "running";
      } else {
        activeSpec.innerTests.push({
          id: testId,
          name: testName,
          status: "running",
        });
      }
    }
    return;
  }

  const testEndMatch = cleanLine.match(
    /^\[.*?\] TEST END status=(.*?)\s+duration=(.*)$/,
  );
  if (testEndMatch) {
    const activeSpec = queuedSpecs.value.find((s) => s.status === "running");
    if (activeSpec && activeSpec.innerTests.length > 0) {
      const runningTest = activeSpec.innerTests
        .slice()
        .reverse()
        .find((t) => t.status === "running");
      if (runningTest) {
        runningTest.status = testEndMatch[1]!.trim() as any;
        runningTest.duration = testEndMatch[2]!.trim();
      }
    }
    return;
  }

  const runFinishedMatch = cleanLine.match(
    /^\[.*?\] Run finished: status=(.*?)\s+/,
  );
  if (runFinishedMatch) {
    const activeSpec = queuedSpecs.value.find((s) => s.status === "running");
    if (activeSpec) {
      activeSpec.status =
        runFinishedMatch[1]!.trim() === "PASSED" ? "passed" : "failed";
    }
  }
};

const connectStream = () => {
  if (eventSource) return; // already connected

  eventSource = new EventSource(`/api/tests/stream?sessionId=${sessionId}`);

  eventSource.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);
    if (data.source === "system") {
      if (data.event === "tests-updated") {
        fetchTests(true);
        return;
      }
      if (session.value && data.status) session.value.status = data.status;
      if (data.status === "Completed" || data.status === "Failed") {
        isTesting.value = false;

        // Finalize any running specs if it crashed
        const activeSpec = queuedSpecs.value.find(
          (s) => s.status === "running",
        );
        if (activeSpec) activeSpec.status = "failed";
      }
    } else if (data.source === "e2e") {
      addE2ELog(data.text);
    } else if (data.source === "backend") {
      addBackendLog(data.text);
    }
  });

  eventSource.addEventListener("error", () => {
    eventSource?.close();
    eventSource = null;
    if (isTesting.value) {
      setTimeout(connectStream, 5000);
    }
  });
};

const fetchTests = async (preserveState = false) => {
  if (!session.value) return;
  // Only show full page loader if not preserving state
  if (!preserveState) isLoading.value = true;
  try {
    const type =
      session.value.testType === "playground"
        ? playgroundSource.value
        : session.value.testType || "release";
    const orders = await $fetch<TestOrder[]>(`/api/tests/orders?type=${type}`);
    testOrders.value = orders;

    const tests = await $fetch<FileNode[]>(`/api/tests/files?type=${type}`);
    availableTests.value = tests;

    if (!preserveState) {
      selectedTests.value = [];
      selectedOrder.value = null;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const data = await $fetch<Session>(`/api/sessions/${sessionId}`);
    session.value = data;
    tempEnvContent.value = data.envContent || "";

    if (data.status === "Running" || data.status === "Completed" || data.status === "Failed") {
      if (data.meta?.queuedSpecs) {
        queuedSpecs.value = JSON.parse(JSON.stringify(data.meta.queuedSpecs));
      }
      if (data.status === "Running") {
        isTesting.value = true;
      }
    }

    await fetchTests();
    connectStream();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});

const selectOrder = (order: TestOrder) => {
  if (isTesting.value) return;
  selectedOrder.value = order;
};

const saveEnv = async () => {
  isSavingEnv.value = true;
  try {
    await $fetch(`/api/sessions/${sessionId}`, {
      method: "PUT",
      body: { envContent: tempEnvContent.value },
    });
    if (session.value) session.value.envContent = tempEnvContent.value;
    showEnvModal.value = false;
  } catch (err) {
    console.error("Failed to save env", err);
    addToast({
      title: "Error",
      message: "Failed to save configuration",
      type: "error",
    });
  } finally {
    isSavingEnv.value = false;
  }
};

const addE2ELog = (text: string) => {
  rawE2ELogs.push(text);
  // text may contain multiple lines
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.trim()) {
      parseLogLine(line);
    }
  }

  e2eLogs.value.push({ htmlText: ansiToHtml(text) });
  if (e2eLogs.value.length > MAX_DOM_LOGS) {
    e2eLogs.value = e2eLogs.value.slice(-MAX_DOM_LOGS);
  }

  nextTick(() => {
    if (e2eLogContainer.value) {
      e2eLogContainer.value.scrollTop = e2eLogContainer.value.scrollHeight;
    }
  });
};

const addBackendLog = (text: string) => {
  rawBackendLogs.push(text);
  backendLogs.value.push({ htmlText: ansiToHtml(text) });
  if (backendLogs.value.length > MAX_DOM_LOGS) {
    backendLogs.value = backendLogs.value.slice(-MAX_DOM_LOGS);
  }

  nextTick(() => {
    if (backendLogContainer.value) {
      backendLogContainer.value.scrollTop =
        backendLogContainer.value.scrollHeight;
    }
  });
};

const downloadLog = async (type: "e2e" | "backend") => {
  try {
    const rawText =
      type === "e2e" ? rawE2ELogs.join("") : rawBackendLogs.join("");
    const cleanText = rawText.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");

    const blob = new Blob([cleanText], { type: "text/plain" });
    const defaultName = `${type}-log-${new Date().toISOString().replace(/[:.]/g, "-")}.txt`;

    if ((window as any).showSaveFilePicker) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          { description: "Text File", accept: { "text/plain": [".txt"] } },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = defaultName;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (err: any) {
    if (err.name !== "AbortError") {
      addToast({
        title: "Error",
        message: "Failed to save log: " + err.message,
        type: "error",
      });
    }
  }
};

const rerunFailed = async () => {
  if (isTesting.value || isParsingTests.value) return;
  isTesting.value = true;
  queuedSpecs.value = [];
  parsingHeader = false;

  clearE2ELogs();
  clearBackendLogs();

  try {
    let reportName = session.value?.name;
    const reports = await $fetch<any[]>(`/api/sessions/${sessionId}/reports`);
    if (reports && reports.length > 0) {
      reportName = reports[0].name;
    }

    await $fetch("/api/tests/run", {
      method: "POST",
      body: {
        sessionId,
        testType: session.value?.testType || "release",
        mode: "rerun-failed",
        sessionName: reportName,
      },
    });
  } catch (err: any) {
    addToast({
      title: "Error",
      message: "Failed to rerun tests: " + err.message,
      type: "error",
    });
    isTesting.value = false;
  }
};

const openReport = () => {
  showReportModal.value = true;
};

const confirmCloseSession = () => {
  confirmModal.value = {
    isOpen: true,
    title: "Close Session",
    message:
      "Are you sure you want to close this session? Once closed, you will not be able to run new tests in this session.",
    confirmText: "Close Session",
    type: "warning",
    isLoading: false,
    action: async () => {
      const updatedMeta = await $fetch(`/api/sessions/${sessionId}/close`, {
        method: "POST",
      });
      if (session.value) {
        session.value.status = updatedMeta.status;
        session.value.closedAt = updatedMeta.closedAt;
      }
    },
  };
};

const executeConfirm = async () => {
  if (!confirmModal.value.action) return;
  confirmModal.value.isLoading = true;
  try {
    await confirmModal.value.action();
    confirmModal.value.isOpen = false;
  } catch (err: any) {
    addToast({
      title: "Error",
      message: `Operation failed: ${err.message || err.data?.message || err}`,
      type: "error",
    });
  } finally {
    confirmModal.value.isLoading = false;
  }
};

const toggleTest = async () => {
  if (isTesting.value) {
    // Stop Execution
    isTesting.value = false;
    try {
      await $fetch("/api/tests/stop", {
        method: "POST",
        body: { sessionId },
      });
      addE2ELog("\n\x1b[33m⚠EESent kill signal to test process.\x1b[0m\n");
      if (session.value) session.value.status = "Failed";
    } catch (err) {
      addE2ELog("\n\x1b[31m❁EFailed to stop test process.\x1b[0m\n");
    }
  } else {
    // Start Execution
    
    // Parsing Phase: Capture the queue BEFORE setting isTesting to true
    // Use the already perfectly computed queue from the UI instead of asking Playwright to parse it again
    isParsingTests.value = true;
    try {
      const queueCopy = JSON.parse(JSON.stringify(computedQueuedSpecs.value));
      
      // Update paths to just filenames, since Playwright stdout logs only show filenames
      for (const spec of queueCopy) {
        if (spec.path && spec.path.includes("/")) {
          const parts = spec.path.split("/");
          spec.path = parts[parts.length - 1];
        }
      }
      queuedSpecs.value = queueCopy;
    } catch (err: any) {
      addE2ELog(
        `\n\x1b[33m⚠EEWarning: Failed to parse test cases (${err.message}). Tests will appear as they run.\x1b[0m\n`,
      );
    } finally {
      isParsingTests.value = false;
    }

    isTesting.value = true;
    e2eLogs.value = [];
    backendLogs.value = [];
    if (session.value) session.value.status = "Running";

    addE2ELog("\x1b[36mℹEEInitializing Test Runner...\x1b[0m\n");

    const testList =
      executionMode.value === "order" && selectedOrder.value
        ? selectedOrder.value.name
        : selectedTests.value;

    try {
      await $fetch("/api/tests/run", {
        method: "POST",
        body: {
          sessionId,
          testType: session.value?.testType || "release",
          mode: executionMode.value,
          tests: testList,
          queuedSpecs: queuedSpecs.value,
        },
      });
      // Ensure stream is connected
      connectStream();
    } catch (err: any) {
      isTesting.value = false;
      addE2ELog(
        `\n\x1b[31m❁EFailed to start test runner: ${err.message}\x1b[0m\n`,
      );
    }
  }
};
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 text-slate-900 relative">
    <!-- Header -->
    <header
      class="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white shrink-0 shadow-sm z-10"
    >
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/"
          class="text-slate-400 hover:text-amnimo-600 transition-colors bg-slate-50 hover:bg-amnimo-50 p-2 rounded-xl"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Icon name="heroicons:play-circle" class="w-6 h-6 text-amnimo-500" />
          {{ $t("runner.title") }}
          <span class="text-amnimo-600 font-semibold">{{
            session?.name || session?.id || "..."
          }}</span>
          <span
            v-if="session?.testType"
            class="ml-3 text-xs bg-amnimo-50 text-amnimo-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amnimo-100"
            >{{ session.testType }}</span
          >
          <div
            v-if="activeLocks.some((l) => l.sessionId === session?.id)"
            class="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-lg shadow-sm z-10 cursor-help animate-pulse"
            :title="
              $t('runner.lockedResource', {
                resource: activeLocks.find((l) => l.sessionId === session?.id)
                  ?.resource,
              })
            "
          >
            <Icon name="heroicons:lock-closed" class="w-4 h-4" />
            <span class="tracking-wide font-bold">{{
              $t("runner.locked")
            }}</span>
          </div>
        </h2>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openReport"
          :disabled="isStartingReport"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 hover:text-amnimo-700 border border-slate-300 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Icon
            v-if="isStartingReport"
            name="heroicons:arrow-path"
            class="w-4 h-4 animate-spin"
          />
          <Icon v-else name="heroicons:document-text" class="w-4 h-4" />
          {{ $t("runner.report") }}
        </button>
        <NuxtLink
          v-if="session?.testType !== 'playground'"
          :to="`/sessions/${sessionId}/setup?step=4`"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 hover:text-amnimo-700 border border-slate-300 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Icon name="heroicons:shield-check" class="w-4 h-4" />
          {{ $t("runner.verifyEnv") }}
        </NuxtLink>
        <button
          @click="showEnvModal = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 hover:text-amnimo-700 border border-slate-300 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Icon name="heroicons:cog-8-tooth" class="w-4 h-4" />
          {{ $t("runner.editEnv") }}
        </button>
        <button
          v-if="session?.status !== 'Closed'"
          @click="confirmCloseSession"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-rose-700 bg-white hover:bg-rose-50 hover:text-rose-800 border border-rose-200 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
          {{ $t("runner.closeSession") }}
        </button>
        <span
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
          :class="
            session?.status === 'Closed'
              ? 'bg-gray-100 text-gray-500 border border-gray-200'
              : isTesting
                ? 'bg-amnimo-50 text-amnimo-600 border border-amnimo-100 shadow-[0_0_8px_rgba(16,6,159,0.15)] animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          "
        >
          <span
            class="w-2.5 h-2.5 rounded-full"
            :class="{
              'bg-amnimo-500': isTesting,
              'bg-gray-400': session?.status === 'Closed',
              'bg-emerald-500': !isTesting && session?.status !== 'Closed',
            }"
          ></span>
          {{
            isTesting
              ? $t("runner.statusRunning")
              : session?.status
                ? $t("home.status." + session.status.toLowerCase())
                : $t("runner.statusReady")
          }}
        </span>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar: Test Suites & Orders -->
      <aside
        class="w-[22rem] border-r border-slate-200 bg-white flex-shrink-0 flex flex-col z-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        <div class="p-5 flex-1 overflow-y-auto flex flex-col">
          <h3
            class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"
          >
            <Icon name="heroicons:adjustments-horizontal" class="w-4 h-4" />
            {{ $t("runner.config") }}
          </h3>

          <div v-if="session?.testType === 'playground'" class="mb-5">
            <label class="block text-sm font-bold text-slate-800 mb-2">
              {{ $t("runner.testSource") }}
            </label>
            <div class="flex rounded-xl bg-slate-200/60 p-1">
              <button
                @click="playgroundSource = 'release'"
                class="flex-1 text-sm py-2 rounded-lg font-bold transition-all duration-300"
                :class="
                  playgroundSource === 'release'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                "
              >
                {{ $t("runner.release") }}
              </button>
              <button
                @click="playgroundSource = 'system'"
                class="flex-1 text-sm py-2 rounded-lg font-bold transition-all duration-300"
                :class="
                  playgroundSource === 'system'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                "
              >
                {{ $t("runner.system") }}
              </button>
            </div>
          </div>

          <div class="space-y-5 flex-1 flex flex-col min-h-0">
            <div>
              <label class="block text-sm font-bold text-slate-800 mb-2">{{
                $t("runner.execMode")
              }}</label>
              <div class="flex rounded-xl bg-slate-200/60 p-1">
                <button
                  @click="executionMode = 'single'"
                  class="flex-1 text-sm py-2 rounded-lg font-bold transition-all duration-300"
                  :class="
                    executionMode === 'single'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  "
                >
                  {{ $t("runner.manual") }}
                </button>
                <button
                  @click="executionMode = 'order'"
                  class="flex-1 text-sm py-2 rounded-lg font-bold transition-all duration-300"
                  :class="
                    executionMode === 'order'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  "
                >
                  {{ $t("runner.testOrder") }}
                </button>
              </div>
            </div>

            <!-- Single File Mode -->
            <div
              v-if="executionMode === 'single'"
              class="flex flex-col min-h-0 flex-1 animate-fade-in"
            >
              <div class="flex items-center justify-between mb-2 shrink-0">
                <label class="block text-sm font-bold text-slate-800">{{
                  $t("runner.availableTests")
                }}</label>
                <div class="flex bg-slate-200/60 p-0.5 rounded-lg">
                  <button
                    @click="testViewMode = 'tree'"
                    class="px-2 py-1 rounded text-xs font-bold transition-colors"
                    :class="
                      testViewMode === 'tree'
                        ? 'bg-white shadow-sm text-slate-800'
                        : 'text-slate-500 hover:text-slate-700'
                    "
                  >
                    {{ $t("runner.tree") }}
                  </button>
                  <button
                    @click="testViewMode = 'filter'"
                    class="px-2 py-1 rounded text-xs font-bold transition-colors"
                    :class="
                      testViewMode === 'filter'
                        ? 'bg-white shadow-sm text-slate-800'
                        : 'text-slate-500 hover:text-slate-700'
                    "
                  >
                    {{ $t("runner.filter") }}
                  </button>
                </div>
              </div>

              <!-- Tree View -->
              <div
                v-if="testViewMode === 'tree'"
                class="overflow-y-auto flex-1 pr-2 bg-slate-50/50 rounded-xl border border-slate-200 p-2 custom-scrollbar"
              >
                <FileTree
                  v-if="availableTests.length > 0"
                  :nodes="availableTests"
                  :selected="selectedTests"
                  @update:selected="selectedTests = $event"
                  :disabled="isTesting || isParsingTests"
                />
                <div
                  v-else
                  class="text-sm font-medium text-slate-500 italic p-4 text-center"
                >
                  {{ $t("runner.noTestFiles") }}
                </div>
              </div>

              <!-- Filter View -->
              <div v-else class="flex flex-col min-h-0 flex-1 gap-2">
                <div class="flex gap-2 shrink-0">
                  <select
                    v-model="filterCategory"
                    class="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-amnimo-500 text-slate-700 font-medium"
                  >
                    <option value="">Category...</option>
                    <option
                      v-for="cat in filterCategories"
                      :key="cat.name"
                      :value="cat.name"
                    >
                      {{ cat.name }}
                    </option>
                  </select>
                  <select
                    v-model="filterPage"
                    :disabled="!filterCategory"
                    class="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-amnimo-500 text-slate-700 font-medium disabled:bg-slate-50 disabled:opacity-50"
                  >
                    <option value="">Page...</option>
                    <option
                      v-for="page in filterPages"
                      :key="page.name"
                      :value="page.name"
                    >
                      {{ page.name }}
                    </option>
                  </select>
                </div>

                <div
                  class="overflow-y-auto flex-1 pr-2 bg-slate-50/50 rounded-xl border border-slate-200 p-2 custom-scrollbar"
                >
                  <div
                    v-if="!filterPage"
                    class="text-xs text-slate-400 text-center italic mt-4"
                  >
                    {{ $t("runner.selectPage") }}
                  </div>
                  <div
                    v-else-if="filterFiles.length === 0"
                    class="text-xs text-slate-400 text-center italic mt-4"
                  >
                    {{ $t("runner.noTestsFound") }}
                  </div>
                  <div v-else class="space-y-3">
                    <div v-for="file in filterFiles" :key="file.path">
                      <div
                        class="flex items-center gap-2 mb-1 min-w-0"
                        :class="{
                          'opacity-50': isFileSelected(file),
                        }"
                      >
                        <button
                          v-if="!isFileSelected(file)"
                          @click="toggleFilterFile(file)"
                          class="shrink-0 w-4 h-4 flex items-center justify-center bg-white border border-slate-300 hover:bg-amnimo-600 hover:text-white hover:border-amnimo-600 rounded text-slate-400 transition-colors"
                          :disabled="isTesting || isParsingTests"
                        >
                          <Icon name="heroicons:plus" class="w-3 h-3" />
                        </button>
                        <div
                          v-else
                          class="shrink-0 w-4 h-4 flex items-center justify-center rounded text-amnimo-500"
                        >
                          <Icon name="heroicons:check" class="w-3.5 h-3.5" />
                        </div>

                        <Icon
                          name="heroicons:document-text"
                          class="w-4 h-4 text-gray-500 shrink-0"
                        />
                        <span
                          class="text-xs font-bold text-slate-700 truncate"
                          :title="file.name"
                          >{{ file.name }}</span
                        >
                      </div>
                      <div class="pl-6 space-y-1">
                        <div
                          v-if="file.cases!.length === 0"
                          class="flex items-center gap-2 text-xs text-slate-400 py-1"
                        >
                          {{ $t("runner.noCasesFound") }}
                        </div>
                        <div
                          v-else
                          v-for="tc in file.cases"
                          :key="tc"
                          class="flex items-start gap-2 group min-w-0"
                          :class="{
                            'opacity-50':
                              selectedTests.includes(file.path! + '::' + tc) ||
                              isFileSelected(file),
                          }"
                        >
                          <button
                            v-if="
                              !selectedTests.includes(file.path! + '::' + tc) &&
                              !isFileSelected(file)
                            "
                            @click="
                              !isTesting &&
                              !isParsingTests &&
                              toggleFilterTestCase(file, tc)
                            "
                            class="shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center bg-white border border-slate-300 hover:bg-purple-500 hover:text-white hover:border-purple-500 rounded text-slate-400 transition-colors"
                            :disabled="
                              isTesting ||
                              isParsingTests ||
                              selectedTests.includes(file.path!)
                            "
                          >
                            <Icon name="heroicons:plus" class="w-3 h-3" />
                          </button>
                          <div
                            v-else
                            class="shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center rounded text-purple-500"
                          >
                            <Icon name="heroicons:check" class="w-3.5 h-3.5" />
                          </div>

                          <Icon
                            name="heroicons:beaker"
                            class="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-400 shrink-0 mt-0.5"
                          />
                          <span
                            class="text-xs text-slate-600 group-hover:text-purple-600 leading-tight cursor-pointer"
                            @click="
                              !isTesting &&
                              !isParsingTests &&
                              !selectedTests.includes(file.path!) &&
                              toggleFilterTestCase(file, tc)
                            "
                            >{{ tc }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Test Order Mode -->
            <div
              v-if="executionMode === 'order'"
              class="flex flex-col min-h-0 flex-1 animate-fade-in"
            >
              <label
                class="block text-sm font-bold text-slate-800 mb-2 shrink-0"
                >{{ $t("runner.testOrders") }}</label
              >
              <div
                class="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar"
              >
                <div
                  v-for="order in testOrders"
                  :key="order.name"
                  @click="!isTesting && !isParsingTests && selectOrder(order)"
                  class="p-4 rounded-xl cursor-pointer transition-all duration-300 border group"
                  :class="[
                    selectedOrder?.name === order.name
                      ? 'border-amnimo-500 bg-amnimo-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-amnimo-400 hover:shadow-soft',
                    isTesting || isParsingTests
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
                  ]"
                >
                  <div class="flex items-center gap-3 text-sm">
                    <Icon
                      name="heroicons:document-text"
                      class="w-5 h-5 transition-colors"
                      :class="
                        selectedOrder?.name === order.name
                          ? 'text-amnimo-700'
                          : 'text-slate-500 group-hover:text-amnimo-600'
                      "
                    />
                    <span class="font-bold text-slate-800">{{
                      order.name
                    }}</span>
                  </div>
                  <div class="text-xs font-semibold text-slate-500 mt-1.5 pl-8">
                    {{ order.tests.length }} {{ $t("runner.tests") }}
                  </div>
                </div>
                <div
                  v-if="testOrders.length === 0"
                  class="text-sm font-medium text-slate-500 italic p-4 text-center border border-dashed border-slate-300 rounded-xl"
                >
                  {{ $t("runner.noOrderFiles") }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-5 mt-auto border-t border-slate-100 shrink-0 bg-white">
          <button
            @click="toggleTest"
            :disabled="
              (!selectedOrder && selectedTests.length === 0 && !isTesting) ||
              session?.status === 'Closed' ||
              isParsingTests
            "
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm active:scale-95"
            :class="[
              session?.status === 'Closed'
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                : isTesting
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                  : 'bg-amnimo-600 text-white hover:bg-amnimo-700 hover:shadow-amnimo-500/30 hover:shadow-lg disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none',
            ]"
          >
            <Icon
              v-if="isParsingTests"
              name="heroicons:arrow-path"
              class="w-5 h-5 animate-spin"
            />
            <Icon
              v-else
              :name="
                session?.status === 'Closed'
                  ? 'heroicons:lock-closed'
                  : isTesting
                    ? 'heroicons:stop'
                    : 'heroicons:play'
              "
              class="w-5 h-5"
            />
            {{
              session?.status === "Closed"
                ? $t("runner.sessionClosed")
                : isTesting
                  ? $t("runner.stopExecution")
                  : isParsingTests
                    ? $t("runner.parsing")
                    : $t("runner.startTests")
            }}
          </button>

          <button
            v-if="session?.status === 'Failed'"
            @click="rerunFailed"
            :disabled="isTesting || isParsingTests"
            class="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm active:scale-95 bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 hover:shadow-amber-500/20 hover:shadow-md disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-none"
          >
            <Icon name="heroicons:arrow-path-rounded-square" class="w-5 h-5" />
            {{ $t("runner.rerunFailed") }}
          </button>
        </div>
      </aside>

      <!-- Main Area: Terminals -->
      <main class="flex-1 flex flex-col min-w-0 bg-slate-900 p-4 gap-4">
        <!-- Terminal 1: E2E Test Log -->
        <div
          class="flex-1 flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-xl relative group"
        >
          <div
            class="h-10 flex items-center justify-between px-4 bg-slate-800/80 border-b border-slate-700/50 shrink-0 backdrop-blur-md z-10 absolute top-0 left-0 right-0"
          >
            <div
              class="flex items-center gap-2 text-xs font-semibold text-slate-300 tracking-wide uppercase"
            >
              <Icon
                name="heroicons:command-line"
                class="w-4 h-4 text-amnimo-400"
              />
              <span>{{ $t("runner.playwrightEngine") }}</span>
            </div>
            <div class="flex gap-4">
              <button
                @click="downloadLog('e2e')"
                class="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon name="heroicons:arrow-down-tray" class="w-3 h-3" />
                {{ $t("runner.save") }}
              </button>
              <button
                @click="clearE2ELogs"
                class="text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                {{ $t("runner.clear") }}
              </button>
            </div>
          </div>
          <div
            class="flex-1 overflow-auto p-4 pt-12 font-mono text-[13px] leading-relaxed text-slate-300 custom-scrollbar"
            ref="e2eLogContainer"
          >
            <div
              v-for="(log, idx) in e2eLogs"
              :key="idx"
              class="whitespace-pre-wrap break-words"
            >
              <!-- Using v-html for ANSI colors -->
              <span v-html="log.htmlText"></span>
            </div>
            <div v-if="e2eLogs.length === 0" class="text-slate-600 italic mt-2">
              {{ $t("runner.readyToExec") }}
            </div>
          </div>
        </div>

        <!-- Terminal 2: Hono Backend Log -->
        <div
          class="flex-1 flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-xl relative group"
        >
          <div
            class="h-10 flex items-center justify-between px-4 bg-slate-800/80 border-b border-slate-700/50 shrink-0 backdrop-blur-md z-10 absolute top-0 left-0 right-0"
          >
            <div
              class="flex items-center gap-2 text-xs font-semibold text-slate-300 tracking-wide uppercase"
            >
              <Icon name="heroicons:server" class="w-4 h-4 text-emerald-400" />
              <span>{{ $t("runner.backendEvents") }}</span>
            </div>
            <div class="flex gap-4">
              <button
                @click="downloadLog('backend')"
                class="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Icon name="heroicons:arrow-down-tray" class="w-3 h-3" />
                {{ $t("runner.save") }}
              </button>
              <button
                @click="clearBackendLogs"
                class="text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                {{ $t("runner.clear") }}
              </button>
            </div>
          </div>
          <div
            class="flex-1 overflow-auto p-4 pt-12 font-mono text-[13px] leading-relaxed text-slate-300 custom-scrollbar"
            ref="backendLogContainer"
          >
            <div
              v-for="(log, idx) in backendLogs"
              :key="idx"
              class="whitespace-pre-wrap break-words"
            >
              <!-- Using v-html for ANSI colors -->
              <span v-html="log.htmlText"></span>
            </div>
            <div
              v-if="backendLogs.length === 0"
              class="text-slate-600 italic mt-2"
            >
              {{ $t("runner.listeningBackend") }}
            </div>
          </div>
        </div>
      </main>

      <!-- Right Sidebar: Test Progress (Slide In) -->
      <aside
        class="bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden transition-all duration-500 ease-out z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]"
        :class="
          computedQueuedSpecs.length > 0 || isParsingTests
            ? 'w-80 opacity-100'
            : 'w-0 opacity-0 border-none'
        "
      >
        <div
          class="w-80 flex-1 flex flex-col overflow-hidden"
          v-if="computedQueuedSpecs.length > 0 || isParsingTests"
        >
          <div
            v-if="isParsingTests"
            class="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 border border-slate-100"
          >
            <Icon
              name="heroicons:arrow-path"
              class="w-10 h-10 animate-spin mb-4 text-amnimo-500"
            />
            <p class="text-sm font-bold text-slate-700">
              {{ $t("runner.resolvingTestCases") }}
            </p>
            <p class="text-xs text-slate-400 mt-2">
              {{ $t("runner.fetchingSuites") }}
            </p>
          </div>
          <TestProgress
            v-else
            :specs="computedQueuedSpecs"
            :isTesting="isTesting"
            @remove-file="removeFileFromQueue"
            @remove-case="removeCaseFromQueue"
          />
        </div>
      </aside>
    </div>

    <!-- Env Edit Modal -->
    <Transition name="modal">
      <div
        v-if="showEnvModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div
          class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm transform-gpu will-change-opacity"
          @click="showEnvModal = false"
        ></div>
        <div
          class="modal-content relative bg-white rounded-2xl shadow-glass w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        >
          <div
            class="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0"
          >
            <h3
              class="text-xl font-bold text-slate-900 flex items-center gap-2"
            >
              <Icon
                name="heroicons:cog-8-tooth"
                class="w-6 h-6 text-amnimo-500"
              />
              {{ $t("runner.editEnvConfig") }}
            </h3>
            <button
              @click="showEnvModal = false"
              class="text-slate-400 hover:text-amnimo-600 bg-slate-50 hover:bg-amnimo-50 p-2 rounded-xl transition-colors"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
          <div
            class="p-8 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar"
          >
            <EnvEditor
              v-model="tempEnvContent"
              :isPlayground="session?.testType === 'playground'"
            />
          </div>
          <div
            class="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0"
          >
            <button
              @click="showEnvModal = false"
              class="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-95"
            >
              {{ $t("runner.cancel") }}
            </button>
            <button
              @click="saveEnv"
              :disabled="isSavingEnv"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-amnimo-600 border border-transparent rounded-xl hover:bg-amnimo-700 disabled:opacity-50 transition-all shadow-sm active:scale-95"
            >
              <Icon
                v-if="isSavingEnv"
                name="heroicons:arrow-path"
                class="w-4 h-4 animate-spin"
              />
              {{ $t("runner.saveChanges") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Report Modal -->
    <ReportModal v-model="showReportModal" :sessionId="sessionId" />

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirmText="confirmModal.confirmText"
      :type="confirmModal.type"
      :isLoading="confirmModal.isLoading"
      @confirm="executeConfirm"
    />
  </div>
</template>
