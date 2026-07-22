<template>
  <div class="space-y-1">
    <div v-for="node in nodes" :key="node.name">
      <!-- Folder -->
      <div v-if="node.type === 'folder'" class="select-none">
        <div
          class="flex items-center gap-1.5 p-1.5 hover:bg-amnimo-600/10 rounded cursor-pointer text-sm font-medium text-amnimo-600"
          @click="toggleFolder(node.name)"
        >
          <Icon
            :name="
              isOpen(node.name) ? 'heroicons:folder-open' : 'heroicons:folder'
            "
            class="w-4 h-4 text-amnimo-600"
          />
          <span>{{ node.name }}</span>
        </div>

        <div
          v-if="isOpen(node.name)"
          class="pl-4 ml-2 border-l border-gray-700/50 mt-1"
        >
          <FileTree
            :nodes="node.children || []"
            :selected="selected"
            :disabled="disabled"
            @update:selected="emitUpdate"
            @load-cases="(p) => emit('load-cases', p)"
          />
        </div>
      </div>

      <!-- File -->
      <div v-else>
        <div class="flex items-center gap-1.5 p-1.5 hover:bg-amnimo-600/10 rounded text-sm text-gray-400 group">
          <div v-if="node.type === 'file'" @click="toggleFolderAndLoadCases(node)" class="cursor-pointer p-0.5 rounded hover:bg-gray-700">
            <Icon
              :name="isOpen(node.path || node.name) ? 'heroicons:chevron-down' : 'heroicons:chevron-right'"
              class="w-4 h-4 text-gray-500 hover:text-amnimo-600"
            />
          </div>
          <div v-else class="w-5"></div>
          
          <div class="flex items-center gap-2 cursor-pointer flex-1 min-w-0" :class="{ 'opacity-50': selected.includes(node.path!) }">
            <button
              v-if="!selected.includes(node.path!)"
              @click.stop="toggleFile(node.path!)"
              class="shrink-0 w-4 h-4 flex items-center justify-center bg-gray-700 hover:bg-amnimo-600 rounded text-gray-300 hover:text-white transition-colors"
              :disabled="disabled"
            >
              <Icon name="heroicons:plus" class="w-3.5 h-3.5" />
            </button>
            <div v-else class="shrink-0 w-4 h-4 flex items-center justify-center rounded text-amnimo-500">
              <Icon name="heroicons:check" class="w-3.5 h-3.5" />
            </div>

            <Icon
              name="heroicons:document-text"
              class="w-4 h-4 text-gray-500 group-hover:text-amnimo-600 shrink-0"
            />
            <span class="truncate group-hover:text-amnimo-600" @click="toggleFolderAndLoadCases(node)" :title="node.name">{{
              node.name
            }}</span>
          </div>
        </div>

        <!-- Cases under file -->
        <div
          v-if="isOpen(node.path || node.name)"
          class="pl-9 mt-0.5 space-y-0.5"
        >
          <div v-if="node.cases === undefined" class="p-1.5 text-xs text-gray-500 flex items-center gap-2">
            <Icon name="heroicons:arrow-path" class="w-3.5 h-3.5 animate-spin" />
            Loading cases...
          </div>
          <div v-else-if="node.cases.length === 0" class="p-1.5 text-xs text-gray-500">
            No cases found
          </div>
          <div v-else v-for="testCase in node.cases" :key="testCase">
            <div
              class="flex items-center gap-2 p-1.5 hover:bg-amnimo-600/10 rounded cursor-pointer text-xs text-gray-400 group min-w-0"
              :class="{ 'opacity-50': selected.includes(`${node.path}::${testCase}`) || selected.includes(node.path!) }"
            >
              <button
                v-if="!selected.includes(`${node.path}::${testCase}`) && !selected.includes(node.path!)"
                @click.stop="toggleCase(node.path!, testCase)"
                class="shrink-0 w-4 h-4 flex items-center justify-center bg-gray-700 hover:bg-purple-600 rounded text-gray-300 hover:text-white transition-colors"
                :disabled="disabled"
              >
                <Icon name="heroicons:plus" class="w-3.5 h-3.5" />
              </button>
              <div v-else class="shrink-0 w-4 h-4 flex items-center justify-center rounded text-purple-500">
                <Icon name="heroicons:check" class="w-3.5 h-3.5" />
              </div>

              <Icon
                name="heroicons:beaker"
                class="w-3.5 h-3.5 text-gray-500 group-hover:text-purple-400 shrink-0"
              />
              <span class="truncate group-hover:text-purple-400" @click="!selected.includes(node.path!) && toggleCase(node.path!, testCase)" :title="testCase">{{
                testCase
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
  cases?: string[];
};

const props = defineProps<{
  nodes: FileNode[];
  selected: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:selected", values: string[]): void;
  (e: "load-cases", path: string): void;
}>();

const openFolders = ref<Set<string>>(new Set());

const toggleFolder = (name: string) => {
  if (openFolders.value.has(name)) {
    openFolders.value.delete(name);
  } else {
    openFolders.value.add(name);
  }
};

const toggleFolderAndLoadCases = (node: FileNode) => {
  const identifier = node.path || node.name;
  toggleFolder(identifier);
  if (isOpen(identifier) && node.cases === undefined && node.path) {
    emit("load-cases", node.path);
  }
};

const isOpen = (name: string) => openFolders.value.has(name);

const toggleFile = (path: string) => {
  const newSelected = [...props.selected];
  const index = newSelected.indexOf(path);
  if (index > -1) {
    newSelected.splice(index, 1);
  } else {
    newSelected.push(path);
  }
  emit("update:selected", newSelected);
};

const toggleCase = (path: string, testCase: string) => {
  const caseId = `${path}::${testCase}`;
  const newSelected = [...props.selected];
  const index = newSelected.indexOf(caseId);
  if (index > -1) {
    newSelected.splice(index, 1);
  } else {
    newSelected.push(caseId);
  }
  emit("update:selected", newSelected);
};

const emitUpdate = (values: string[]) => {
  emit("update:selected", values);
};
</script>
