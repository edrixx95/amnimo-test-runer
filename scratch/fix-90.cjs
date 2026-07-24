const fs = require('fs');

function f(file, r, repl) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let n = c.replace(r, repl);
  if (c !== n) {
    fs.writeFileSync(file, n);
    console.log('Fixed ' + file);
  }
}

// default.vue
f('app/layouts/default.vue', /activeDownload\.value = data;/g, 'activeDownload.value = data as any;');
f('app/layouts/default.vue', /\(data as unknown\)\.state/g, '(data as any).state');
f('app/layouts/default.vue', /activeDownload\.value as Record<string, unknown>/g, 'activeDownload.value as any');
f('app/layouts/default.vue', /\(data: unknown\)/g, '(data: any)');
f('app/layouts/default.vue', /window as unknown as \{ electronAPI: Record<string, Function> \}/g, 'window as Window & typeof globalThis & { electronAPI?: Record<string, any> }');

// useSessionRunner.ts
f('app/composables/sessions/useSessionRunner.ts', /s as Record<string, unknown>/g, 's as any');

// runner.vue
f('app/pages/sessions/[id]/runner.vue', /window as unknown/g, 'window as any');
f('app/pages/sessions/[id]/runner.vue', /s\.specs/g, '(s as any).specs');
f('app/pages/sessions/[id]/runner.vue', /s\.suites/g, '(s as any).suites');
f('app/pages/sessions/[id]/runner.vue', /as unknown;/g, 'as "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED";');

// setup.vue
f('app/pages/sessions/[id]/setup.vue', /\(p as unknown as Record<string, string> as Record<string, string>\)\.id/g, '(p as any).id');


// settings/index.vue
f('app/pages/settings/index.vue', /window as unknown as \{ electronAPI: Record<string, Function> \}/g, 'window as Window & typeof globalThis & { electronAPI?: Record<string, any> }');
f('app/pages/settings/index.vue', /info: unknown/g, 'info: any');
f('app/pages/settings/index.vue', /info\./g, '(info as any).');
f('app/pages/settings/index.vue', /e\.data/g, '(e as any).data');
f('app/pages/settings/index.vue', /e\.message/g, '(e as any).message');
f('app/pages/settings/index.vue', /String\(e\)/g, 'String(e as any)');

// PeripheralDhcpCheck.vue
f('app/components/peripherals/PeripheralDhcpCheck.vue', /configData as unknown/g, 'configData as any');

// PeripheralPoeCheck.vue
f('app/components/peripherals/PeripheralPoeCheck.vue', /\(err as ApiError\)\.data/g, '((err as ApiError).data as any)');
f('app/components/peripherals/PeripheralPoeCheck.vue', /poeInfo as Record<string, unknown>/g, 'poeInfo as any');

// PeripheralSimCheck.vue
f('app/components/peripherals/PeripheralSimCheck.vue', /\(err as ApiError\)\.data/g, '((err as ApiError).data as any)');

// PeripheralStorageCheck.vue
f('app/components/peripherals/PeripheralStorageCheck.vue', /item\.storage as ApiError/g, 'item.storage as any');

// EnvEditor.vue
f('app/components/forms/EnvEditor.vue', /emit as unknown/g, 'emit as any');

// UpdateNotifier.vue
f('app/components/modals/UpdateNotifier.vue', /updateStatus: unknown/g, 'updateStatus: any');
f('app/components/modals/UpdateNotifier.vue', /updateStatus as unknown/g, 'updateStatus as any');
f('app/components/modals/UpdateNotifier.vue', /window\.electronAPI/g, '(window as any).electronAPI');

// netstat.get.ts
f('server/api/local/netstat.get.ts', /error as ApiError/g, 'error as any');

// dhcp-partner.post.ts
f('server/api/proxy/device/dhcp-partner.post.ts', /of interfaces/g, 'of (interfaces as any[])');

// mobile.post.ts
f('server/api/proxy/device/mobile.post.ts', /\(e as ApiError\)\.response\?._data as unknown/g, '(e as ApiError).response?._data as any');

// poe.post.ts
f('server/api/proxy/device/poe.post.ts', /err\.status/g, '(err as any).status');
f('server/api/proxy/device/poe.post.ts', /err\.message/g, '(err as any).message');

// startup-check.post.ts
f('server/api/proxy/device/startup-check.post.ts', /m: unknown/g, 'm: any');
f('server/api/proxy/device/startup-check.post.ts', /m\.code/g, '(m as any).code');

// sessions/index.get.ts
f('server/api/sessions/index.get.ts', /aggregated\._meta as unknown/g, 'aggregated._meta as any');

// files.get.ts
f('server/api/tests/files.get.ts', /error\.message/g, '(error as any).message');

// parse.post.ts
f('server/api/tests/parse.post.ts', /err\.message/g, '(err as any).message');

// useLiveProgress.ts
f('app/composables/sessions/useLiveProgress.ts', /as unknown;/g, 'as any;');
f('app/composables/sessions/useLiveProgress.ts', /data\.status/g, '(data as any).status');
f('app/composables/sessions/useLiveProgress.ts', /window as unknown/g, 'window as any');
