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
    [/\?\.electronAPI\./g, '?.electronAPI?.']
]);

replaceFile('app/pages/settings/index.vue', [
    [/\?\.electronAPI\./g, '?.electronAPI?.']
]);

replaceFile('app/components/modals/UpdateNotifier.vue', [
    [/\?\.electronAPI\./g, '?.electronAPI?.']
]);

// useLiveProgress.ts:143
// 143: if (session.value) session.value.status = data.status;
// Wait, the previous replacement was:
// [/session\.value\.status = data\.status;/g, 'session.value.status = (data as any).status;'],
// So the line became `if (session.value) session.value.status = (data as any).status;`
// The error is `Property 'status' does not exist on type '{}'`.
replaceFile('app/composables/sessions/useLiveProgress.ts', [
    [/session\.value\.status = \(data as any\)\.status;/g, '(session.value as any).status = (data as any).status;']
]);
