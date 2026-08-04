<script setup lang="ts">
import { computed, useSlots, useAttrs } from "vue";
import { NuxtLink } from "#components";
import AppSpinner from "../ui/AppSpinner.vue";
import { cn } from "../../utils/tailwind";
import type { ClassValue } from "clsx";

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    variant?: "solid" | "outline" | "ghost" | "soft" | "subtle" | "link";
    color?:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "error"
      | "neutral"
      | "white"
      | "gray";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    label?: string;
    icon?: string;
    leadingIcon?: string;
    trailingIcon?: string;
    avatar?: { src: string; alt?: string; [key: string]: unknown };
    loading?: boolean;
    loadingIcon?: string;
    loadingAuto?: boolean;
    trailing?: boolean;
    disabled?: boolean;
    block?: boolean;
    padded?: boolean;
    square?: boolean;
    truncate?: boolean;
    to?: string | object;
    href?: string;
    target?: string;
    active?: boolean;
    activeClass?: string;
    inactiveClass?: string;
    activeColor?:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "error"
      | "neutral"
      | "white"
      | "gray";
    activeVariant?: "solid" | "outline" | "ghost" | "soft" | "subtle" | "link";
    ui?: {
      base?: string;
      font?: string;
      rounded?: string;
      size?: string;
      gap?: string;
      padding?: string;
      square?: string;
      color?: string;
      variant?: string;
      icon?: { base?: string; size?: string };
      leadingIcon?: string;
      trailingIcon?: string;
    };
    onClick?:
      | ((e: MouseEvent) => void | Promise<void>)
      | Array<(e: MouseEvent) => void | Promise<void>>;
  }>(),
  {
    type: "button",
    variant: "solid",
    color: "primary",
    size: "md",
    label: undefined,
    icon: undefined,
    leadingIcon: undefined,
    trailingIcon: undefined,
    avatar: undefined,
    loading: false,
    loadingIcon: "",
    loadingAuto: false,
    trailing: false,
    disabled: false,
    block: false,
    padded: true,
    square: false,
    truncate: false,
    to: undefined,
    href: undefined,
    target: undefined,
    active: undefined,
    activeClass: undefined,
    inactiveClass: undefined,
    activeColor: undefined,
    activeVariant: undefined,
    ui: undefined,
    onClick: undefined,
  },
);

const isLink = computed(() => !!props.to || !!props.href);
const tag = computed(() =>
  isLink.value ? (props.to ? NuxtLink : "a") : "button",
);

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const sizeMap = {
  xs: {
    padding: "px-2.5 py-1.5",
    size: "text-xs",
    gap: "gap-1.5",
    square: "p-1.5",
    icon: "w-4 h-4",
  },
  sm: {
    padding: "px-3 py-1.5",
    size: "text-sm",
    gap: "gap-1.5",
    square: "p-1.5",
    icon: "w-4 h-4",
  },
  md: {
    padding: "px-4 py-2",
    size: "text-sm",
    gap: "gap-2",
    square: "p-2",
    icon: "w-5 h-5",
  },
  lg: {
    padding: "px-5 py-2.5",
    size: "text-base",
    gap: "gap-2",
    square: "p-2.5",
    icon: "w-5 h-5",
  },
  xl: {
    padding: "px-6 py-3",
    size: "text-lg",
    gap: "gap-2.5",
    square: "p-3",
    icon: "w-6 h-6",
  },
};

