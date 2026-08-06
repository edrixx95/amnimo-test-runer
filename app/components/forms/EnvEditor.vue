<script setup lang="ts">
/* eslint-disable */
import { toRef } from "vue";
import {
  useEnvEditor,
  block1Row1Keys,
  block1Row2Keys,
  block2Keys,
  block3Keys,
} from "~/composables/env/useEnvEditor";

const props = defineProps<{
  modelValue: string;
  isPlayground?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modelValueRef = toRef(props, "modelValue");

const {
  parsedEnv,
  envComments,
  focusedField,
  isScanningIIS,
  iisSites,
  showIISDropdown,
  iisTargetKey,
  scanIIS,
  selectIISSite,
  toggleDropdown,
  handleBlur,
  selectOption,
  getOptions,
  emitChange,
} = useEnvEditor(modelValueRef, emit as any);
</script>

<template>
  <div class="space-y-6">
    <!-- Block 1 -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-soft hover:border-amnimo-300"
    >
      <h4
        class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"
        >
          <Icon name="heroicons:cpu-chip" class="w-5 h-5 text-indigo-500" />
        </div>
        {{ $t("envEditor.deviceFirmwareConfig") }}
      </h4>
      <div class="space-y-5">
        <!-- Row 1: Readonly -->
        <div
          id="tour-env-block1-row1"
          class="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <div
            v-for="key in block1Row1Keys"
            :key="key"
            :id="`tour-env-${key}`"
            class="relative"
          >
            <label
              class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
            >
              {{ key }}
              <div
                v-if="envComments[key]"
                class="relative group ml-1.5 flex items-center"
              >
                <Icon
                  name="heroicons:information-circle"
                  class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
                />
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
                >
                  <div
                    class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                  >
                    {{ envComments[key] }}
                  </div>
                  <div
                    class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                  />
                </div>
              </div>
            </label>
            <template v-if="!isPlayground">
              <input
                v-model="parsedEnv[key]"
                type="text"
                readonly
                class="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
              />
            </template>
            <template v-else>
              <div class="relative">
                <input
                  v-model="parsedEnv[key]"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
                  @click="toggleDropdown(key)"
                  @blur="handleBlur"
                  @input="emitChange"
                />
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                >
                  <Icon
                    name="heroicons:chevron-up-down"
                    class="w-5 h-5 transition-colors duration-200"
                    :class="
                      focusedField === key
                        ? 'text-amnimo-500'
                        : 'text-slate-400'
                    "
                  />
                </div>
              </div>
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-show="focusedField === key && getOptions(key).length > 0"
                  :id="`dropdown-${key}`"
                  class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                >
                  <ul class="py-1">
                    <li
                      v-for="opt in getOptions(key)"
                      :key="opt"
                      :class="[
                        'px-4 py-2 text-sm cursor-pointer transition-colors break-all',
                        parsedEnv[key] === opt
                          ? 'bg-amnimo-50 text-amnimo-600 font-bold'
                          : 'text-slate-700 hover:bg-amnimo-50 hover:text-amnimo-600',
                      ]"
                      @mousedown.prevent="selectOption(key, opt)"
                    >
                      {{ opt || $t("envEditor.empty") }}
                    </li>
                  </ul>
                </div>
              </Transition>
            </template>
          </div>
        </div>

        <!-- Row 2: Firmwares -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="key in block1Row2Keys"
            :key="key"
            :id="`tour-env-${key}`"
            class="relative"
          >
            <label
              class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
            >
              {{ key }}
              <div
                v-if="envComments[key]"
                class="relative group ml-1.5 flex items-center"
              >
                <Icon
                  name="heroicons:information-circle"
                  class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
                />
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
                >
                  <div
                    class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                  >
                    {{ envComments[key] }}
                  </div>
                  <div
                    class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                  />
                </div>
              </div>
            </label>
            <div class="relative">
              <input
                type="text"
                :value="parsedEnv[key]"
                readonly
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 cursor-pointer focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
                @click="toggleDropdown(key)"
                @blur="handleBlur"
              />
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <Icon
                  name="heroicons:chevron-up-down"
                  class="w-5 h-5 transition-colors duration-200"
                  :class="
                    focusedField === key ? 'text-amnimo-500' : 'text-slate-400'
                  "
                />
              </div>
            </div>

            <!-- Custom Dropdown -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="focusedField === key && getOptions(key).length > 0"
                :id="`dropdown-${key}`"
                class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <ul class="py-1">
                  <li
                    v-for="opt in getOptions(key)"
                    :key="opt"
                    :class="[
                      'px-4 py-2 text-sm cursor-pointer transition-colors break-all',
                      parsedEnv[key] === opt
                        ? 'bg-amnimo-50 text-amnimo-600 font-bold'
                        : 'text-slate-700 hover:bg-amnimo-50 hover:text-amnimo-600',
                    ]"
                    @mousedown.prevent="selectOption(key, opt)"
                  >
                    {{ opt }}
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Block 2 -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-amnimo-300"
    >
      <h4
        class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"
        >
          <Icon name="heroicons:globe-alt" class="w-5 h-5 text-emerald-500" />
        </div>
        {{ $t("envEditor.environmentNetworkConfig") }}
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="key in block2Keys"
          :key="key"
          :id="`tour-env-${key}`"
          class="relative"
        >
          <label
            class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
          >
            {{ key }}
            <div
              v-if="envComments[key]"
              class="relative group ml-1.5 flex items-center"
            >
              <Icon
                name="heroicons:information-circle"
                class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
              >
                <div
                  class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                >
                  {{ envComments[key] }}
                </div>
                <div
                  class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                />
              </div>
            </div>
          </label>
          <div class="relative">
            <input
              v-model="parsedEnv[key]"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
              :class="{
                'pr-12': key === 'PC_SERVER_PORT' || key === 'PC_SERVER_URL',
              }"
              @input="emitChange"
            />

            <button
              v-if="key === 'PC_SERVER_URL'"
              id="tour-env-iis-btn"
              :disabled="isScanningIIS"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              :title="$t('envEditor.scanIisSites')"
              @click="scanIIS(key)"
            >
              <Icon
                :name="
                  isScanningIIS ? 'heroicons:arrow-path' : 'heroicons:server'
                "
                class="w-5 h-5"
                :class="{ 'animate-spin': isScanningIIS }"
              />
            </button>

            <!-- IIS Dropdown -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="showIISDropdown && iisTargetKey === key"
                class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                <ul class="py-1">
                  <li
                    v-if="iisSites.length === 0"
                    class="px-4 py-3 text-sm text-slate-500 text-center"
                  >
                    {{ $t("envEditor.noActiveIisSites") }}
                  </li>
                  <li
                    v-for="site in iisSites"
                    :key="site.name"
                    class="px-4 py-2 text-sm cursor-pointer transition-colors border-b last:border-b-0 border-slate-100 hover:bg-indigo-50 group flex items-center justify-between"
                    @click="selectIISSite(site)"
                  >
                    <div>
                      <span
                        class="block font-bold text-slate-700 group-hover:text-indigo-600"
                        >{{ site.name }}</span
                      >
                      <span class="block text-xs text-slate-500 mt-0.5"
                        >{{ $t("envEditor.port") }}:
                        {{ site.port || "N/A" }}</span
                      >
                    </div>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      :class="
                        site.state === 'Started'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      "
                    >
                      {{ site.state }}
                    </span>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Block 3 -->
    <div
      class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-amnimo-300"
    >
      <h4
        class="text-base font-bold text-slate-800 mb-5 flex items-center gap-2"
      >
        <div
          class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"
        >
          <Icon name="heroicons:cog-8-tooth" class="w-5 h-5 text-amber-500" />
        </div>
        {{ $t("envEditor.systemConstants") }}
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="key in block3Keys"
          :key="key"
          :id="`tour-env-${key}`"
          class="relative"
        >
          <label
            class="flex items-center text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide"
          >
            {{ key }}
            <div
              v-if="envComments[key]"
              class="relative group ml-1.5 flex items-center"
            >
              <Icon
                name="heroicons:information-circle"
                class="w-4 h-4 text-amnimo-400 hover:text-amnimo-600 cursor-help transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-[100]"
              >
                <div
                  class="bg-slate-800 text-white text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg shadow-xl whitespace-pre-wrap"
                >
                  {{ envComments[key] }}
                </div>
                <div
                  class="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"
                />
              </div>
            </div>
          </label>
          <div class="relative">
            <input
              v-model="parsedEnv[key]"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amnimo-500/20 focus:border-amnimo-500 transition-all placeholder-slate-400 outline-none"
              @click="toggleDropdown(key)"
              @blur="handleBlur"
              @input="emitChange"
            />
            <div
              v-if="getOptions(key).length > 0"
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-up-down"
                class="w-5 h-5 transition-colors duration-200"
                :class="
                  focusedField === key ? 'text-amnimo-500' : 'text-slate-400'
                "
              />
            </div>
          </div>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-show="focusedField === key && getOptions(key).length > 0"
              :id="`dropdown-${key}`"
              class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            >
              <ul class="py-1">
                <li
                  v-for="opt in getOptions(key)"
                  :key="opt"
                  :class="[
                    'px-4 py-2 text-sm cursor-pointer transition-colors break-all',
                    parsedEnv[key] === opt
                      ? 'bg-amnimo-50 text-amnimo-600 font-bold'
                      : 'text-slate-700 hover:bg-amnimo-50 hover:text-amnimo-600',
                  ]"
                  @mousedown.prevent="selectOption(key, opt)"
                >
                  {{ opt || $t("envEditor.empty") }}
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
