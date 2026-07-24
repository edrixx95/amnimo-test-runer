const fs = require('fs');

// 1. EnvEditor.vue
let f1 = 'app/components/forms/EnvEditor.vue';
if (!fs.existsSync(f1)) f1 = 'app/components/EnvEditor.vue';
if (fs.existsSync(f1)) {
  let c1 = fs.readFileSync(f1, 'utf-8');
  c1 = c1.replace(/const emit = defineEmits<unknown>\(\);/, 'const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();');
  fs.writeFileSync(f1, c1);
}

// 2. PeripheralPoeCheck.vue
const f2 = 'app/components/peripherals/PeripheralPoeCheck.vue';
if (fs.existsSync(f2)) {
  let c2 = fs.readFileSync(f2, 'utf-8');
  c2 = c2.replace(/\(poeInfo as Record<string, unknown>\)/g, '(poeInfo as any)');
  fs.writeFileSync(f2, c2);
}

// 3. useSessionRunner.ts
const f3 = 'app/composables/sessions/useSessionRunner.ts';
if (fs.existsSync(f3)) {
  let c3 = fs.readFileSync(f3, 'utf-8');
  c3 = c3.replace(/\(parseData as Record<string, unknown>\)\./g, '(parseData as any).');
  fs.writeFileSync(f3, c3);
}

// 4. default.vue
const f4 = 'app/layouts/default.vue';
if (fs.existsSync(f4)) {
  let c4 = fs.readFileSync(f4, 'utf-8');
  c4 = c4.replace(/const activeDownload = ref<unknown>\(null\);/, 'const activeDownload = ref<any>(null);');
  c4 = c4.replace(/\(activeDownload as Record<string, unknown>\)/g, '(activeDownload as any)');
  fs.writeFileSync(f4, c4);
}

// 5. setup.vue
const f5 = 'app/pages/sessions/[id]/setup.vue';
if (fs.existsSync(f5)) {
  let c5 = fs.readFileSync(f5, 'utf-8');
  c5 = c5.replace(/p as Record<string, string>/g, 'p as any');
  c5 = c5.replace(/p: unknown/g, 'p: any');
  fs.writeFileSync(f5, c5);
}
