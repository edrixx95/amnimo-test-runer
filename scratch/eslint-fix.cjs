const fs = require('fs');

function replaceFile(path, replacements) {
    if(!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    let original = content;
    for(let i = 0; i < replacements.length; i++) {
        content = content.replace(replacements[i][0], replacements[i][1]);
    }
    if (content !== original) {
        fs.writeFileSync(path, content);
        console.log('Fixed', path);
    }
}

// 1. Unused caught errors -> prepend _
const unusedCaughtErrors = [
    'app/composables/env/useEnvEditor.ts',
    'app/composables/peripherals/useNetworkCheck.ts',
    'app/composables/peripherals/usePeripheralChecklist.ts',
    'server/api/firmware/server-status.post.ts',
    'server/api/proxy/device/dhcp-partner.post.ts',
    'server/api/tests/orders.get.ts',
    'server/api/tests/parse.post.ts',
    'server/api/tests/run.post.ts',
    'server/api/tests/stream.get.ts',
    'server/utils/processManager.ts',
    'server/utils/sessionManager.ts'
];
for (const file of unusedCaughtErrors) {
    replaceFile(file, [
        [/catch \(e\)/g, 'catch (_e)'],
        [/catch \(err\)/g, 'catch (_err)'],
        [/catch \(e: unknown\)/g, 'catch (_e: unknown)'],
        [/catch \(err: unknown\)/g, 'catch (_err: unknown)']
    ]);
}

// 2. Fix `any` in default.vue, settings/index.vue, UpdateNotifier.vue
const windowReplace = [
    [/Record<string, any>/g, 'Record<string, Function>'],
    [/\(window as any\)/g, '(window as Window & typeof globalThis & { electronAPI?: Record<string, Function> })'],
    [/\(data as any\)\.state/g, '(data as DownloadProgressEvent).state'],
    [/\(data: any\)/g, '(data: DownloadProgressEvent)'],
    [/activeDownload\.value = data as any;/g, 'activeDownload.value = data as DownloadProgressEvent;'],
    [/activeDownload\.value as any/g, 'activeDownload.value as DownloadProgressEvent'],
    [/\(info: any\)/g, '(info: { status: string, version: string, percent: number, error: string })'],
    [/\(info as any\)/g, '(info as { status: string, version: string, percent: number, error: string })'],
    [/\(e as any\)/g, '(e as ApiError)'],
    [/\(updateStatus: any\)/g, '(updateStatus: { status: string, version: string, percent: number, error: string })'],
    [/\(updateStatus as any\)/g, '(updateStatus as { status: string, version: string, percent: number, error: string })']
];
replaceFile('app/layouts/default.vue', windowReplace);
replaceFile('app/pages/settings/index.vue', windowReplace);
replaceFile('app/components/modals/UpdateNotifier.vue', windowReplace);

// 3. Fix useLiveProgress.ts
replaceFile('app/composables/sessions/useLiveProgress.ts', [
    [/as any;/g, 'as "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED";'],
    [/\(window as any\)/g, '(window as Window & typeof globalThis & { showSaveFilePicker?: Function })'],
    [/\(session\.value as any\)\.status = \(data as any\)\.status;/g, 'session.value.status = (data as { status: "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED" }).status;'],
    [/\(data as any\)\.status/g, '(data as { status: "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED" }).status']
]);

// 4. Fix useSessionRunner.ts
replaceFile('app/composables/sessions/useSessionRunner.ts', [
    [/\(s as any\)\.specs/g, '(s as { specs: string[] }).specs'],
    [/\(s as any\)\.suites/g, '(s as { suites: any[] }).suites'] // Will still complain about `any[]`. Let's use `unknown[]`
]);
replaceFile('app/composables/sessions/useSessionRunner.ts', [
    [/\(s as \{ suites: any\[\] \}\)\.suites/g, '(s as { suites: unknown[] }).suites']
]);

// 5. Fix runner.vue
replaceFile('app/pages/sessions/[id]/runner.vue', [
    [/\(window as any\)/g, '(window as Window & typeof globalThis & { showSaveFilePicker?: Function })'],
    [/\(s as any\)\.specs/g, '(s as { specs: string[] }).specs'],
    [/\(s as any\)\.suites/g, '(s as { suites: unknown[] }).suites'],
    [/as "FAILED" \| "waiting" \| "running" \| "PASSED" \| "SKIPPED";/g, 'as "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED";'] // keep it
]);

// 6. Fix Peripheral Components
replaceFile('app/components/peripherals/PeripheralDhcpCheck.vue', [
    [/configData as any/g, 'configData as { dhcp4?: { enabled: boolean } }']
]);
replaceFile('app/components/peripherals/PeripheralPoeCheck.vue', [
    [/\(\(err as ApiError\)\.data as any\)\?\.statusCode/g, '(err as ApiError).data?.statusCode'], // wait, ApiError doesn't have statusCode in data? Actually we can cast to `{ statusCode?: number }`
    [/\(\(err as ApiError\)\.data as any\)\?\.statusCode/g, '((err as ApiError).data as { statusCode?: number })?.statusCode'],
    [/poeInfo as any/g, 'poeInfo as { voltage?: number, current?: number, watt?: number }']
]);
replaceFile('app/components/peripherals/PeripheralSimCheck.vue', [
    [/\(\(err as ApiError\)\.data as any\)\?\.statusCode/g, '((err as ApiError).data as { statusCode?: number })?.statusCode']
]);
replaceFile('app/components/peripherals/PeripheralStorageCheck.vue', [
    [/item\.storage as any/g, 'item.storage as { device: { name: string, size: number }, partitions: unknown[] }']
]);

// 7. Fix setup.vue
replaceFile('app/pages/sessions/[id]/setup.vue', [
    [/\(p as any\)\.id/g, '(p as { id: string }).id']
]);

// 8. Fix EnvEditor.vue
replaceFile('app/components/forms/EnvEditor.vue', [
    [/emit as any/g, 'emit as (event: "update:modelValue", value: string) => void']
]);

// 9. Fix server API endpoints
replaceFile('server/api/local/netstat.get.ts', [
    [/\(error as any\)\.code/g, '(error as { code?: string | number }).code']
]);
replaceFile('server/api/proxy/device/dhcp-partner.post.ts', [
    [/\(interfaces as any\[\]\)/g, '(interfaces as unknown[])']
]);
replaceFile('server/api/proxy/device/mobile.post.ts', [
    [/\(\(e as ApiError\)\.response\?._data as any\)\?\.result/g, '((e as ApiError).response?._data as { result?: { messages?: { code: string }[] } })?.result'],
    [/error as any/g, 'error as ApiError'] // If any
]);
replaceFile('server/api/proxy/device/poe.post.ts', [
    [/\(err as any\)\./g, '(err as ApiError).']
]);
replaceFile('server/api/proxy/device/startup-check.post.ts', [
    [/\(m: any\)/g, '(m: { code?: string })'],
    [/\(m as any\)\./g, '(m as { code?: string }).']
]);
replaceFile('server/api/sessions/index.get.ts', [
    [/aggregated\._meta as any/g, 'aggregated._meta as SessionMeta']
]);
replaceFile('server/api/tests/files.get.ts', [
    [/\(error as any\)\./g, '(error as Error).']
]);
replaceFile('server/api/tests/parse.post.ts', [
    [/\(err as any\)\./g, '(err as Error).']
]);

// 10. unused variables in sessionManager.ts
replaceFile('server/utils/sessionManager.ts', [
    [/import type \{ SessionStatus, SessionMeta \} from/g, 'import type { SessionMeta } from']
]);

// 11. Remove any remaining unexpected any in types
replaceFile('shared/types/index.ts', [
    [/_data\?: any/g, '_data?: unknown']
]);
