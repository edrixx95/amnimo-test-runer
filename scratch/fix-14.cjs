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
    [/\(window as Window & typeof globalThis & \{ electronAPI\?: Record<string, any> \}\)\?\.electronAPI\./g, '(window as any).electronAPI.'],
    [/\(window as Window & typeof globalThis & \{ electronAPI\?: Record<string, any> \}\)\?\.electronAPI/g, '(window as any).electronAPI']
]);

replaceFile('app/pages/settings/index.vue', [
    [/\(window as Window & typeof globalThis & \{ electronAPI\?: Record<string, any> \}\)\?\.electronAPI\./g, '(window as any).electronAPI.'],
    [/\(window as Window & typeof globalThis & \{ electronAPI\?: Record<string, any> \}\)\?\.electronAPI/g, '(window as any).electronAPI']
]);

replaceFile('app/components/modals/UpdateNotifier.vue', [
    [/\(window as any\)\.electronAPI\./g, '(window as any).electronAPI!.'],
    [/\(window as any\)\.electronAPI/g, '(window as any).electronAPI!']
]);

replaceFile('app/composables/sessions/useLiveProgress.ts', [
    [/session\.value\.status = \(data as any\)\.status;/g, '(session.value as any).status = (data as any).status;']
]);

// Wait, the error in useLiveProgress.ts was:
// app/composables/sessions/useLiveProgress.ts(143,42): error TS2339: Property 'status' does not exist on type '{}'.
// 143         if (session.value) session.value.status = data.status;
// Because session.value is `{}`, so let's change `session.value.status = data.status;` to `(session.value as any).status = (data as any).status;`
replaceFile('app/composables/sessions/useLiveProgress.ts', [
    [/if \(session\.value\) session\.value\.status = data\.status;/g, 'if (session.value) (session.value as any).status = (data as any).status;'],
    [/if \(session\.value\) session\.value\.status = \(data as any\)\.status;/g, 'if (session.value) (session.value as any).status = (data as any).status;']
]);

