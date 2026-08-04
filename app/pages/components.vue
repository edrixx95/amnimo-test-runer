<script setup lang="ts">
import { ref } from "vue";

const categories = [
  {
    name: "Layout",
    components: [
      { id: "layout-app", name: "App" },
      { id: "layout-container", name: "Container" },
      { id: "layout-header", name: "Header" },
      { id: "layout-sidebar", name: "Sidebar" },
      { id: "layout-main", name: "Main" },
      { id: "layout-footer", name: "Footer" },
      { id: "layout-error", name: "Error" },
      { id: "layout-theme", name: "Theme" },
    ],
  },
  {
    name: "Elements",
    components: [
      { id: "el-alert", name: "Alert" },
      { id: "el-avatar", name: "Avatar & Group" },
      { id: "el-badge", name: "Badge" },
      { id: "el-banner", name: "Banner" },
      { id: "el-button", name: "Button" },
      { id: "el-calendar", name: "Calendar" },
      { id: "el-card", name: "Card" },
      { id: "el-chip", name: "Chip" },
      { id: "el-collapsible", name: "Collapsible" },
      { id: "el-fieldgroup", name: "Field Group" },
      { id: "el-icon", name: "Icon" },
      { id: "el-kbd", name: "Kbd" },
      { id: "el-progress", name: "Progress" },
      { id: "el-separator", name: "Separator" },
      { id: "el-skeleton", name: "Skeleton" },
    ],
  },
  {
    name: "Forms",
    components: [
      { id: "form-checkbox", name: "Checkbox & Group" },
      { id: "form-color", name: "Color Picker" },
      { id: "form-file", name: "File Upload" },
      { id: "form-form", name: "Form & FormField" },
      { id: "form-input", name: "Input (Text, Date, Time, Number)" },
      { id: "form-inputmenu", name: "Input Menu" },
      { id: "form-rating", name: "Rating" },
      { id: "form-tags", name: "Tags Input" },
      { id: "form-listbox", name: "Listbox" },
      { id: "form-pin", name: "Pin Input" },
      { id: "form-radio", name: "Radio Group" },
      { id: "form-select", name: "Select" },
      { id: "form-slider", name: "Slider" },
      { id: "form-switch", name: "Switch" },
      { id: "form-textarea", name: "Textarea" },
    ],
  },
  {
    name: "Data",
    components: [
      { id: "data-accordion", name: "Accordion" },
      { id: "data-carousel", name: "Carousel" },
      { id: "data-empty", name: "Empty" },
      { id: "data-marquee", name: "Marquee" },
      { id: "data-scrollarea", name: "Scroll Area" },
      { id: "data-table", name: "Table" },
      { id: "data-timeline", name: "Timeline" },
      { id: "data-tree", name: "Tree" },
      { id: "data-user", name: "User" },
    ],
  },
  {
    name: "Navigation",
    components: [
      { id: "nav-breadcrumb", name: "Breadcrumb" },
      { id: "nav-commandpalette", name: "Command Palette" },
      { id: "nav-footercolumns", name: "Footer Columns" },
      { id: "nav-link", name: "Link" },
      { id: "nav-navigationmenu", name: "Navigation Menu" },
      { id: "nav-pagination", name: "Pagination" },
      { id: "nav-stepper", name: "Stepper" },
      { id: "nav-tabs", name: "Tabs" },
    ],
  },
  {
    name: "Overlay",
    components: [
      { id: "overlay-contextmenu", name: "Context Menu" },
      { id: "overlay-drawer", name: "Drawer" },
      { id: "overlay-dropdownmenu", name: "Dropdown Menu" },
      { id: "overlay-modal", name: "Modal" },
      { id: "overlay-popover", name: "Popover" },
      { id: "overlay-slideover", name: "Slideover" },
      { id: "overlay-toast", name: "Toast" },
      { id: "overlay-tooltip", name: "Tooltip" },
    ],
  },
  {
    name: "UI & Base",
    components: [
      { id: "loaders", name: "Loaders & Spinners" },
      { id: "logo", name: "Amnimo Logo" },
      { id: "toast", name: "Base Toast" },
    ],
  },
  {
    name: "Forms & Inputs",
    components: [
      { id: "env-editor", name: "Env Editor" },
    ],
  },
  {
    name: "Modals & Dialogs",
    components: [
      { id: "modals", name: "Confirm & Notifiers" },
      { id: "folder-picker", name: "Folder Picker" },
    ],
  },
  {
    name: "Icons",
    components: [{ id: "icons", name: "System Icons" }],
  },
  {
    name: "Peripherals",
    components: [{ id: "peripheral-checks", name: "Peripheral Checks" }],
  },
  {
    name: "Runner Specific",
    components: [
      { id: "file-tree", name: "File Tree" },
      { id: "test-progress", name: "Test Progress" },
      { id: "firmware", name: "Firmware Preparation" },
    ],
  },
];

const activeComponentId = ref("el-button");

// Mock Data for Env Editor
const mockEnv = ref({
  currentPage: 1,
  showCommandPalette: false,
  showDrawer: false,
  showModal: false,
  showSlideover: false,
  currentStep: 0,
  API_URL: "https://api.example.com",
  TIMEOUT_MS: 5000,
  ENABLE_DEBUG: true,
  btnLabel: "Button",
  btnColor: "primary",
  btnVariant: "solid",
  btnSize: "md",
  btnLoading: false,
  btnDisabled: false,
  variantSecColor: "error",
  variantSecVariant: "solid",
  sizeSecSize: "xl",
  iconSec1Icon: "i-lucide-rocket",
  iconSec1Size: "md",
  iconSec1Color: "primary",
  iconSec1Variant: "solid",
  iconSec2Trailing: "i-lucide-arrow-right",
  iconSec2Size: "md",
  iconSec3Icon: "i-lucide-search",
  iconSec3Size: "md",
  iconSec3Color: "primary",
  iconSec3Variant: "solid",
  avatarSec1Src: "/amnimo-icon.ico",
  avatarSec1Size: "md",
  avatarSec1Color: "neutral",
  avatarSec1Variant: "outline",
  avatarSec2Src: "/amnimo-icon.ico",
  avatarSec2Size: "md",
  avatarSec2Color: "neutral",
  avatarSec2Variant: "outline",
  linkSec1To: "https://amnimo.com",
  linkSec2Active: true,
  linkSec2ActiveColor: "primary",
  linkSec2ActiveVariant: "solid",
  linkSec3Active: true,
  linkSec3ActiveClass: "font-bold",
  linkSec3InactiveClass: "font-light",
  loadingSec1Loading: true,
  loadingSec1Trailing: false,
  loadingIconSec1Loading: true,
  loadingIconSec1LoadingIcon: "lucide:loader",
  disabledSec1Disabled: true,
  classPropSec1Class: "font-bold rounded-full",
  uiPropSec1LeadingIcon: "text-amnimo-600",
  btnBlock: true,
  selectValue: 'opt1',
  emptySelectValue: '',
  selectIconValue: 'en',
  selectBtnClassValue: 'com',
});

const loadingSec2OnClick = () =>
  new Promise<void>((res) => setTimeout(res, 1000));

const formState = reactive({ fullName: "" });
const formError = ref("");
const formOnSubmit = async (e?: Event) => {
  if (e) e.preventDefault();
  if (!formState.fullName) {
    formError.value = "Required";
    return;
  }
  formError.value = "";
  return new Promise<void>((res) => setTimeout(res, 1000));
};

const buttonColors = [
  { label: "primary", value: "primary", colorClass: "bg-amnimo-600" },
  {
    label: "secondary",
    value: "secondary",
    colorClass: "bg-[#f4f6f8] border border-slate-200",
  },
  { label: "success", value: "success", colorClass: "bg-green-500" },
  { label: "info", value: "info", colorClass: "bg-blue-500" },
  { label: "warning", value: "warning", colorClass: "bg-yellow-500" },
  { label: "error", value: "error", colorClass: "bg-red-500" },
  { label: "neutral", value: "neutral", colorClass: "bg-slate-800" },
];

const buttonVariants = [
  { label: "solid", value: "solid" },
  { label: "outline", value: "outline" },
  { label: "soft", value: "soft" },
  { label: "subtle", value: "subtle" },
  { label: "ghost", value: "ghost" },
  { label: "link", value: "link" },
];

const buttonSizes = [
  { label: "xs", value: "xs" },
  { label: "sm", value: "sm" },
  { label: "md", value: "md" },
  { label: "lg", value: "lg" },
  { label: "xl", value: "xl" },
];

const booleanOptions = [
  { label: "true", value: true },
  { label: "false", value: false },
];

// Mock Data for File Tree
const mockFileTree = [
  {
    name: "System Tests",
    type: "folder" as const,
    path: "/sys",
    children: [
      {
        name: "network.run.json",
        type: "file" as const,
        path: "/sys/network.run.json",
        cases: ["Ping Test", "DNS Test"],
      },
      {
        name: "storage.run.json",
        type: "file" as const,
        path: "/sys/storage.run.json",
        cases: ["Read Test", "Write Test"],
      },
    ],
  },
  {
    name: "Peripheral Tests",
    type: "folder" as const,
    path: "/peripherals",
    children: [
      {
        name: "usb.run.json",
        type: "file" as const,
        path: "/peripherals/usb.run.json",
      },
    ],
  },
];
const mockSelectedTests = ref(["/sys/network.run.json::Ping Test"]);

// Mock for Test Progress
const mockSpecs = [
  {
    id: 1,
    path: "/sys/network.run.json",
    status: "passed" as const,
    innerTests: [
      {
        id: "1",
        name: "Ping Test",
        status: "PASSED" as const,
        duration: "120ms",
      },
    ],
  },
  {
    id: 2,
    path: "/sys/storage.run.json",
    status: "running" as const,
    innerTests: [
      {
        id: "2",
        name: "Read Test",
        status: "PASSED" as const,
        duration: "450ms",
      },
      {
        id: "3",
        name: "Write Test",
        status: "running" as const,
        duration: "...",
      },
    ],
  },
  {
    id: 3,
    path: "/peripherals/usb.run.json",
    status: "waiting" as const,
    innerTests: [],
  },
];

// Modal visibility states
const showConfirmModal = ref(false);
const showFolderPicker = ref(false);
const showUpdateNotifier = ref(false);

