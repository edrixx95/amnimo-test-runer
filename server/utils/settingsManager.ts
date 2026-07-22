import fs from 'node:fs';
import path from 'node:path';

export interface AppSettings {
  e2ePath: string;
}

const SETTINGS_DIR = process.env.APP_DATA_PATH 
  ? path.join(process.env.APP_DATA_PATH, 'sessions') 
  : path.resolve(process.cwd(), 'sessions');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'settings.json');
const DEFAULT_E2E_PATH = 'C:/amnimo/amnimo-e2e';

let cachedSettings: AppSettings | null = null;

export const getSettings = (): AppSettings => {
  if (cachedSettings) {
    return cachedSettings;
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      cachedSettings = JSON.parse(data) as AppSettings;
      return cachedSettings;
    } catch (e) {
      console.error('Failed to read settings.json', e);
    }
  }

  // Fallback to default
  cachedSettings = {
    e2ePath: DEFAULT_E2E_PATH
  };
  return cachedSettings;
};

export const updateSettings = (newSettings: Partial<AppSettings>): AppSettings => {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  
  // Ensure sessions dir exists
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  cachedSettings = updated;
  
  return updated;
};
