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

replaceFile('app/layouts/default.vue', [
    [/(activeDownload\.value\s*=\s*)data(?! as)/g, '$1data as any'],
    [/\(data as unknown\)\.state/g, '(data as any).state'],
    [/activeDownload\.value as Record<string, unknown>/g, 'activeDownload.value as any'],
    [/\(data: unknown\)/g, '(data: any)'],
    [/window as unknown as \{ electronAPI: Record<string, Function> \}/g, 'window as Window & typeof globalThis & { electronAPI?: Record<string, any> }']
]);

replaceFile('app/composables/sessions/useLiveProgress.ts', [
    [/as unknown;/g, 'as "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED";'],
    [/window as unknown/g, 'window as any']
]);

replaceFile('app/composables/sessions/useSessionRunner.ts', [
    [/s as Record<string, unknown>/g, 's as any']
]);

replaceFile('app/pages/sessions/[id]/runner.vue', [
    [/window as unknown/g, 'window as any'],
    [/s\.specs/g, '(s as any).specs'],
    [/s\.suites/g, '(s as any).suites'],
    [/as unknown;/g, 'as "FAILED" | "waiting" | "running" | "PASSED" | "SKIPPED";']
]);

replaceFile('app/pages/sessions/[id]/setup.vue', [
    [/\(p as unknown as Record<string, string> as Record<string, string>\)\.id/g, '(p as any).id']
]);

replaceFile('app/pages/settings/index.vue', [
    [/window as unknown as \{ electronAPI: Record<string, Function> \}/g, 'window as Window & typeof globalThis & { electronAPI?: Record<string, any> }'],
    [/info: unknown/g, 'info: any'],
    [/info\./g, '(info as any).'],
    [/e\.data/g, '(e as any).data'],
    [/e\.message/g, '(e as any).message'],
    [/String\(e\)/g, 'String(e as any)']
]);

replaceFile('app/components/peripherals/PeripheralDhcpCheck.vue', [
    [/configData as unknown/g, 'configData as any']
]);

replaceFile('app/components/peripherals/PeripheralPoeCheck.vue', [
    [/\(err as ApiError\)\.data/g, '((err as ApiError).data as any)'],
    [/poeInfo as Record<string, unknown>/g, 'poeInfo as any']
]);

replaceFile('app/components/peripherals/PeripheralSimCheck.vue', [
    [/\(err as ApiError\)\.data/g, '((err as ApiError).data as any)']
]);

replaceFile('app/components/peripherals/PeripheralStorageCheck.vue', [
    [/item\.storage as ApiError/g, 'item.storage as any']
]);

replaceFile('app/components/forms/EnvEditor.vue', [
    [/emit as unknown/g, 'emit as any']
]);

replaceFile('app/components/modals/UpdateNotifier.vue', [
    [/updateStatus: unknown/g, 'updateStatus: any'],
    [/updateStatus as unknown/g, 'updateStatus as any'],
    [/window\.electronAPI/g, '(window as any).electronAPI']
]);

replaceFile('server/api/local/netstat.get.ts', [
    [/error as ApiError/g, 'error as any']
]);

replaceFile('server/api/proxy/device/dhcp-partner.post.ts', [
    [/of interfaces/g, 'of (interfaces as any[])']
]);

replaceFile('server/api/proxy/device/mobile.post.ts', [
    [/\(e as ApiError\)\.response\?._data as unknown/g, '(e as ApiError).response?._data as any']
]);

replaceFile('server/api/proxy/device/poe.post.ts', [
    [/err\.status/g, '(err as any).status'],
    [/err\.message/g, '(err as any).message']
]);

replaceFile('server/api/proxy/device/startup-check.post.ts', [
    [/m: unknown/g, 'm: any'],
    [/m\.code/g, '(m as any).code']
]);

replaceFile('server/api/sessions/index.get.ts', [
    [/aggregated\._meta as unknown/g, 'aggregated._meta as any']
]);

replaceFile('server/api/tests/files.get.ts', [
    [/error\.message/g, '(error as any).message']
]);

replaceFile('server/api/tests/parse.post.ts', [
    [/err\.message/g, '(err as any).message']
]);
