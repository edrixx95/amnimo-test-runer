import { lockManager } from "../../utils/lockManager";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const resource = query.resource as string;

  if (resource) {
    const lock = lockManager.getLock(resource);
    return {
      locked: !!lock,
      lock,
    };
  }

  // Return all locks if no specific resource requested (for debugging)
  // (In a real scenario, might want to restrict this or not expose it all)
  return { error: "resource query parameter is required" };
});
