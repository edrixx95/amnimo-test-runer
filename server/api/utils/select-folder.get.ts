import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export default defineEventHandler(async () => {
  try {
    const script = `
Add-Type -AssemblyName System.Windows.Forms
$fbd = New-Object System.Windows.Forms.FolderBrowserDialog
$fbd.ShowNewFolderButton = $true
$fbd.Description = "Select Server Directory"

$form = New-Object System.Windows.Forms.Form
$form.TopMost = $true
$result = $fbd.ShowDialog($form)

if ($result -eq 'OK') {
  Write-Output $fbd.SelectedPath
}
`;

    const encodedCommand = Buffer.from(script, "utf16le").toString("base64");
    const { stdout } = await execAsync(
      `powershell.exe -STA -NoProfile -EncodedCommand ${encodedCommand}`,
    );

    const selectedPath = stdout.trim();
    return { path: selectedPath || null };
  } catch (_e: unknown) {
    const e = _e as import('~~/shared/types').CatchError;
    const err = e as { message?: string, statusCode?: number, statusMessage?: string };
    console.error("Folder picker error:", err);
    throw createError({
      statusCode: 500,
      statusMessage: (err as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).message || "Failed to open folder picker",
    });
  }
});
