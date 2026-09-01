import { refreshTestTree } from "../../../utils/testScanner";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let type = (query.type as string) || "release";
  if (type === "playground") {
    type = "release";
  }

  try {
    return await refreshTestTree(type);
  } catch (_error: unknown) {
    const error = _error as { message?: string; statusMessage?: string };
    console.error("Failed to refresh test tree:", _error);
    throw createError({
      statusCode: 500,
      statusMessage:
        error.message || error.statusMessage || "Failed to refresh test tree",
    });
  }
});
