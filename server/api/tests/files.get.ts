import { getCachedTestTree } from "../../utils/testScanner";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let type = (query.type as string) || "release";
  if (type === "playground") {
    type = "release";
  }

  try {
    const tree = await getCachedTestTree(type);

    return tree;
  } catch (_e: unknown) {
    const e = _e as import("~~/shared/types").CatchError;
    const error = e as {
      message?: string;
      statusCode?: number;
      statusMessage?: string;
    };
    console.error("Failed to read test files:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        (
          error as {
            response?: { status?: number };
            statusCode?: number;
            message?: string;
            statusMessage?: string;
            code?: string;
          }
        ).message || String(error),
    });
  }
});