const currentToc = computed(() => {
  switch (activeComponentId.value) {
    case "el-button":
      return [
        { id: "btn-usage", label: "Usage", level: 2 },
        { id: "btn-label", label: "Label", level: 3 },
        { id: "btn-color", label: "Color", level: 3 },
        { id: "btn-variant", label: "Variant", level: 3 },
        { id: "btn-size", label: "Size", level: 3 },
        { id: "btn-icon", label: "Icon", level: 3 },
        { id: "btn-avatar", label: "Avatar", level: 3 },
        { id: "btn-link", label: "Link", level: 3 },
        { id: "btn-loading", label: "Loading", level: 3 },
        { id: "btn-loading-icon", label: "Loading Icon", level: 3 },
        { id: "btn-disabled", label: "Disabled", level: 3 },
        { id: "btn-block", label: "Block", level: 3 },
        { id: "btn-examples", label: "Examples", level: 3 },
        { id: "btn-api", label: "API", level: 2 },
      ];
        case 'form-select':
      return [
        { id: 'select-usage', label: 'Usage', level: 2 },
        { id: 'select-placeholder', label: 'Placeholder', level: 3 },
        { id: 'select-icon', label: 'Icon', level: 3 },
        { id: 'select-button-class', label: 'Button Class', level: 3 },
        { id: 'select-api', label: 'API', level: 2 },
      ];
    default:
      return [];
  }
});

const activeSectionId = ref("");

const onMainScroll = (e: Event) => {
  if (!currentToc.value.length) return;
  const mainEl = e.target as HTMLElement;
  const mainRect = mainEl.getBoundingClientRect();

  let currentId = "";
  for (const item of currentToc.value) {
    const el = document.getElementById(item.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top - mainRect.top <= 200) {
        currentId = item.id;
      }
    }
  }

  if (currentId) {
    activeSectionId.value = currentId;
  } else {
    activeSectionId.value = currentToc.value[0]?.id || "";
  }
};