const colorVariantMap: Record<string, Record<string, string>> = {
  primary: {
    solid:
      "bg-amnimo-600 text-white hover:bg-amnimo-700 shadow-sm focus-visible:outline-amnimo-600",
    outline:
      "ring-1 ring-inset ring-amnimo-600 text-amnimo-600 hover:bg-amnimo-50",
    soft: "bg-amnimo-50 text-amnimo-700 hover:bg-amnimo-100",
    subtle:
      "bg-amnimo-50 text-amnimo-600 ring-1 ring-inset ring-amnimo-500/25 hover:bg-amnimo-100",
    ghost: "text-amnimo-600 hover:bg-amnimo-50",
    link: "text-amnimo-600 hover:text-amnimo-700 hover:underline",
  },
  secondary: {
    solid:
      "bg-[#f4f6f8] text-amnimo-600 hover:bg-[#e2e8f0] shadow-sm focus-visible:outline-[#f4f6f8]",
    outline:
      "ring-1 ring-inset ring-[#e2e8f0] text-amnimo-600 hover:bg-[#f4f6f8]",
    soft: "bg-[#f4f6f8] text-amnimo-600 hover:bg-[#e2e8f0]",
    subtle:
      "bg-[#f4f6f8] text-amnimo-600 ring-1 ring-inset ring-[#e2e8f0]/50 hover:bg-[#e2e8f0]",
    ghost: "text-amnimo-600 hover:bg-[#f4f6f8]",
    link: "text-amnimo-600 hover:text-amnimo-700 hover:underline",
  },
  success: {
    solid:
      "bg-green-600 text-white hover:bg-green-700 shadow-sm focus-visible:outline-green-600",
    outline:
      "ring-1 ring-inset ring-green-600 text-green-600 hover:bg-green-50",
    soft: "bg-green-50 text-green-700 hover:bg-green-100",
    subtle:
      "bg-green-50 text-green-600 ring-1 ring-inset ring-green-500/25 hover:bg-green-100",
    ghost: "text-green-600 hover:bg-green-50",
    link: "text-green-600 hover:text-green-700 hover:underline",
  },
  info: {
    solid:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus-visible:outline-blue-600",
    outline: "ring-1 ring-inset ring-blue-600 text-blue-600 hover:bg-blue-50",
    soft: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    subtle:
      "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-500/25 hover:bg-blue-100",
    ghost: "text-blue-600 hover:bg-blue-50",
    link: "text-blue-600 hover:text-blue-700 hover:underline",
  },
  warning: {
    solid:
      "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm focus-visible:outline-yellow-500",
    outline:
      "ring-1 ring-inset ring-yellow-500 text-yellow-600 hover:bg-yellow-50",
    soft: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    subtle:
      "bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-500/25 hover:bg-yellow-100",
    ghost: "text-yellow-600 hover:bg-yellow-50",
    link: "text-yellow-600 hover:text-yellow-700 hover:underline",
  },
  error: {
    solid:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:outline-red-600",
    outline: "ring-1 ring-inset ring-red-600 text-red-600 hover:bg-red-50",
    soft: "bg-red-50 text-red-700 hover:bg-red-100",
    subtle:
      "bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/25 hover:bg-red-100",
    ghost: "text-red-600 hover:bg-red-50",
    link: "text-red-600 hover:text-red-700 hover:underline",
  },
  neutral: {
    solid:
      "bg-slate-800 text-white hover:bg-slate-900 shadow-sm focus-visible:outline-slate-800",
    outline:
      "ring-1 ring-inset ring-slate-300 text-slate-700 hover:bg-slate-50",
    soft: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    subtle:
      "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-300/50 hover:bg-slate-100",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    link: "text-slate-600 hover:text-slate-900 hover:underline",
  },
  white: {
    solid:
      "bg-white text-slate-900 hover:bg-slate-50 ring-1 ring-inset ring-slate-300 shadow-sm",
    outline:
      "ring-1 ring-inset ring-slate-300 text-slate-900 hover:bg-slate-50",
    soft: "bg-slate-50 text-slate-900 hover:bg-slate-100",
    subtle:
      "bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-300/50 hover:bg-slate-100",
    ghost: "text-slate-900 hover:bg-slate-50",
    link: "text-slate-900 hover:text-slate-600 hover:underline",
  },
  gray: {
    solid:
      "bg-slate-800 text-white hover:bg-slate-900 shadow-sm focus-visible:outline-slate-800",
    outline:
      "ring-1 ring-inset ring-slate-300 text-slate-700 hover:bg-slate-50",
    soft: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    subtle:
      "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-300/50 hover:bg-slate-100",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    link: "text-slate-600 hover:text-slate-900 hover:underline",
  },
};

