import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler((event) => {
  return getSettings();
});
