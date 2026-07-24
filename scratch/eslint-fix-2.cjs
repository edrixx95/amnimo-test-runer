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

const functionReplace = [
    [/Record<string, Function>/g, 'Record<string, (...args: unknown[]) => unknown>']
];

replaceFile('app/components/modals/UpdateNotifier.vue', functionReplace);
replaceFile('app/layouts/default.vue', functionReplace);
replaceFile('app/pages/settings/index.vue', functionReplace);

replaceFile('app/components/peripherals/PeripheralNxWitnessCheck.vue', [
    [/catch \(e\)/g, 'catch (_e)'],
    [/catch \(err\)/g, 'catch (_err)'],
    [/as any/g, 'as unknown'] // change back to unknown where safe
]);

replaceFile('app/components/peripherals/PeripheralPoeCheck.vue', [
    [/as any/g, 'as unknown']
]);

replaceFile('app/components/peripherals/PeripheralSimCheck.vue', [
    [/as any/g, 'as unknown']
]);

replaceFile('app/components/peripherals/PeripheralStorageCheck.vue', [
    [/as any/g, 'as unknown']
]);

replaceFile('app/composables/peripherals/usePeripheralChecklist.ts', [
    [/as any/g, 'as unknown']
]);

replaceFile('server/api/proxy/device/mobile.post.ts', [
    [/as any/g, 'as unknown']
]);

replaceFile('server/api/proxy/device/startup-check.post.ts', [
    [/as any/g, 'as unknown']
]);

replaceFile('server/utils/sessionManager.ts', [
    [/SessionStatus, /g, '']
]);

replaceFile('shared/types/index.ts', [
    [/_data\?: any/g, '_data?: unknown']
]);
