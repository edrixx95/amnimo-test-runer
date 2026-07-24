import { getSettings } from "../../utils/settingsManager";

export default defineEventHandler((_event) => {
  return getSettings();
});
