import type { SanitizationConfig } from "./types.js";

const REDACTED = "[REDACTED]";
const TRUNCATED = "…";

function normalizeKey(key: string, redactLower: Set<string>): boolean {
  return redactLower.has(key.toLowerCase());
}

export function sanitizeForExport(value: unknown, cfg: SanitizationConfig): unknown {
  const redactLower = new Set(cfg.redactKeys.map((k) => k.toLowerCase()));
  const walk = (v: unknown, depth: number): unknown => {
    if (depth > cfg.maxDepth) {
      return "[MAX_DEPTH]";
    }
    if (v === null || v === undefined) {
      return v;
    }
    if (typeof v === "string") {
      if (v.length <= cfg.maxStringLength) {
        return v;
      }
      return `${v.slice(0, cfg.maxStringLength)}${TRUNCATED}`;
    }
    if (typeof v === "number" || typeof v === "boolean") {
      return v;
    }
    if (typeof v === "bigint") {
      return v.toString();
    }
    if (v instanceof Date) {
      return v.toISOString();
    }
    if (Array.isArray(v)) {
      const slice = v.slice(0, cfg.maxArrayLength).map((item) => walk(item, depth + 1));
      if (v.length > cfg.maxArrayLength) {
        return [...slice, `[+${v.length - cfg.maxArrayLength} more]`];
      }
      return slice;
    }
    if (typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v)) {
        if (normalizeKey(k, redactLower)) {
          out[k] = REDACTED;
        } else {
          out[k] = walk(val, depth + 1);
        }
      }
      return out;
    }
    return String(v);
  };
  return walk(value, 0);
}