const computedClasses = computed(() => {
  const c = sizeMap[props.size];

  const currentColor =
    props.active && props.activeColor ? props.activeColor : props.color;
  const currentVariant =
    props.active && props.activeVariant ? props.activeVariant : props.variant;

  const colorMap =
    currentColor && colorVariantMap[currentColor]
      ? colorVariantMap[currentColor]
      : colorVariantMap["primary"]!;
  const cv =
    currentVariant && colorMap![currentVariant]
      ? colorMap![currentVariant]
      : colorMap!["solid"];

  const slots = useSlots();
  const hasLabel = computed(() => !!props.label || !!slots.default);
  const isSquare = props.square || !hasLabel.value;

  return cn(
    props.ui?.base ||
      "inline-flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
    props.ui?.font || "font-medium",
    props.ui?.rounded || "rounded-md",
    props.ui?.size || c.size,
    props.ui?.gap || c.gap,
    props.padded && !isSquare ? props.ui?.padding || c.padding : "",
    isSquare ? props.ui?.square || c.square : "",
    props.ui?.color || cv,
    props.block ? "w-full flex" : "",
    props.active ? props.activeClass : props.inactiveClass,
    attrs.class as ClassValue,
  );
});

const isAutoLoading = ref(false);
const isLoading = computed(() => props.loading || isAutoLoading.value);

const actualLeadingIcon = computed(() => props.icon || props.leadingIcon);
const showLeadingIcon = computed(
  () =>
    (actualLeadingIcon.value || (isLoading.value && !props.trailing)) &&
    !props.avatar,
);
const showTrailingIcon = computed(
  () => props.trailingIcon || (isLoading.value && props.trailing),
);
const iconClasses = computed(() => [
  props.ui?.icon?.base || "shrink-0",
  props.ui?.icon?.size || sizeMap[props.size].icon,
]);

const linkProps = computed(() => {
  if (!isLink.value) return {};
  if (props.to) {
    return { to: props.to, target: props.target };
  }
  return { href: props.href, target: props.target };
});

const buttonProps = computed(() => {
  if (isLink.value) return {};
  return { type: props.type, disabled: props.disabled };
});

const handleClick = async (e: MouseEvent) => {
  if (props.disabled || isLoading.value) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (props.onClick) {
    let result;
    if (Array.isArray(props.onClick)) {
      result = Promise.all(props.onClick.map((fn) => fn(e)));
    } else {
      result = props.onClick(e);
    }

    if (props.loadingAuto && result instanceof Promise) {
      isAutoLoading.value = true;
      try {
        await result;
      } finally {
        isAutoLoading.value = false;
      }
    }
  }
};
</script>

<template>
  <component
    :is="tag"
    v-bind="{ ...$attrs, ...linkProps, ...buttonProps, class: undefined }"
    :class="computedClasses"
    @click="handleClick"
  >
    <!-- Avatar -->
    <BaseAvatar
      v-if="avatar"
      v-bind="avatar"
      :size="size === 'xs' || size === 'sm' ? 'xs' : 'sm'"
      class="-ml-1"
    />

    <!-- Leading Icon or Loading Spinner -->
    <template v-if="showLeadingIcon">
      <Icon
        v-if="isLoading && !trailing && loadingIcon"
        :name="loadingIcon"
        :class="[iconClasses, 'animate-spin', ui?.leadingIcon]"
        aria-hidden="true"
      />
      <AppSpinner
        v-else-if="isLoading && !trailing"
        :class="[iconClasses, ui?.leadingIcon]"
        aria-hidden="true"
      />
      <Icon
        v-else
        :name="actualLeadingIcon!"
        :class="[iconClasses, ui?.leadingIcon]"
        aria-hidden="true"
      />
    </template>

    <span v-if="label || $slots.default" :class="[truncate ? 'truncate' : '']">
      <slot>{{ label }}</slot>
    </span>

    <!-- Trailing Icon -->
    <template v-if="showTrailingIcon">
      <Icon
        v-if="isLoading && trailing && loadingIcon"
        :name="loadingIcon"
        :class="[iconClasses, 'animate-spin', ui?.trailingIcon]"
        aria-hidden="true"
      />
      <AppSpinner
        v-else-if="isLoading && trailing"
        :class="[iconClasses, ui?.trailingIcon]"
        aria-hidden="true"
      />
      <Icon
        v-else
        :name="trailingIcon!"
        :class="[iconClasses, ui?.trailingIcon]"
        aria-hidden="true"
      />
    </template>
  </component>
</template>
