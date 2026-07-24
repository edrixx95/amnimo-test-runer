const fs = require('fs');

function f(file, r, repl) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let n = c.replace(r, repl);
  if (c !== n) {
    fs.writeFileSync(file, n);
  }
}

// 1. useLiveProgress.ts
f('app/composables/sessions/useLiveProgress.ts', /status: msg\.status/g, 'status: msg.status as any'); // We can't use any. Let's use as InnerTest["status"]
f('app/composables/sessions/useLiveProgress.ts', /status: msg\.status as any/g, 'status: msg.status as "PASSED" | "FAILED" | "waiting" | "running" | "SKIPPED"');
f('app/composables/sessions/useLiveProgress.ts', /status: msg\.status,/g, 'status: msg.status as "PASSED" | "FAILED" | "waiting" | "running" | "SKIPPED",');
f('app/composables/sessions/useLiveProgress.ts', /p\.status/g, '(p as Record<string, unknown>).status');
f('app/composables/sessions/useLiveProgress.ts', /\(err as unknown\)\.message/g, '(err as Error).message');

// 2. useSessionRunner.ts
f('app/composables/sessions/useSessionRunner.ts', /\(s as unknown\)\.specs/g, '(s as { specs: unknown[] }).specs'); 
f('app/composables/sessions/useSessionRunner.ts', /\(s as unknown\)\.suites/g, '(s as { suites: unknown[] }).suites');
f('app/composables/sessions/useSessionRunner.ts', /innerTests: \[\]/g, 'innerTests: [] as InnerTest[]');

// 3. default.vue
f('app/layouts/default.vue', /window\.electronAPI/g, '(window as unknown as { electronAPI: Record<string, Function> }).electronAPI');
f('app/layouts/default.vue', /const activeDownload = ref<unknown>\(null\);/g, 'const activeDownload = ref<Record<string, unknown> | null>(null);');
f('app/layouts/default.vue', /\(activeDownload\.value as unknown\)/g, '(activeDownload.value as Record<string, unknown>)');
f('app/layouts/default.vue', /import \{ ApiError \}/g, 'import type { ApiError }');
f('app/layouts/default.vue', /\(e as unknown\)\.data/g, '(e as ApiError).data');
f('app/layouts/default.vue', /\(err as unknown\)\.data/g, '(err as ApiError).data');

// 4. runner.vue
f('app/pages/sessions/[id]/runner.vue', /status: msg\.status/g, 'status: msg.status as "PASSED" | "FAILED" | "waiting" | "running" | "SKIPPED"');
f('app/pages/sessions/[id]/runner.vue', /\(err as unknown\)\.message/g, '(err as Error).message');
f('app/pages/sessions/[id]/runner.vue', /\(s as unknown\)/g, '(s as { specs?: unknown[], suites?: unknown[] })');

// 5. setup.vue
f('app/pages/sessions/[id]/setup.vue', /p as unknown as Record<string, string>/g, 'p as unknown as Record<string, string>'); 
f('app/pages/sessions/[id]/setup.vue', /p as unknown/g, 'p as Record<string, string>');
f('app/pages/sessions/[id]/setup.vue', /p: unknown/g, 'p: Record<string, string>');

// 6. settings/index.vue
f('app/pages/settings/index.vue', /\(e as unknown\)/g, '(e as ApiError)');
f('app/pages/settings/index.vue', /info as unknown/g, 'info as Record<string, unknown>');
f('app/pages/settings/index.vue', /window\.electronAPI/g, '(window as unknown as { electronAPI: Record<string, Function> }).electronAPI');
f('app/pages/settings/index.vue', /res as unknown/g, 'res as { valid: boolean; message: string }');

// 7. netstat.get.ts
f('server/api/local/netstat.get.ts', /port === 80/g, 'port === "80"');

// 8. dhcp-partner.post.ts
f('server/api/proxy/device/dhcp-partner.post.ts', /\(targetLeases as unknown\)/g, '(targetLeases as unknown[])');

// 9. mobile.post.ts
f('server/api/proxy/device/mobile.post.ts', /\(e as unknown\)/g, '(e as ApiError)');
f('server/api/proxy/device/mobile.post.ts', /\(err as unknown\)/g, '(err as ApiError)');
f('server/api/proxy/device/mobile.post.ts', /error\._data/g, '(error as ApiError)._data');
f('server/api/proxy/device/mobile.post.ts', /error as unknown/g, 'error as ApiError');

// 10. poe.post.ts
f('server/api/proxy/device/poe.post.ts', /\(err as unknown\)/g, '(err as ApiError)');

// 11. startup-check.post.ts
f('server/api/proxy/device/startup-check.post.ts', /m as unknown/g, 'm as Record<string, unknown>');
f('server/api/proxy/device/startup-check.post.ts', /error as unknown/g, 'error as ApiError');
f('server/api/proxy/device/startup-check.post.ts', /error\./g, '(error as ApiError).');

// 12. index.get.ts
f('server/api/sessions/index.get.ts', /res\.meta as unknown/g, 'res.meta as SessionMeta');

// 13. files.get.ts
f('server/api/tests/files.get.ts', /error as unknown/g, 'error as ApiError');

// 14. parse.post.ts
f('server/api/tests/parse.post.ts', /err as unknown/g, 'err as ApiError');