watch(
  activeComponentId,
  () => {
    // Use setTimeout to allow DOM to render before setting active section
    setTimeout(() => {
      activeSectionId.value = currentToc.value[0]?.id || "";
    }, 0);
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <aside
      class="w-64 border-r border-slate-200 h-full overflow-y-auto bg-slate-50 flex flex-col shrink-0"
    >
      <div class="p-6 border-b border-slate-200">
        <h1 class="text-xl font-bold text-slate-800">Design System</h1>
        <p class="text-sm text-slate-500 mt-1">Component Showcase</p>
      </div>
      <div class="p-4 flex-1">
        <div v-for="cat in categories" :key="cat.name" class="mb-6">
          <h2
            class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2"
          >
            {{ cat.name }}
          </h2>
          <ul class="space-y-1">
            <li v-for="comp in cat.components" :key="comp.id">
              <button
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeComponentId === comp.id
                    ? 'bg-amnimo-50 text-amnimo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ]"
                @click="activeComponentId = comp.id"
              >
                {{ comp.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="p-4 border-t border-slate-200">
        <NuxtLink
          to="/"
          class="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Back to App
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main
      class="flex-1 h-full overflow-y-auto overflow-x-hidden bg-white p-8 scroll-smooth relative"
      @scroll="onMainScroll"
    >
      <div class="max-w-5xl mx-auto w-full relative">
        <div class="w-full">
          <!-- Elements: Alert -->
          <div v-if="activeComponentId === 'el-alert'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseAlert
            </h2>
            <div class="space-y-4">
              <BaseAlert
                type="info"
                title="Information"
                description="This is an informational alert."
                icon="heroicons:information-circle"
              />
              <BaseAlert
                type="success"
                title="Success!"
                description="Your action was successful."
                icon="heroicons:check-circle"
              />
              <BaseAlert
                type="warning"
                title="Warning"
                description="Please be careful with this action."
                icon="heroicons:exclamation-triangle"
              />
              <BaseAlert
                type="error"
                title="Error"
                description="Something went wrong."
                icon="heroicons:x-circle"
              />
            </div>
          </div>

          <!-- Elements: Avatar & Group -->
          <div v-else-if="activeComponentId === 'el-avatar'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseAvatar & BaseAvatarGroup
            </h2>
            <div class="space-y-8">
              <div>
                <h3 class="text-lg font-semibold mb-4 text-slate-700">Sizes</h3>
                <div class="flex items-center gap-4">
                  <BaseAvatar size="xs" text="XS" />
                  <BaseAvatar size="sm" text="SM" />
                  <BaseAvatar size="md" text="MD" />
                  <BaseAvatar size="lg" text="LG" />
                  <BaseAvatar size="xl" text="XL" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-4 text-slate-700">
                  Avatar Group
                </h3>
                <BaseAvatarGroup>
                  <BaseAvatar text="JD" />
                  <BaseAvatar text="AB" />
                  <BaseAvatar text="XY" />
                  <BaseAvatar text="+5" />
                </BaseAvatarGroup>
              </div>
            </div>
          </div>

          <!-- Elements: Badge -->
          <div v-else-if="activeComponentId === 'el-badge'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseBadge
            </h2>
            <div class="space-y-6">
              <div class="flex gap-2">
                <BaseBadge color="slate" variant="solid">Slate</BaseBadge>
                <BaseBadge color="red" variant="solid">Red</BaseBadge>
                <BaseBadge color="green" variant="solid">Green</BaseBadge>
                <BaseBadge color="blue" variant="solid">Blue</BaseBadge>
                <BaseBadge color="yellow" variant="solid">Yellow</BaseBadge>
              </div>
              <div class="flex gap-2">
                <BaseBadge color="slate" variant="subtle">Slate</BaseBadge>
                <BaseBadge color="red" variant="subtle">Red</BaseBadge>
                <BaseBadge color="green" variant="subtle">Green</BaseBadge>
                <BaseBadge color="blue" variant="subtle">Blue</BaseBadge>
                <BaseBadge color="yellow" variant="subtle">Yellow</BaseBadge>
              </div>
              <div class="flex gap-2">
                <BaseBadge color="slate" variant="outline">Slate</BaseBadge>
                <BaseBadge color="red" variant="outline">Red</BaseBadge>
                <BaseBadge color="green" variant="outline">Green</BaseBadge>
                <BaseBadge color="blue" variant="outline">Blue</BaseBadge>
                <BaseBadge color="yellow" variant="outline">Yellow</BaseBadge>
              </div>
            </div>
          </div>

          <!-- Elements: Banner -->
          <div v-else-if="activeComponentId === 'el-banner'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseBanner
            </h2>
            <BaseBanner
              title="Update available!"
              description="A new version of Amnimo Test Runner is ready."
              icon="heroicons:megaphone"
            >
              <template #action>
                <button
                  class="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-sm transition-colors font-medium"
                >
                  Update now
                </button>
              </template>
            </BaseBanner>
          </div>

          <!-- Elements: Button -->
          <div
            v-else-if="activeComponentId === 'el-button'"
            class="max-w-4xl pb-20"
          >
            <div class="mb-10">
              <h1 class="text-3xl font-bold text-slate-900 mb-4">Button</h1>
              <p class="text-lg text-slate-600">
                A button component with various styles, sizes, and states to
                trigger an action.
              </p>
            </div>

            <!-- Usage -->
            <section class="mb-12">
              <h2
                id="btn-usage"
                class="text-2xl font-semibold text-slate-800 mb-4"
              >
                Usage
              </h2>
              <p class="text-slate-600 mb-4">
                Use the default slot to set the label of the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton>Button</BaseButton>\n</template>`"
              >
                <BaseButton>Button</BaseButton>
              </BaseDocsDemo>
            </section>

            <!-- Label -->
            <section class="mb-12">
              <h3
                id="btn-label"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Label
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >label</code
                >
                prop to set the text inside the button instead of the default
                slot.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton label=\&quot;${mockEnv.btnLabel}\&quot; />\n</template>`"
              >
                <template #controls>
                  <div class="flex items-center gap-2 w-full">
                    <div
                      class="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 font-mono"
                    >
                      label
                    </div>
                    <input
                      v-model="mockEnv.btnLabel"
                      type="text"
                      class="border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-amnimo-500 flex-1 max-w-xs bg-white"
                    />
                  </div>
                </template>
                <BaseButton :label="mockEnv.btnLabel" />
              </BaseDocsDemo>
            </section>

            <!-- Color -->
            <section class="mb-12">
              <h3
                id="btn-color"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Color
              </h3>
              <p class="text-slate-600 mb-4">
                Choose from multiple colors using the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >color</code
                >
                prop.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton color=\&quot;${mockEnv.btnColor}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex items-center w-full">
                    <div
                      class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                    >
                      color
                    </div>
                    <BaseSelect
                      v-model="mockEnv.btnColor"
                      :options="buttonColors"
                      class="w-32"
                      buttonClass="rounded-r-xl"
                    >
                      <template #selected="{ option }">
                        <div v-if="option" class="flex items-center gap-2">
                          <span
                            class="w-2.5 h-2.5 rounded-full"
                            :class="option.colorClass"
                          />
                          <span class="truncate">{{ option.label }}</span>
                        </div>
                      </template>
                      <template #option="{ option }">
                        <div class="flex items-center gap-2">
                          <span
                            class="w-2.5 h-2.5 rounded-full"
                            :class="option.colorClass"
                          />
                          <span class="whitespace-nowrap">{{
                            option.label
                          }}</span>
                        </div>
                      </template>
                    </BaseSelect>
                  </div>
                </template>
                <BaseButton :color="mockEnv.btnColor">Button</BaseButton>
              </BaseDocsDemo>
            </section>

            <!-- Variant -->
            <section class="mb-12">
              <h3
                id="btn-variant"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Variant
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >variant</code
                >
                prop to change the variant of the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton color=\&quot;${mockEnv.variantSecColor}\&quot; variant=\&quot;${mockEnv.variantSecVariant}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        color
                      </div>
                      <BaseSelect
                        v-model="mockEnv.variantSecColor"
                        :options="buttonColors"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      >
                        <template #selected="{ option }">
                          <div v-if="option" class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            />
                            <span class="truncate">{{ option.label }}</span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            />
                            <span class="whitespace-nowrap">{{
                              option.label
                            }}</span>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        variant
                      </div>
                      <BaseSelect
                        v-model="mockEnv.variantSecVariant"
                        :options="buttonVariants"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :color="mockEnv.variantSecColor"
                  :variant="mockEnv.variantSecVariant"
                  >Button</BaseButton
                >
              </BaseDocsDemo>
            </section>

            <!-- Size -->
            <section class="mb-12">
              <h3
                id="btn-size"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Size
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >size</code
                >
                prop to change the size of the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton size=\&quot;${mockEnv.sizeSecSize}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex items-center w-full">
                    <div
                      class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                    >
                      size
                    </div>
                    <BaseSelect
                      v-model="mockEnv.sizeSecSize"
                      :options="buttonSizes"
                      class="w-24"
                      buttonClass="rounded-r-xl"
                    />
                  </div>
                </template>
                <BaseButton :size="mockEnv.sizeSecSize">Button</BaseButton>
              </BaseDocsDemo>
            </section>

            <!-- Icon -->
            <section class="mb-12">
              <h3
                id="btn-icon"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Icon
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >icon</code
                >
                prop to show an icon inside the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton icon=\&quot;${mockEnv.iconSec1Icon}\&quot; size=\&quot;${mockEnv.iconSec1Size}\&quot; color=\&quot;${mockEnv.iconSec1Color}\&quot; variant=\&quot;${mockEnv.iconSec1Variant}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        icon
                      </div>
                      <input
                        v-model="mockEnv.iconSec1Icon"
                        type="text"
                        class="w-48 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      >
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        size
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec1Size"
                        :options="buttonSizes"
                        class="w-20"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        color
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec1Color"
                        :options="buttonColors"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      >
                        <template #selected="{ option }">
                          <div class="flex items-center gap-2" v-if="option">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="truncate">{{ option.label }}</span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="whitespace-nowrap">{{
                              option.label
                            }}</span>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        variant
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec1Variant"
                        :options="buttonVariants"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :icon="mockEnv.iconSec1Icon"
                  :size="mockEnv.iconSec1Size"
                  :color="mockEnv.iconSec1Color"
                  :variant="mockEnv.iconSec1Variant"
                  >Button</BaseButton
                >
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >leading</code
                >
                and
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >trailing</code
                >
                props to set the icon position or the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >leading-icon</code
                >
                and
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >trailing-icon</code
                >
                props to set a different icon for each position.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton trailing-icon=\&quot;${mockEnv.iconSec2Trailing}\&quot; size=\&quot;${mockEnv.iconSec2Size}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        trailingIcon
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.iconSec2Trailing"
                        class="w-48 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        size
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec2Size"
                        :options="buttonSizes"
                        class="w-20"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :trailing-icon="mockEnv.iconSec2Trailing"
                  :size="mockEnv.iconSec2Size"
                  >Button</BaseButton
                >
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                The
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >label</code
                >
                as prop or slot is optional so you can use the Button as an
                icon-only button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton icon=\&quot;${mockEnv.iconSec3Icon}\&quot; size=\&quot;${mockEnv.iconSec3Size}\&quot; color=\&quot;${mockEnv.iconSec3Color}\&quot; variant=\&quot;${mockEnv.iconSec3Variant}\&quot; />\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        icon
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.iconSec3Icon"
                        class="w-48 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        size
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec3Size"
                        :options="buttonSizes"
                        class="w-20"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        color
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec3Color"
                        :options="buttonColors"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      >
                        <template #selected="{ option }">
                          <div class="flex items-center gap-2" v-if="option">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="truncate">{{ option.label }}</span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="whitespace-nowrap">{{
                              option.label
                            }}</span>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        variant
                      </div>
                      <BaseSelect
                        v-model="mockEnv.iconSec3Variant"
                        :options="buttonVariants"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :icon="mockEnv.iconSec3Icon"
                  :size="mockEnv.iconSec3Size"
                  :color="mockEnv.iconSec3Color"
                  :variant="mockEnv.iconSec3Variant"
                />
              </BaseDocsDemo>
            </section>

            <!-- Avatar -->
            <section class="mb-12">
              <h3
                id="btn-avatar"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Avatar
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >avatar</code
                >
                prop to show an Avatar inside the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton\n    :avatar=\&quot;{\n      src: '${mockEnv.avatarSec1Src}',\n      loading: 'lazy'\n    }\&quot;\n    size=\&quot;${mockEnv.avatarSec1Size}\&quot;\n    color=\&quot;${mockEnv.avatarSec1Color}\&quot;\n    variant=\&quot;${mockEnv.avatarSec1Variant}\&quot;\n  >\n    Button\n  </BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        avatar.src
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.avatarSec1Src"
                        class="w-64 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        size
                      </div>
                      <BaseSelect
                        v-model="mockEnv.avatarSec1Size"
                        :options="buttonSizes"
                        class="w-20"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        color
                      </div>
                      <BaseSelect
                        v-model="mockEnv.avatarSec1Color"
                        :options="buttonColors"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      >
                        <template #selected="{ option }">
                          <div class="flex items-center gap-2" v-if="option">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="truncate">{{ option.label }}</span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="whitespace-nowrap">{{
                              option.label
                            }}</span>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        variant
                      </div>
                      <BaseSelect
                        v-model="mockEnv.avatarSec1Variant"
                        :options="buttonVariants"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :avatar="{ src: mockEnv.avatarSec1Src, loading: 'lazy' }"
                  :size="mockEnv.avatarSec1Size"
                  :color="mockEnv.avatarSec1Color"
                  :variant="mockEnv.avatarSec1Variant"
                >
                  Button
                </BaseButton>
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                The
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >label</code
                >
                as prop or slot is optional so you can use the Button as an
                avatar-only button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton\n    :avatar=\&quot;{\n      src: '${mockEnv.avatarSec2Src}',\n      loading: 'lazy'\n    }\&quot;\n    size=\&quot;${mockEnv.avatarSec2Size}\&quot;\n    color=\&quot;${mockEnv.avatarSec2Color}\&quot;\n    variant=\&quot;${mockEnv.avatarSec2Variant}\&quot;\n  />\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        avatar.src
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.avatarSec2Src"
                        class="w-64 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        size
                      </div>
                      <BaseSelect
                        v-model="mockEnv.avatarSec2Size"
                        :options="buttonSizes"
                        class="w-20"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        color
                      </div>
                      <BaseSelect
                        v-model="mockEnv.avatarSec2Color"
                        :options="buttonColors"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      >
                        <template #selected="{ option }">
                          <div class="flex items-center gap-2" v-if="option">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="truncate">{{ option.label }}</span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="whitespace-nowrap">{{
                              option.label
                            }}</span>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        variant
                      </div>
                      <BaseSelect
                        v-model="mockEnv.avatarSec2Variant"
                        :options="buttonVariants"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :avatar="{ src: mockEnv.avatarSec2Src, loading: 'lazy' }"
                  :size="mockEnv.avatarSec2Size"
                  :color="mockEnv.avatarSec2Color"
                  :variant="mockEnv.avatarSec2Variant"
                />
              </BaseDocsDemo>
            </section>

            <!-- Link -->
            <section class="mb-12">
              <h3
                id="btn-link"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Link
              </h3>
              <p class="text-slate-600 mb-4">
                You can pass any property from the
                <span class="text-amnimo-600 font-medium">Link</span> component
                such as
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >to</code
                >,
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >target</code
                >, etc.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton to=\&quot;${mockEnv.linkSec1To}\&quot; target=\&quot;_blank\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        to
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.linkSec1To"
                        class="w-64 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton :to="mockEnv.linkSec1To" target="_blank"
                  >Button</BaseButton
                >
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                When the Button is a link or when using the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >active</code
                >
                prop, you can use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >active-color</code
                >
                and
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >active-variant</code
                >
                props to customize the active state.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton ${mockEnv.linkSec2Active ? 'active ' : ''}color=\&quot;neutral\&quot; variant=\&quot;outline\&quot; active-color=\&quot;${mockEnv.linkSec2ActiveColor}\&quot; active-variant=\&quot;${mockEnv.linkSec2ActiveVariant}\&quot;>\n    Button\n  </BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        active
                      </div>
                      <BaseSelect
                        v-model="mockEnv.linkSec2Active"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        activeColor
                      </div>
                      <BaseSelect
                        v-model="mockEnv.linkSec2ActiveColor"
                        :options="buttonColors"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      >
                        <template #selected="{ option }">
                          <div class="flex items-center gap-2" v-if="option">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="truncate">{{ option.label }}</span>
                          </div>
                        </template>
                        <template #option="{ option }">
                          <div class="flex items-center gap-2">
                            <span
                              class="w-2.5 h-2.5 rounded-full"
                              :class="option.colorClass"
                            ></span>
                            <span class="whitespace-nowrap">{{
                              option.label
                            }}</span>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        activeVariant
                      </div>
                      <BaseSelect
                        v-model="mockEnv.linkSec2ActiveVariant"
                        :options="buttonVariants"
                        class="w-32"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :active="mockEnv.linkSec2Active"
                  color="neutral"
                  variant="outline"
                  :active-color="mockEnv.linkSec2ActiveColor"
                  :active-variant="mockEnv.linkSec2ActiveVariant"
                >
                  Button
                </BaseButton>
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                You can also use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >active-class</code
                >
                and
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >inactive-class</code
                >
                props to customize the active state.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton ${mockEnv.linkSec3Active ? 'active ' : ''}active-class=\&quot;${mockEnv.linkSec3ActiveClass}\&quot; inactive-class=\&quot;${mockEnv.linkSec3InactiveClass}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        active
                      </div>
                      <BaseSelect
                        v-model="mockEnv.linkSec3Active"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        activeClass
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.linkSec3ActiveClass"
                        class="w-32 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        inactiveClass
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.linkSec3InactiveClass"
                        class="w-32 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :active="mockEnv.linkSec3Active"
                  :active-class="mockEnv.linkSec3ActiveClass"
                  :inactive-class="mockEnv.linkSec3InactiveClass"
                >
                  Button
                </BaseButton>
              </BaseDocsDemo>
            </section>

            <!-- Block -->
            <section class="mb-12">
              <h3
                id="btn-block"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Block
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >block</code
                >
                prop to make the Button span the full width of its parent.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton ${mockEnv.btnBlock ? 'block' : ''}>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        block
                      </div>
                      <BaseSelect
                        v-model="mockEnv.btnBlock"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton :block="mockEnv.btnBlock">Button</BaseButton>
              </BaseDocsDemo>
            </section>

            <!-- Loading -->
            <section class="mb-12">
              <h3
                id="btn-loading"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Loading
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >loading</code
                >
                prop to show a loading icon and disable the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton ${mockEnv.loadingSec1Loading ? 'loading ' : ''}${mockEnv.loadingSec1Trailing ? 'trailing' : ''}>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        loading
                      </div>
                      <BaseSelect
                        v-model="mockEnv.loadingSec1Loading"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        trailing
                      </div>
                      <BaseSelect
                        v-model="mockEnv.loadingSec1Trailing"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :loading="mockEnv.loadingSec1Loading"
                  :trailing="mockEnv.loadingSec1Trailing"
                  >Button</BaseButton
                >
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >loading-auto</code
                >
                prop to show the loading icon automatically while the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >@click</code
                >
                promise is pending.
              </p>
              <BaseDocsDemo
                :code="`<script setup lang=\&quot;ts\&quot;>\nasync function onClick() {\n  return new Promise<void>(res => setTimeout(res, 1000))\n}\n</script>\n\n<template>\n  <BaseButton loading-auto @click=\&quot;onClick\&quot;>\n    Button\n  </BaseButton>\n</template>`"
              >
                <BaseButton loading-auto @click="loadingSec2OnClick"
                  >Button</BaseButton
                >
              </BaseDocsDemo>

              <p class="text-slate-600 mb-4 mt-8">
                This also works with the
                <span class="text-amnimo-600 font-medium">Form</span> component.
              </p>
              <BaseDocsDemo
                :code="`<script setup lang=\&quot;ts\&quot;>\nconst state = reactive({ fullName: '' })\n\nasync function onSubmit() {\n  return new Promise<void>(res => setTimeout(res, 1000))\n}\n\nasync function validate(data: Partial<typeof state>) {\n  if (!data.fullName?.length) return [{ name: 'fullName', message: 'Required' }]\n  return []\n}\n</script>\n\n<template>\n  <BaseForm :state=\&quot;state\&quot; :validate=\&quot;validate\&quot; @submit=\&quot;onSubmit\&quot;>\n    <BaseFormField name=\&quot;fullName\&quot; label=\&quot;Full name\&quot;>\n      <BaseInput v-model=\&quot;state.fullName\&quot; />\n    </BaseFormField>\n    <BaseButton type=\&quot;submit\&quot; class=\&quot;mt-2\&quot; loading-auto>\n      Submit\n    </BaseButton>\n  </BaseForm>\n</template>`"
              >
                <BaseForm @submit="formOnSubmit">
                  <BaseFormField
                    name="fullName"
                    label="Full name"
                    :error="formError"
                  >
                    <BaseInput v-model="formState.fullName" />
                  </BaseFormField>
                  <BaseButton
                    type="submit"
                    class="mt-4"
                    loading-auto
                    @click="formOnSubmit"
                    >Submit</BaseButton
                  >
                </BaseForm>
              </BaseDocsDemo>
            </section>

            <!-- Loading Icon -->
            <section class="mb-12">
              <h3
                id="btn-loading-icon"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Loading Icon
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >loading-icon</code
                >
                prop to customize the loading icon. Defaults to
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >AppSpinner</code
                >.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton ${mockEnv.loadingIconSec1Loading ? 'loading ' : ''}loading-icon=\&quot;${mockEnv.loadingIconSec1LoadingIcon}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        loading
                      </div>
                      <BaseSelect
                        v-model="mockEnv.loadingIconSec1Loading"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        loadingIcon
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.loadingIconSec1LoadingIcon"
                        class="w-48 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  :loading="mockEnv.loadingIconSec1Loading"
                  :loading-icon="mockEnv.loadingIconSec1LoadingIcon"
                  >Button</BaseButton
                >
              </BaseDocsDemo>
            </section>

            <!-- Disabled -->
            <section class="mb-12">
              <h3
                id="btn-disabled"
                class="text-xl font-semibold text-slate-800 mb-4"
              >
                Disabled
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >disabled</code
                >
                prop to disable the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton ${mockEnv.disabledSec1Disabled ? 'disabled' : ''}>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        disabled
                      </div>
                      <BaseSelect
                        v-model="mockEnv.disabledSec1Disabled"
                        :options="booleanOptions"
                        class="w-24"
                        buttonClass="rounded-r-xl"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton :disabled="mockEnv.disabledSec1Disabled"
                  >Button</BaseButton
                >
              </BaseDocsDemo>
            </section>

            <!-- Examples -->
            <section class="mb-12">
              <h2
                id="btn-examples"
                class="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6"
              >
                Examples
              </h2>

              <h3 class="text-xl font-semibold text-slate-800 mb-4">
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-lg font-mono"
                  >class</code
                >
                prop
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >class</code
                >
                prop to override the base styles of the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton class=\&quot;${mockEnv.classPropSec1Class}\&quot;>Button</BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center w-full max-w-sm">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium"
                      >
                        class
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.classPropSec1Class"
                        class="flex-1 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton :class="mockEnv.classPropSec1Class"
                  >Button</BaseButton
                >
              </BaseDocsDemo>

              <h3 class="text-xl font-semibold text-slate-800 mb-4 mt-12">
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-lg font-mono"
                  >ui</code
                >
                prop
              </h3>
              <p class="text-slate-600 mb-4">
                Use the
                <code
                  class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                  >ui</code
                >
                prop to override the slots styles of the Button.
              </p>
              <BaseDocsDemo
                :code="`<template>\n  <BaseButton\n    icon=\&quot;lucide:rocket\&quot;\n    color=\&quot;neutral\&quot;\n    variant=\&quot;outline\&quot;\n    :ui=\&quot;{\n      leadingIcon: '${mockEnv.uiPropSec1LeadingIcon}'\n    }\&quot;\n  >\n    Button\n  </BaseButton>\n</template>`"
              >
                <template #controls>
                  <div class="flex flex-wrap items-center gap-4 w-full">
                    <div class="flex items-center w-full max-w-sm">
                      <div
                        class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium whitespace-nowrap"
                      >
                        ui.leadingIcon
                      </div>
                      <input
                        type="text"
                        v-model="mockEnv.uiPropSec1LeadingIcon"
                        class="flex-1 bg-white border border-slate-200 rounded-r-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amnimo-500 focus:border-amnimo-500"
                      />
                    </div>
                  </div>
                </template>
                <BaseButton
                  icon="lucide:rocket"
                  color="neutral"
                  variant="outline"
                  :ui="{ leadingIcon: mockEnv.uiPropSec1LeadingIcon }"
                  >Button</BaseButton
                >
              </BaseDocsDemo>
            </section>

            <!-- API Table -->
            <section>
              <h2
                id="btn-api"
                class="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6"
              >
                API
              </h2>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-200 text-sm">
                      <th class="py-3 px-4 font-semibold text-slate-900">
                        Prop
                      </th>
                      <th class="py-3 px-4 font-semibold text-slate-900">
                        Type
                      </th>
                      <th class="py-3 px-4 font-semibold text-slate-900">
                        Default
                      </th>
                      <th class="py-3 px-4 font-semibold text-slate-900">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="text-sm text-slate-600 divide-y divide-slate-100"
                  >
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        type
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'button'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'submit'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'reset'</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >'button'</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        The HTML type of the button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        variant
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'solid'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'outline'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'soft'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'ghost'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'subtle'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'link'</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >'solid'</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        The visual variant of the button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        color
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'primary'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'secondary'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'success'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'info'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'warning'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'error'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'neutral'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'white'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'gray'</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >'primary'</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        The color theme of the button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        size
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'xs'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'sm'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'md'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'lg'</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >'xl'</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >'md'</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        The size of the button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        label
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        The text to display inside the button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        icon / leadingIcon
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Icon to display before the label.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        trailingIcon
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Icon to display after the label.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        avatar
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >object</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Avatar object (src, alt, etc.) to display before the
                        label.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        loading
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Shows a loading spinner and prevents clicks.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        loadingIcon
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Icon to display when loading (defaults to AppSpinner).
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        loadingAuto
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Automatically manages loading state for async onClick
                        handlers.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        trailing
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Places the loading spinner at the trailing position
                        instead of leading.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        disabled
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Disables the button visually and functionally.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        block
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Makes the button span the full width of its container.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        padded
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >true</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Adds padding to the button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        square
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Makes the button square (equal padding). Defaults to
                        true if no label is provided.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        truncate
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Truncates the label text with ellipsis if it overflows.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        to / href
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >string</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >object</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Renders a link (NuxtLink or a tag) instead of a button.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        target
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        The target attribute for the link (e.g., '_blank').
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        active
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >boolean</code
                        >
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >false</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-600">
                        Forces the active state visually (useful for links).
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        activeClass
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Class to apply when the button/link is active.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        inactiveClass
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >string</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Class to apply when the button/link is inactive.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        activeColor
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >string</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Overrides the color when the button/link is active.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        activeVariant
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >string</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Overrides the variant when the button/link is active.
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        ui
                      </td>
                      <td class="py-4 px-4">
                        <code
                          class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                          >object</code
                        >
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Overrides specific tailwind classes for inner elements
                        (base, font, rounded, size, gap, padding, square, color,
                        variant, icon, leadingIcon, trailingIcon).
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="py-4 px-4 font-mono text-sm font-semibold text-amnimo-600"
                      >
                        onClick
                      </td>
                      <td class="py-4 px-4">
                        <div class="flex flex-wrap gap-1">
                          <code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >function</code
                          ><code
                            class="bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-xs font-mono"
                            >function[]</code
                          >
                        </div>
                      </td>
                      <td class="py-4 px-4 text-slate-400">-</td>
                      <td class="py-4 px-4 text-slate-600">
                        Click event handler(s). If it returns a Promise and
                        `loadingAuto` is true, the button will enter loading
                        state.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <!-- Elements: Calendar -->
          <div v-else-if="activeComponentId === 'el-calendar'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseCalendar
            </h2>
            <div class="max-w-xs">
              <BaseCalendar />
            </div>
          </div>

          <!-- Elements: Card -->
          <div v-else-if="activeComponentId === 'el-card'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseCard
            </h2>
            <div class="max-w-md">
              <BaseCard>
                <template #header>
                  <h3 class="font-bold text-slate-800">Card Title</h3>
                </template>
                <p class="text-slate-600 text-sm">
                  This is the main body of the card. You can put any content
                  here.
                </p>
                <template #footer>
                  <div class="flex justify-end gap-2">
                    <BaseButton color="white" size="sm">Cancel</BaseButton>
                    <BaseButton size="sm">Save</BaseButton>
                  </div>
                </template>
              </BaseCard>
            </div>
          </div>

          <!-- Elements: Chip -->
          <div v-else-if="activeComponentId === 'el-chip'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseChip
            </h2>
            <div class="flex gap-8 items-center p-8">
              <BaseChip color="red">
                <BaseAvatar text="JD" />
              </BaseChip>
              <BaseChip color="green" position="bottom-right">
                <BaseAvatar text="ON" />
              </BaseChip>
              <BaseChip color="blue" position="top-left">
                <BaseIcon
                  name="heroicons:bell"
                  size="xl"
                  class="text-slate-500"
                />
              </BaseChip>
            </div>
          </div>

          <!-- Elements: Collapsible -->
          <div v-else-if="activeComponentId === 'el-collapsible'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseCollapsible
            </h2>
            <div class="max-w-md space-y-4">
              <BaseCollapsible title="Click to expand">
                <p class="text-sm text-slate-600">
                  Hidden content revealed! You can put forms or long text here.
                </p>
              </BaseCollapsible>
              <BaseCollapsible title="Open by default" default-open>
                <p class="text-sm text-slate-600">This one starts open.</p>
              </BaseCollapsible>
            </div>
          </div>

          <!-- Elements: Field Group -->
          <div v-else-if="activeComponentId === 'el-fieldgroup'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseFieldGroup
            </h2>
            <div class="max-w-sm space-y-6">
              <BaseFieldGroup
                label="Username"
                description="Choose a unique username."
                required
              >
                <input
                  type="text"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amnimo-600 sm:text-sm sm:leading-6"
                  placeholder="johndoe"
                />
              </BaseFieldGroup>

              <BaseFieldGroup
                label="Password"
                error="Password is too short"
                required
              >
                <input
                  type="password"
                  class="block w-full rounded-md border-0 py-1.5 px-3 text-red-900 shadow-sm ring-1 ring-inset ring-red-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                  value="123"
                />
              </BaseFieldGroup>
            </div>
          </div>

          <!-- Elements: Icon -->
          <div v-else-if="activeComponentId === 'el-icon'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseIcon
            </h2>
            <div class="flex items-end gap-4 text-slate-700">
              <BaseIcon name="heroicons:home" size="sm" />
              <BaseIcon name="heroicons:home" size="md" />
              <BaseIcon name="heroicons:home" size="lg" />
              <BaseIcon name="heroicons:home" size="xl" />
            </div>
          </div>

          <!-- Elements: Kbd -->
          <div v-else-if="activeComponentId === 'el-kbd'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseKbd
            </h2>
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-600">Press</span>
              <BaseKbd>Ctrl</BaseKbd>
              <span class="text-sm text-slate-600">+</span>
              <BaseKbd>K</BaseKbd>
              <span class="text-sm text-slate-600">to search</span>
            </div>
          </div>

          <!-- Elements: Progress -->
          <div v-else-if="activeComponentId === 'el-progress'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseProgress
            </h2>
            <div class="max-w-md space-y-6">
              <BaseProgress :value="45" size="md" />
              <BaseProgress :value="75" size="sm" color="green" />
              <BaseProgress
                :value="100"
                size="lg"
                color="red"
                animation="pulse"
              />
            </div>
          </div>

          <!-- Elements: Separator -->
          <div v-else-if="activeComponentId === 'el-separator'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseSeparator
            </h2>
            <div class="max-w-md space-y-8">
              <BaseSeparator />
              <BaseSeparator>OR</BaseSeparator>
              <div
                class="flex h-16 items-center justify-center space-x-4 text-sm font-medium text-slate-600"
              >
                <div>Blog</div>
                <BaseSeparator orientation="vertical" />
                <div>Docs</div>
                <BaseSeparator orientation="vertical" />
                <div>Source</div>
              </div>
            </div>
          </div>

          <!-- Elements: Skeleton -->
          <div v-else-if="activeComponentId === 'el-skeleton'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseSkeleton
            </h2>
            <div class="flex items-center gap-4 max-w-md">
              <BaseSkeleton shape="circle" class="w-12 h-12 shrink-0" />
              <div class="flex-1 space-y-2">
                <BaseSkeleton shape="text" class="w-3/4" />
                <BaseSkeleton shape="text" />
              </div>
            </div>
          </div>

          <!-- Forms: Checkbox -->
          <div v-else-if="activeComponentId === 'form-checkbox'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseCheckbox & BaseCheckboxGroup
            </h2>
            <div class="space-y-8 max-w-sm">
              <BaseCheckbox
                label="Remember me"
                description="Save my login details for next time."
              />

              <BaseCheckboxGroup
                :options="[
                  {
                    label: 'Email',
                    value: 'email',
                    description: 'Get notifications via email',
                  },
                  {
                    label: 'SMS',
                    value: 'sms',
                    description: 'Get notifications via SMS',
                  },
                  {
                    label: 'Push',
                    value: 'push',
                    disabled: true,
                    description: 'Not supported on your device',
                  },
                ]"
                :modelValue="['email']"
              />
            </div>
          </div>

          <!-- Forms: Color Picker -->
          <div v-else-if="activeComponentId === 'form-color'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseColorPicker
            </h2>
            <div class="max-w-sm">
              <BaseColorPicker modelValue="#3b82f6" />
            </div>
          </div>

          <!-- Forms: File Upload -->
          <div v-else-if="activeComponentId === 'form-file'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseFileUpload
            </h2>
            <div class="max-w-md">
              <BaseFileUpload />
            </div>
          </div>

          <!-- Forms: Form & FormField -->
          <div v-else-if="activeComponentId === 'form-form'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseForm & BaseFormField
            </h2>
            <BaseForm class="max-w-sm">
              <BaseFormField
                label="Email"
                required
                error="Invalid email address"
              >
                <BaseInput
                  type="email"
                  placeholder="you@example.com"
                  value="wrong-email"
                />
              </BaseFormField>

              <BaseFormField label="Password" required>
                <BaseInput type="password" />
              </BaseFormField>

              <BaseButton type="submit" class="w-full justify-center"
                >Sign in</BaseButton
              >
            </BaseForm>
          </div>

          <!-- Forms: Input -->
          <div v-else-if="activeComponentId === 'form-input'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseInput (Text, Date, Time, Number)
            </h2>
            <div class="max-w-sm space-y-4">
              <BaseInput
                placeholder="Search..."
                icon="heroicons:magnifying-glass"
              />
              <BaseInput placeholder="Username" trailingIcon="heroicons:user" />
              <BaseInputDate />
              <BaseInputTime />
              <BaseInputNumber />
            </div>
          </div>

          <!-- Forms: Input Menu -->
          <div v-else-if="activeComponentId === 'form-inputmenu'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseInputMenu
            </h2>
            <div class="max-w-sm">
              <BaseInputMenu
                placeholder="Select a framework"
                :options="['Vue', 'React', 'Angular', 'Svelte']"
              />
            </div>
          </div>

          <!-- Forms: Rating -->
          <div v-else-if="activeComponentId === 'form-rating'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseInputRating
            </h2>
            <div class="max-w-sm space-y-4">
              <BaseInputRating :modelValue="3" />
              <BaseInputRating :modelValue="4" :max="10" />
            </div>
          </div>

          <!-- Forms: Tags -->
          <div v-else-if="activeComponentId === 'form-tags'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseInputTags
            </h2>
            <div class="max-w-md">
              <BaseInputTags
                :modelValue="['Vue', 'Nuxt']"
                placeholder="Add a tag..."
              />
            </div>
          </div>

          <!-- Forms: Listbox -->
          <div v-else-if="activeComponentId === 'form-listbox'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseListbox
            </h2>
            <div class="max-w-sm">
              <BaseListbox
                :modelValue="2"
                :options="[
                  { label: 'Wade Cooper', value: 1 },
                  { label: 'Arlene Mccoy', value: 2 },
                  { label: 'Devon Webb', value: 3 },
                ]"
              />
            </div>
          </div>

          <!-- Forms: Pin Input -->
          <div v-else-if="activeComponentId === 'form-pin'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BasePinInput
            </h2>
            <BasePinInput />
          </div>

          <!-- Forms: Radio Group -->
          <div v-else-if="activeComponentId === 'form-radio'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseRadioGroup
            </h2>
            <div class="max-w-sm">
              <BaseRadioGroup
                :modelValue="'standard'"
                :options="[
                  {
                    label: 'Standard',
                    value: 'standard',
                    description: '4-6 business days',
                  },
                  {
                    label: 'Express',
                    value: 'express',
                    description: '2-5 business days',
                  },
                  {
                    label: 'Same day',
                    value: 'sameday',
                    disabled: true,
                    description: 'Not available for your location',
                  },
                ]"
              />
            </div>
          </div>

          <!-- Forms: Select -->
          <div v-else-if="activeComponentId === 'form-select'" class="space-y-16">
            <section id="select-usage">
              <h2 class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">BaseSelect</h2>
              <p class="text-slate-600 mb-6">A custom select component built from scratch with tailwindcss.</p>
              
              <BaseDocsDemo
                :code="`<template>\n  <BaseSelect v-model='selectedValue' :options='options' />\n</template>`"
              >
                <div class="max-w-xs w-full">
                  <BaseSelect v-model="mockEnv.selectValue" :options="[
                    { label: 'Option 1', value: 'opt1' },
                    { label: 'Option 2', value: 'opt2' },
                    { label: 'Option 3', value: 'opt3' }
                  ]" />
                </div>
              </BaseDocsDemo>
            </section>

            <section id="select-placeholder">
              <h3 class="text-xl font-semibold text-slate-800 mb-4">Placeholder</h3>
              <p class="text-slate-600 mb-4">Use the <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">placeholder</code> prop.</p>
              
              <BaseDocsDemo
                :code="`<template>\n  <BaseSelect v-model='emptyValue' :options='options' placeholder='Select an item' />\n</template>`"
              >
                <div class="max-w-xs w-full">
                  <BaseSelect v-model="mockEnv.emptySelectValue" :options="[
                    { label: 'Item 1', value: 'item1' },
                    { label: 'Item 2', value: 'item2' }
                  ]" placeholder="Select an item" />
                </div>
              </BaseDocsDemo>
            </section>

            <section id="select-icon">
              <h3 class="text-xl font-semibold text-slate-800 mb-4">Icon</h3>
              <p class="text-slate-600 mb-4">Add a leading icon using the <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">icon</code> prop.</p>
              
              <BaseDocsDemo
                :code="`<template>\n  <BaseSelect v-model='selectedValue' :options='options' icon='lucide:globe' />\n</template>`"
              >
                <div class="max-w-xs w-full">
                  <BaseSelect v-model="mockEnv.selectIconValue" :options="[
                    { label: 'English', value: 'en' },
                    { label: 'Vietnamese', value: 'vi' }
                  ]" icon="lucide:globe" />
                </div>
              </BaseDocsDemo>
            </section>

            <section id="select-button-class">
              <h3 class="text-xl font-semibold text-slate-800 mb-4">Button Class</h3>
              <p class="text-slate-600 mb-4">Use the <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">buttonClass</code> prop to override the inner button's classes (e.g. for rounded corners).</p>
              
              <BaseDocsDemo
                :code="`<template>\n  <BaseSelect v-model='selectedValue' :options='options' buttonClass='rounded-r-xl' />\n</template>`"
              >
                <div class="flex items-center">
                  <div class="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-3 py-2 text-sm text-slate-600 font-medium">Domain</div>
                  <BaseSelect v-model="mockEnv.selectBtnClassValue" :options="[
                    { label: '.com', value: 'com' },
                    { label: '.vn', value: 'vn' }
                  ]" buttonClass="rounded-r-xl" class="w-24" />
                </div>
              </BaseDocsDemo>
            </section>

            <!-- API Docs for Select -->
            <section id="select-api" class="pt-8">
              <h2 class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6">API</h2>
              
              <div class="overflow-x-auto shadow-sm rounded-lg border border-slate-200">
                <table class="w-full text-left text-sm text-slate-600">
                  <thead class="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                    <tr>
                      <th class="px-4 py-3">Prop</th>
                      <th class="px-4 py-3">Type</th>
                      <th class="px-4 py-3">Default</th>
                      <th class="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 font-mono text-xs text-amnimo-600">modelValue</td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-500">
                        <div class="flex flex-wrap gap-1">
                          <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">string</code>
                          <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">number</code>
                        </div>
                      </td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-400">-</td>
                      <td class="px-4 py-3">The bound value of the select.</td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 font-mono text-xs text-amnimo-600">options</td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-500">
                        <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">Array&lt;{ label: string; value: string | number }&gt;</code>
                      </td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-400">[]</td>
                      <td class="px-4 py-3">List of options to display.</td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 font-mono text-xs text-amnimo-600">placeholder</td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-500">
                        <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">string</code>
                      </td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-400">"Select"</td>
                      <td class="px-4 py-3">Text displayed when no option is selected.</td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 font-mono text-xs text-amnimo-600">icon</td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-500">
                        <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">string</code>
                      </td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-400">-</td>
                      <td class="px-4 py-3">Icon to display before the selected text.</td>
                    </tr>
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 font-mono text-xs text-amnimo-600">buttonClass</td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-500">
                        <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">string</code>
                      </td>
                      <td class="px-4 py-3 font-mono text-xs text-slate-400">"rounded-xl"</td>
                      <td class="px-4 py-3">CSS classes applied to the inner button.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <!-- Forms: Slider -->
          <div v-else-if="activeComponentId === 'form-slider'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseSlider
            </h2>
            <div class="max-w-sm">
              <BaseSlider :modelValue="50" />
            </div>
          </div>

          <!-- Forms: Switch -->
          <div v-else-if="activeComponentId === 'form-switch'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseSwitch
            </h2>
            <div class="flex gap-4">
              <BaseSwitch :modelValue="false" />
              <BaseSwitch :modelValue="true" />
              <BaseSwitch :modelValue="true" disabled />
            </div>
          </div>

          <!-- Forms: Textarea -->
          <div v-else-if="activeComponentId === 'form-textarea'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseTextarea
            </h2>
            <div class="max-w-sm">
              <BaseTextarea placeholder="Type your message here..." :rows="4" />
            </div>
          </div>

          <!-- Data: Accordion -->
          <div v-else-if="activeComponentId === 'data-accordion'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseAccordion
            </h2>
            <div class="max-w-md">
              <BaseAccordion
                :items="[
                  {
                    label: 'Getting Started',
                    icon: 'heroicons:rocket-launch',
                    content: 'Learn the basics of our platform.',
                  },
                  {
                    label: 'Advanced Features',
                    icon: 'heroicons:sparkles',
                    content: 'Explore powerful tools for pros.',
                  },
                  {
                    label: 'Billing & Subscriptions',
                    icon: 'heroicons:credit-card',
                    content: 'Manage your payment methods.',
                  },
                  {
                    label: 'Deprecated APIs',
                    icon: 'heroicons:archive-box',
                    content: 'Legacy endpoints no longer supported.',
                    disabled: true,
                  },
                ]"
              />
            </div>
          </div>

          <!-- Data: Carousel -->
          <div v-else-if="activeComponentId === 'data-carousel'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseCarousel
            </h2>
            <div class="max-w-xl">
              <BaseCarousel :items="[1, 2, 3, 4, 5, 6]" arrows>
                <template #default="{ item }">
                  <div
                    class="w-64 h-40 bg-gradient-to-br from-amnimo-400 to-amnimo-600 rounded-xl flex items-center justify-center text-white text-4xl font-bold shadow-sm"
                  >
                    {{ item }}
                  </div>
                </template>
              </BaseCarousel>
            </div>
          </div>

          <!-- Data: Empty -->
          <div v-else-if="activeComponentId === 'data-empty'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseEmpty
            </h2>
            <div class="border border-slate-200 rounded-xl p-8 max-w-2xl">
              <BaseEmpty icon="heroicons:inbox" label="No tasks found">
                Get started by creating a new task.
              </BaseEmpty>
            </div>
          </div>

          <!-- Data: Marquee -->
          <div v-else-if="activeComponentId === 'data-marquee'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseMarquee
            </h2>
            <div
              class="border-y border-slate-200 py-4 max-w-3xl overflow-hidden bg-slate-50"
            >
              <BaseMarquee speed="fast">
                <span class="text-xl font-bold text-slate-400 mx-8">VUE 3</span>
                <span class="text-xl font-bold text-slate-400 mx-8"
                  >NUXT 4</span
                >
                <span class="text-xl font-bold text-slate-400 mx-8"
                  >TAILWIND CSS</span
                >
                <span class="text-xl font-bold text-slate-400 mx-8">VITE</span>
                <span class="text-xl font-bold text-slate-400 mx-8"
                  >TYPESCRIPT</span
                >
              </BaseMarquee>
            </div>
          </div>

          <!-- Data: Scroll Area -->
          <div v-else-if="activeComponentId === 'data-scrollarea'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseScrollArea
            </h2>
            <div
              class="max-w-sm h-64 border border-slate-200 rounded-lg p-4 bg-slate-50"
            >
              <BaseScrollArea class="h-full pr-4">
                <div class="space-y-4">
                  <p v-for="i in 10" :key="i" class="text-sm text-slate-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </BaseScrollArea>
            </div>
          </div>

          <!-- Data: Table -->
          <div v-else-if="activeComponentId === 'data-table'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseTable
            </h2>
            <div class="max-w-4xl">
              <BaseTable
                :columns="[
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                ]"
                :rows="[
                  { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
                  {
                    id: 2,
                    name: 'Jane Smith',
                    role: 'Editor',
                    status: 'Inactive',
                  },
                  {
                    id: 3,
                    name: 'Bob Johnson',
                    role: 'Viewer',
                    status: 'Active',
                  },
                ]"
              />
            </div>
          </div>

          <!-- Data: Timeline -->
          <div v-else-if="activeComponentId === 'data-timeline'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseTimeline
            </h2>
            <div
              class="max-w-md p-6 border border-slate-200 rounded-xl bg-white shadow-sm"
            >
              <BaseTimeline
                :items="[
                  {
                    title: 'Project kick-off',
                    time: 'Jan 15, 2026',
                    description: 'Initial team meeting and scope definition.',
                    icon: 'heroicons:flag',
                    color: 'blue',
                  },
                  {
                    title: 'Design approved',
                    time: 'Feb 02, 2026',
                    description: 'Client signed off on all mockups.',
                    icon: 'heroicons:check-badge',
                    color: 'green',
                  },
                  {
                    title: 'Development phase',
                    time: 'Feb 10, 2026',
                    description: 'Engineering team begins implementation.',
                    icon: 'heroicons:code-bracket',
                    color: 'amnimo',
                  },
                  {
                    title: 'Launch',
                    time: 'Mar 01, 2026',
                    icon: 'heroicons:rocket-launch',
                    color: 'slate',
                  },
                ]"
              />
            </div>
          </div>

          <!-- Data: Tree -->
          <div v-else-if="activeComponentId === 'data-tree'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseTree
            </h2>
            <div class="max-w-sm p-4 border border-slate-200 rounded-lg">
              <BaseTree
                :nodes="[
                  {
                    id: 1,
                    label: 'src',
                    icon: 'heroicons:folder',
                    children: [
                      {
                        id: 11,
                        label: 'components',
                        icon: 'heroicons:folder',
                        children: [
                          {
                            id: 111,
                            label: 'BaseButton.vue',
                            icon: 'heroicons:document',
                          },
                          {
                            id: 112,
                            label: 'BaseCard.vue',
                            icon: 'heroicons:document',
                          },
                        ],
                      },
                      {
                        id: 12,
                        label: 'pages',
                        icon: 'heroicons:folder',
                        children: [
                          {
                            id: 121,
                            label: 'index.vue',
                            icon: 'heroicons:document',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 2,
                    label: 'package.json',
                    icon: 'heroicons:document-text',
                  },
                ]"
              />
            </div>
          </div>

          <!-- Data: User -->
          <div v-else-if="activeComponentId === 'data-user'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseUser
            </h2>
            <div
              class="flex gap-12 p-8 border border-slate-200 rounded-xl bg-slate-50"
            >
              <BaseUser
                avatar="JS"
                name="Jane Smith"
                description="Senior Software Engineer"
              />
              <BaseUser avatar="DW" name="Devon Webb" />
            </div>
          </div>

          <!-- Navigation: Breadcrumb -->
          <div v-else-if="activeComponentId === 'nav-breadcrumb'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseBreadcrumb
            </h2>
            <div class="p-6 border border-slate-200 rounded-xl bg-slate-50">
              <BaseBreadcrumb
                :links="[
                  { label: 'Home', to: '/', icon: 'heroicons:home' },
                  {
                    label: 'Components',
                    to: '/components',
                    icon: 'heroicons:cube',
                  },
                  { label: 'Navigation' },
                ]"
              />
            </div>
          </div>

          <!-- Navigation: Command Palette -->
          <div v-else-if="activeComponentId === 'nav-commandpalette'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseCommandPalette
            </h2>
            <div class="flex items-center gap-4">
              <BaseButton
                @click="mockEnv.showCommandPalette = true"
                icon="heroicons:command-line"
              >
                Open Command Palette (Mock)
              </BaseButton>
              <span class="text-sm text-slate-500"
                >Pressing ESC will close it.</span
              >
            </div>
            <!-- The Palette Modal -->
            <BaseCommandPalette v-model="mockEnv.showCommandPalette" />
          </div>

          <!-- Navigation: Footer Columns -->
          <div v-else-if="activeComponentId === 'nav-footercolumns'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseFooterColumns
            </h2>
            <div class="p-8 border border-slate-200 rounded-xl bg-slate-50">
              <BaseFooterColumns
                :columns="[
                  {
                    title: 'Resources',
                    links: [
                      { label: 'Documentation', to: '#' },
                      { label: 'Help Center', to: '#' },
                    ],
                  },
                  {
                    title: 'Company',
                    links: [
                      { label: 'About', to: '#' },
                      { label: 'Blog', to: '#' },
                    ],
                  },
                  {
                    title: 'Legal',
                    links: [
                      { label: 'Privacy', to: '#' },
                      { label: 'Terms', to: '#' },
                    ],
                  },
                ]"
              />
            </div>
          </div>

          <!-- Navigation: Link -->
          <div v-else-if="activeComponentId === 'nav-link'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseLink
            </h2>
            <div
              class="p-6 border border-slate-200 rounded-xl bg-white flex gap-6"
            >
              <BaseLink to="#">Internal Link</BaseLink>
              <BaseLink href="https://google.com" target="_blank"
                >External Link</BaseLink
              >
            </div>
          </div>

          <!-- Navigation: Navigation Menu -->
          <div v-else-if="activeComponentId === 'nav-navigationmenu'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseNavigationMenu
            </h2>
            <div class="border border-slate-200 rounded-lg overflow-hidden">
              <BaseNavigationMenu
                :links="[
                  { label: 'Dashboard', to: '#', icon: 'heroicons:home' },
                  {
                    label: 'Projects',
                    to: '/components',
                    icon: 'heroicons:folder',
                    badge: '4',
                  },
                  { label: 'Team', to: '#team', icon: 'heroicons:users' },
                ]"
              />
            </div>
          </div>

          <!-- Navigation: Pagination -->
          <div v-else-if="activeComponentId === 'nav-pagination'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BasePagination
            </h2>
            <div class="border border-slate-200 rounded-xl">
              <BasePagination
                v-model:page="mockEnv.currentPage"
                :total="97"
                :perPage="10"
              />
            </div>
            <p class="mt-4 text-sm text-slate-500">
              Current Page State: {{ mockEnv.currentPage }}
            </p>
          </div>

          <!-- Navigation: Stepper -->
          <div v-else-if="activeComponentId === 'nav-stepper'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseStepper
            </h2>
            <div class="p-8 border border-slate-200 rounded-xl bg-white">
              <BaseStepper
                v-model:currentStep="mockEnv.currentStep"
                :steps="[
                  {
                    title: 'Job details',
                    description: 'Enter the job specifics.',
                  },
                  {
                    title: 'Application form',
                    description: 'Customize the questions.',
                  },
                  {
                    title: 'Preview',
                    description: 'Review before publishing.',
                  },
                ]"
              />
              <div class="mt-8 flex gap-4">
                <BaseButton
                  variant="outline"
                  @click="
                    mockEnv.currentStep = Math.max(0, mockEnv.currentStep - 1)
                  "
                  >Back</BaseButton
                >
                <BaseButton
                  @click="
                    mockEnv.currentStep = Math.min(2, mockEnv.currentStep + 1)
                  "
                  >Continue</BaseButton
                >
              </div>
            </div>
          </div>

          <!-- Navigation: Tabs -->
          <div v-else-if="activeComponentId === 'nav-tabs'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseTabs
            </h2>
            <div
              class="p-6 border border-slate-200 rounded-xl bg-white max-w-2xl"
            >
              <BaseTabs
                :items="[
                  {
                    label: 'My Account',
                    icon: 'heroicons:user',
                    key: 'account',
                  },
                  {
                    label: 'Company',
                    icon: 'heroicons:building-office',
                    key: 'company',
                  },
                  {
                    label: 'Team Members',
                    icon: 'heroicons:users',
                    key: 'team',
                  },
                  {
                    label: 'Billing',
                    icon: 'heroicons:credit-card',
                    key: 'billing',
                    disabled: true,
                  },
                ]"
              >
                <template #account>
                  <div
                    class="p-4 bg-slate-50 rounded-lg text-sm text-slate-600"
                  >
                    Manage your personal account settings here.
                  </div>
                </template>
                <template #company>
                  <div
                    class="p-4 bg-slate-50 rounded-lg text-sm text-slate-600"
                  >
                    Company details and preferences.
                  </div>
                </template>
                <template #team>
                  <div
                    class="p-4 bg-slate-50 rounded-lg text-sm text-slate-600"
                  >
                    Invite and manage your team members.
                  </div>
                </template>
              </BaseTabs>
            </div>
          </div>

          <!-- Overlay: Context Menu -->
          <div v-else-if="activeComponentId === 'overlay-contextmenu'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseContextMenu
            </h2>
            <div
              class="border border-slate-200 rounded-xl bg-slate-50 p-8 h-64 flex items-center justify-center text-slate-500"
            >
              <BaseContextMenu
                :items="[
                  { label: 'Edit', icon: 'heroicons:pencil-square' },
                  { label: 'Duplicate', icon: 'heroicons:document-duplicate' },
                  { label: 'Archive', icon: 'heroicons:archive-box' },
                  { label: 'Delete', icon: 'heroicons:trash' },
                ]"
              >
                <div
                  class="w-64 h-32 bg-white border border-slate-200 border-dashed rounded-lg flex items-center justify-center select-none shadow-sm text-sm"
                >
                  Right click inside this box
                </div>
              </BaseContextMenu>
            </div>
          </div>

          <!-- Overlay: Drawer -->
          <div v-else-if="activeComponentId === 'overlay-drawer'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseDrawer
            </h2>
            <BaseButton @click="mockEnv.showDrawer = true"
              >Open Bottom Drawer</BaseButton
            >
            <BaseDrawer v-model="mockEnv.showDrawer">
              <div
                class="h-64 flex flex-col items-center justify-center text-slate-500"
              >
                <Icon
                  name="heroicons:inbox-arrow-down"
                  class="w-12 h-12 mb-4 text-slate-300"
                />
                <p>Drawer Content Here</p>
              </div>
            </BaseDrawer>
          </div>

          <!-- Overlay: Dropdown Menu -->
          <div v-else-if="activeComponentId === 'overlay-dropdownmenu'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseDropdownMenu
            </h2>
            <div class="h-48">
              <BaseDropdownMenu
                :items="[
                  { label: 'Account settings', icon: 'heroicons:user' },
                  { label: 'Support', icon: 'heroicons:lifebuoy' },
                  { label: 'License', icon: 'heroicons:document-text' },
                  {
                    label: 'Sign out',
                    icon: 'heroicons:arrow-right-on-rectangle',
                  },
                ]"
              >
                <template #trigger>
                  <BaseButton trailing-icon="heroicons:chevron-down"
                    >Menu</BaseButton
                  >
                </template>
              </BaseDropdownMenu>
            </div>
          </div>

          <!-- Overlay: Modal -->
          <div v-else-if="activeComponentId === 'overlay-modal'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseModal
            </h2>
            <BaseButton @click="mockEnv.showModal = true"
              >Open Modal</BaseButton
            >
            <BaseModal v-model="mockEnv.showModal" title="Confirm Deletion">
              <p class="text-sm text-slate-500">
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>
              <template #footer>
                <BaseButton variant="outline" @click="mockEnv.showModal = false"
                  >Cancel</BaseButton
                >
                <BaseButton color="red" @click="mockEnv.showModal = false"
                  >Deactivate</BaseButton
                >
              </template>
            </BaseModal>
          </div>

          <!-- Overlay: Popover -->
          <div v-else-if="activeComponentId === 'overlay-popover'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BasePopover
            </h2>
            <div class="flex gap-8 mt-12 pl-12">
              <BasePopover mode="click">
                <template #trigger>
                  <BaseButton variant="outline">Click Me</BaseButton>
                </template>
                <template #panel>
                  <div class="p-4 w-64">
                    <h4 class="font-semibold text-slate-900 text-sm mb-1">
                      Popover Content
                    </h4>
                    <p class="text-xs text-slate-500">
                      This popover stays open until you click outside.
                    </p>
                  </div>
                </template>
              </BasePopover>

              <BasePopover mode="hover">
                <template #trigger>
                  <BaseButton variant="outline">Hover Me</BaseButton>
                </template>
                <template #panel>
                  <div class="p-4 w-64">
                    <h4 class="font-semibold text-slate-900 text-sm mb-1">
                      Hover Popover
                    </h4>
                    <p class="text-xs text-slate-500">
                      This one opens on hover.
                    </p>
                  </div>
                </template>
              </BasePopover>
            </div>
          </div>

          <!-- Overlay: Slideover -->
          <div v-else-if="activeComponentId === 'overlay-slideover'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseSlideover
            </h2>
            <BaseButton @click="mockEnv.showSlideover = true"
              >Open Slideover</BaseButton
            >
            <BaseSlideover
              v-model="mockEnv.showSlideover"
              title="Settings Panel"
            >
              <div class="flex flex-col gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1"
                    >Email notifications</label
                  >
                  <BaseSwitch :modelValue="true" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1"
                    >Theme</label
                  >
                  <BaseSelect :options="['Light', 'Dark', 'System']" />
                </div>
              </div>
            </BaseSlideover>
          </div>

          <!-- Overlay: Toast -->
          <div v-else-if="activeComponentId === 'overlay-toast'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseToast (Static Demo)
            </h2>
            <div class="space-y-4 max-w-sm">
              <MockupToast
                title="Successfully saved!"
                description="Anyone with a link can now view this file."
                icon="heroicons:check-circle"
                color="emerald"
              />
              <MockupToast
                title="Update failed"
                description="There was an error updating your profile."
                icon="heroicons:x-circle"
                color="rose"
              />
            </div>
          </div>

          <!-- Overlay: Tooltip -->
          <div v-else-if="activeComponentId === 'overlay-tooltip'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              BaseTooltip
            </h2>
            <div class="mt-12 flex gap-8">
              <BaseTooltip text="This is a tooltip">
                <BaseButton
                  variant="outline"
                  icon="heroicons:information-circle"
                  >Hover for Info</BaseButton
                >
              </BaseTooltip>

              <BaseTooltip text="Delete item">
                <button
                  class="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Icon name="heroicons:trash" class="w-6 h-6" />
                </button>
              </BaseTooltip>
            </div>
          </div>

          <!-- Layout: App -->
          <div v-else-if="activeComponentId === 'layout-app'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppLayout
            </h2>
            <p class="text-slate-500 text-sm mb-4">
              The root wrapper for the application. Sets up a flex column with
              min-h-screen.
            </p>
            <div
              class="border border-slate-200 rounded-xl overflow-hidden h-64 bg-slate-100 flex items-center justify-center"
            >
              <div class="text-slate-400 text-sm font-mono">
                &lt;AppLayout&gt;...&lt;/AppLayout&gt;
              </div>
            </div>
          </div>

          <!-- Layout: Container -->
          <div v-else-if="activeComponentId === 'layout-container'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppContainer
            </h2>
            <p class="text-slate-500 text-sm mb-4">
              Constrains content width and centers it. Can be toggled to fluid
              width.
            </p>
            <div
              class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4 space-y-4"
            >
              <AppContainer
                class="bg-blue-100 border border-blue-200 p-4 text-center text-blue-700 rounded"
              >
                Standard Container (max-w-7xl)
              </AppContainer>
              <AppContainer
                fluid
                class="bg-green-100 border border-green-200 p-4 text-center text-green-700 rounded"
              >
                Fluid Container (w-full)
              </AppContainer>
            </div>
          </div>

          <!-- Layout: Header -->
          <div v-else-if="activeComponentId === 'layout-header'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppHeader
            </h2>
            <div
              class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
            >
              <AppHeader>
                <template #logo>
                  <AmnimoLogo class="w-24 text-amnimo-600" />
                </template>
                <div class="text-slate-500 text-sm">Center Navigation Slot</div>
                <template #right>
                  <button
                    class="px-3 py-1 bg-slate-800 text-white rounded text-sm"
                  >
                    Action
                  </button>
                </template>
              </AppHeader>
              <div class="h-32"></div>
            </div>
          </div>

          <!-- Layout: Sidebar -->
          <div v-else-if="activeComponentId === 'layout-sidebar'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppSidebar
            </h2>
            <div
              class="border border-slate-200 rounded-xl overflow-hidden bg-white h-96 flex"
            >
              <AppSidebar>
                <template #header>
                  <div class="font-bold text-slate-700">Menu</div>
                </template>
                <ul class="space-y-2 text-sm text-slate-600">
                  <li class="p-2 bg-slate-100 rounded">Item 1</li>
                  <li class="p-2 hover:bg-slate-100 rounded">Item 2</li>
                  <li class="p-2 hover:bg-slate-100 rounded">Item 3</li>
                </ul>
                <template #footer>
                  <div class="text-xs text-slate-400">v1.0.0</div>
                </template>
              </AppSidebar>
              <div class="flex-1 bg-slate-50 p-4">Main Content Area</div>
            </div>
          </div>

          <!-- Layout: Main -->
          <div v-else-if="activeComponentId === 'layout-main'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppMain
            </h2>
            <div
              class="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 h-64 flex flex-col"
            >
              <AppHeader
                ><template #logo
                  ><div class="font-bold">Header</div></template
                ></AppHeader
              >
              <AppMain class="bg-white p-4">
                Main content area (flex-1)
              </AppMain>
              <AppFooter>Footer</AppFooter>
            </div>
          </div>

          <!-- Layout: Footer -->
          <div v-else-if="activeComponentId === 'layout-footer'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppFooter
            </h2>
            <div
              class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 h-64 flex flex-col"
            >
              <div class="flex-1"></div>
              <AppFooter>
                <template #left>
                  <div class="text-xs text-slate-400">
                    &copy; 2026 Amnimo Inc.
                  </div>
                </template>
                <div class="text-xs">Center Links</div>
                <template #right>
                  <div class="flex gap-2">
                    <Icon name="heroicons:globe-alt" class="w-4 h-4" />
                  </div>
                </template>
              </AppFooter>
            </div>
          </div>

          <!-- Layout: Error -->
          <div v-else-if="activeComponentId === 'layout-error'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppError
            </h2>
            <AppError
              :error="{
                statusCode: 404,
                message:
                  'Page not found. The resource you are looking for does not exist.',
              }"
            />
          </div>

          <!-- Layout: Theme -->
          <div v-else-if="activeComponentId === 'layout-theme'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              AppTheme
            </h2>
            <AppTheme />
          </div>

          <!-- UI & Base: Loaders -->
          <div v-else-if="activeComponentId === 'loaders'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Loaders & Spinners
            </h2>

            <div class="mb-8">
              <h3 class="text-lg font-semibold text-slate-700 mb-4">
                AppSpinner
              </h3>
              <p class="text-slate-500 text-sm mb-4">
                A simple rotating spinner for inline loading states.
              </p>
              <div
                class="p-8 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center gap-8"
              >
                <AppSpinner class="w-6 h-6 text-amnimo-600" />
                <AppSpinner class="w-8 h-8 text-blue-500" />
                <AppSpinner class="w-12 h-12 text-slate-400" />
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-slate-700 mb-4">
                AppLoader
              </h3>
              <p class="text-slate-500 text-sm mb-4">
                A full-container loader with a branded logo animation and text.
              </p>
              <div
                class="border border-slate-200 rounded-xl overflow-hidden relative h-80 bg-slate-50"
              >
                <AppLoader text="System is preparing..." />
              </div>
            </div>
          </div>

          <!-- UI & Base: Logo -->
          <div v-else-if="activeComponentId === 'logo'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Amnimo Logo
            </h2>

            <div class="mb-8">
              <h3 class="text-lg font-semibold text-slate-700 mb-4">
                Standard Logo
              </h3>
              <div
                class="p-8 border border-slate-200 rounded-xl bg-white flex items-center justify-center"
              >
                <AmnimoLogo class="w-48 text-amnimo-600" />
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-lg font-semibold text-slate-700 mb-4">
                Dark Background
              </h3>
              <div
                class="p-8 border border-slate-200 rounded-xl bg-slate-900 flex items-center justify-center"
              >
                <AmnimoLogo class="w-48 text-white" />
              </div>
            </div>
          </div>

          <!-- UI & Base: Base Toast -->
          <div v-else-if="activeComponentId === 'toast'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Base Toast
            </h2>
            <p class="text-slate-500 text-sm mb-4">
              Toast notifications are managed globally by
              <code>useToast()</code>. Here are static examples of the toast
              component UI.
            </p>

            <div class="space-y-4">
              <div class="relative">
                <MockupToast
                  title="Success"
                  description="Test execution completed successfully."
                  icon="heroicons:check-circle-solid"
                  color="emerald"
                />
              </div>
              <div class="relative">
                <MockupToast
                  title="Error"
                  description="Failed to connect to the peripheral device."
                  icon="heroicons:x-circle-solid"
                  color="rose"
                />
              </div>
              <div class="relative">
                <MockupToast
                  title="Warning"
                  description="The selected folder is empty."
                  icon="heroicons:exclamation-triangle-solid"
                  color="amber"
                />
              </div>
              <div class="relative">
                <MockupToast
                  title="Information"
                  description="An update is available for Amnimo Test Runner."
                  icon="heroicons:information-circle-solid"
                  color="sky"
                />
              </div>
            </div>
          </div>

          <!-- Forms: Env Editor -->
          <div v-else-if="activeComponentId === 'env-editor'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Env Editor
            </h2>
            <p class="text-slate-500 text-sm mb-4">
              A JSON editor used for modifying environment variables and
              configurations.
            </p>

            <div
              class="h-96 border border-slate-200 rounded-xl overflow-hidden bg-white"
            >
              <EnvEditor v-model="mockEnv" :filename="'config.json'" />
            </div>
          </div>

          <!-- Modals -->
          <div v-else-if="activeComponentId === 'modals'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Confirm & Notifiers
            </h2>

            <div class="flex gap-4">
              <button
                @click="showConfirmModal = true"
                class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Open Confirm Modal
              </button>
              <button
                @click="showUpdateNotifier = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Open Update Notifier
              </button>
            </div>

            <ConfirmModal
              :isOpen="showConfirmModal"
              title="Delete Test Case"
              message="Are you sure you want to delete this test case? This action cannot be undone."
              confirmText="Delete"
              type="danger"
              :isLoading="false"
              @close="showConfirmModal = false"
              @confirm="showConfirmModal = false"
            />

            <UpdateNotifier
              :isOpen="showUpdateNotifier"
              version="1.2.0"
              releaseNotes="* Added new Design System page&#10;* Fixed drag and drop bugs&#10;* UI improvements"
              @close="showUpdateNotifier = false"
              @update="showUpdateNotifier = false"
            />
          </div>

          <!-- Modals: Folder Picker -->
          <div v-else-if="activeComponentId === 'folder-picker'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Folder Picker Dialog
            </h2>

            <button
              @click="showFolderPicker = true"
              class="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              Open Folder Picker
            </button>

            <FolderPickerDialog
              :isOpen="showFolderPicker"
              @close="showFolderPicker = false"
              @select="showFolderPicker = false"
            />
          </div>

          <!-- Icons -->
          <div v-else-if="activeComponentId === 'icons'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              System Icons
            </h2>

            <div class="grid grid-cols-4 gap-6">
              <div
                class="flex flex-col items-center p-6 border border-slate-200 rounded-xl bg-slate-50"
              >
                <SimIcon class="w-12 h-12 text-slate-700 mb-2" />
                <span class="text-sm font-medium text-slate-600">SimIcon</span>
              </div>

              <div
                class="flex flex-col items-center p-6 border border-slate-200 rounded-xl bg-slate-50"
              >
                <IconSdCard class="w-12 h-12 text-slate-700 mb-2" />
                <span class="text-sm font-medium text-slate-600"
                  >IconSdCard</span
                >
              </div>

              <div
                class="flex flex-col items-center p-6 border border-slate-200 rounded-xl bg-slate-50"
              >
                <IconUsb class="w-12 h-12 text-slate-700 mb-2" />
                <span class="text-sm font-medium text-slate-600">IconUsb</span>
              </div>

              <div
                class="flex flex-col items-center p-6 border border-slate-200 rounded-xl bg-slate-50"
              >
                <IconInternalStorage class="w-12 h-12 text-slate-700 mb-2" />
                <span class="text-sm font-medium text-slate-600"
                  >IconInternalStorage</span
                >
              </div>
            </div>
          </div>

          <!-- Peripherals -->
          <div v-else-if="activeComponentId === 'peripheral-checks'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Peripheral Checks
            </h2>
            <p class="text-slate-500 text-sm mb-6">
              Components used to check system requirements and device
              connections before testing.
            </p>

            <div
              class="space-y-4 max-w-xl p-6 border border-slate-200 rounded-xl bg-slate-50"
            >
              <PeripheralDhcpCheck :isChecking="false" status="ready" />
              <PeripheralNxWitnessCheck :isChecking="false" status="ready" />
              <PeripheralPoeCheck :isChecking="false" status="ready" />
              <PeripheralSimCheck :isChecking="false" status="ready" />
              <PeripheralStorageCheck :isChecking="false" status="ready" />
            </div>
          </div>

          <!-- Runner: File Tree -->
          <div v-else-if="activeComponentId === 'file-tree'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              File Tree
            </h2>
            <p class="text-slate-500 text-sm mb-6">
              Tree view component used to navigate test files and directories.
            </p>

            <div
              class="w-80 h-[500px] border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm"
            >
              <FileTree
                :nodes="mockFileTree"
                :selectedTests="mockSelectedTests"
                @toggle-test="() => {}"
              />
            </div>
          </div>

          <!-- Runner: Test Progress -->
          <div v-else-if="activeComponentId === 'test-progress'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Test Progress (Queue)
            </h2>
            <p class="text-slate-500 text-sm mb-6">
              Draggable test queue component displaying test progress and
              results.
            </p>

            <div
              class="w-96 h-[600px] border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm relative"
            >
              <TestProgress
                :specs="mockSpecs"
                :isTesting="true"
                :allowDrag="true"
                @remove-file="() => {}"
                @remove-case="() => {}"
                @reorder="() => {}"
              />
            </div>
          </div>

          <!-- Runner: Firmware -->
          <div v-else-if="activeComponentId === 'firmware'">
            <h2
              class="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6"
            >
              Firmware Preparation
            </h2>
            <p class="text-slate-500 text-sm mb-6">
              Interface for preparing and uploading firmware to devices.
            </p>

            <div
              class="max-w-2xl border border-slate-200 rounded-xl overflow-hidden shadow-sm relative h-96"
            >
              <FirmwarePreparation :sessionId="'mock-session'" />
            </div>
          </div>
        </div>
        <!-- Right Sidebar TOC -->
        <aside class="hidden 2xl:block w-48 absolute top-0 -right-56 h-full">
          <div class="sticky top-8">
            <h4 class="font-semibold text-slate-800 mb-4">On this page</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li v-for="link in currentToc" :key="link.id">
                <a
                  :href="'#' + link.id"
                  class="transition-colors block"
                  :class="[
                    link.level === 3 ? 'ml-4' : '',
                    activeSectionId === link.id
                      ? 'text-amnimo-600 font-medium'
                      : 'hover:text-amnimo-600 text-slate-600',
                  ]"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>




