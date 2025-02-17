import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const reportsTabCache = createSearchParamsCache({
  tab: parseAsStringLiteral(["all", "in_progress", "done"]).withDefault("all"),
});
