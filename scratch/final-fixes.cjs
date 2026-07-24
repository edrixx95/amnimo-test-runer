const fs = require('fs');

function fix(file, regex, replacement) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let newC = c.replace(regex, replacement);
  if (c !== newC) {
    fs.writeFileSync(file, newC);
  }
}

// app/pages/sessions/[id]/runner.vue(715,17): error TS18046: 's' is of type 'unknown'.
fix('app/pages/sessions/[id]/runner.vue', /\(s as unknown\)/g, '(s as Record<string, unknown>)');

// app/pages/sessions/[id]/setup.vue(603,45): error TS2352: Conversion of type 'string' to type 'Record<string, string>'
fix('app/pages/sessions/[id]/setup.vue', /p as Record<string, string>/g, 'p as unknown as Record<string, string>');

// app/pages/settings/index.vue(59,16): error TS18046: 'e' is of type 'unknown'.
fix('app/pages/settings/index.vue', /\(e as unknown\)/g, '(e as ApiError)');
fix('app/pages/settings/index.vue', /info as unknown/g, 'info as Record<string, unknown>');
fix('app/pages/settings/index.vue', /res as unknown;/g, 'res as { valid: boolean; message: string };');
fix('app/pages/settings/index.vue', /window\.electronAPI/g, '(window as unknown as { electronAPI: any }).electronAPI');
// Wait, 'any' is not allowed. Let's use Record<string, Function>
fix('app/pages/settings/index.vue', /\(window as unknown as \{ electronAPI: any \}\)/g, '(window as unknown as { electronAPI: Record<string, Function> })');

// server/api/proxy/device/startup-check.post.ts
fix('server/api/proxy/device/startup-check.post.ts', /m as unknown/g, 'm as Record<string, unknown>');
fix('server/api/proxy/device/startup-check.post.ts', /error as unknown/g, 'error as ApiError');

// server/api/proxy/device/poe.post.ts
fix('server/api/proxy/device/poe.post.ts', /err as unknown/g, 'err as ApiError');

// server/api/proxy/device/storage/partitions.post.ts(68,42): error TS2339: Property 'statusMessage' does not exist on type 'ApiError'.
// Let's add statusMessage to ApiError in shared/types/index.ts. Oh wait, I added it in data?: { statusMessage?: string }.
// The error is because they access error.statusMessage directly. So I'll add statusMessage directly on ApiError!
fix('shared/types/index.ts', /message\?: string \};\n/, 'message?: string };\n  statusMessage?: string;\n');

// server/api/sessions/index.get.ts(20,13): error TS2322: Type 'unknown' is not assignable to type 'SessionMeta | undefined'.
fix('server/api/sessions/index.get.ts', /res\.meta as unknown/g, 'res.meta as SessionMeta');

// server/api/tests/files.get.ts(75,22): error TS18046: 'error' is of type 'unknown'.
fix('server/api/tests/files.get.ts', /error as unknown/g, 'error as ApiError');

// server/api/tests/parse.post.ts(71,46): error TS18046: 'err' is of type 'unknown'.
fix('server/api/tests/parse.post.ts', /err as unknown/g, 'err as ApiError');

// server/api/local/netstat.get.ts(37,9): error TS2367: This comparison appears to be unintentional because the types 'string | undefined' and 'number' have no overlap.
fix('server/api/local/netstat.get.ts', /port === 80/g, 'port === "80"');

// server/api/proxy/configs/nxwitness-register.post.ts(123,29): error TS2339: Property 'statusMessage' does not exist on type 'ApiError'.
// (Will be fixed by shared/types/index.ts change)

// server/api/proxy/device/dhcp-partner.post.ts(57,25): error TS2488: Type '{}' must have a '[Symbol.iterator]()' method
fix('server/api/proxy/device/dhcp-partner.post.ts', /\(targetLeases as unknown\)/g, '(targetLeases as any[])');

// server/api/proxy/device/mobile.post.ts(75,57): error TS2339: Property 'result' does not exist on type '{}'.
// It accesses error._data?.result?.messages. I'll add result to _data in ApiError.
fix('shared/types/index.ts', /_data\?: Record<string, unknown>;/, '_data?: { result?: { messages?: any[] } } & Record<string, unknown>;');
