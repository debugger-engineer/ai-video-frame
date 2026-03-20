/**
 * Strips server-only file path fields before sending video data to clients.
 */
export function sanitizeVideo<T extends { originalPath?: unknown; processedPath?: unknown }>(
  v: T
): Omit<T, "originalPath" | "processedPath"> {
  const { originalPath, processedPath, ...safe } = v;
  return safe;
}
