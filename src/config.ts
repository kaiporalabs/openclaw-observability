import type {
  ObservabilityPluginConfig,
  ObservabilityHooksConfig,
  SanitizationConfig,
  ExportersConfig,
} from "./types.js";

const DEFAULT_HOOKS: ObservabilityHooksConfig = {
  beforeToolCall: true,
  afterToolCall: true,
  modelCallStarted: true,
  modelCallEnded: true,
  agentEnd: false,
  sessionStart: false,
  sessionEnd: false,
};

const DEFAULT_SANITIZATION: SanitizationConfig = {
  maxDepth: 8,
  maxStringLength: 8192,
  maxArrayLength: 64,
  redactKeys: [
    "password",
    "token",
    "authorization",
    "apiKey",
    "api_key",
    "secret",
    "cookie",
    "set-cookie",
  ],
};

const DEFAULT_EXPORTERS: ExportersConfig = {
  file: {
    enabled: false,
    path: undefined,
    mkdir: true,
  },
  webhook: {
    enabled: false,
    url: undefined,
    headers: {},
    timeoutMs: 15_000,
  },
};

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStr(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asRecordStr(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === "string") {
      out[k] = v;
    }
  }
  return out;
}

function asNum(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function mergeHooks(raw: unknown): ObservabilityHooksConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_HOOKS };
  }
  const h = raw as Record<string, unknown>;
  return {
    beforeToolCall: asBool(h.beforeToolCall, DEFAULT_HOOKS.beforeToolCall),
    afterToolCall: asBool(h.afterToolCall, DEFAULT_HOOKS.afterToolCall),
    modelCallStarted: asBool(h.modelCallStarted, DEFAULT_HOOKS.modelCallStarted),
    modelCallEnded: asBool(h.modelCallEnded, DEFAULT_HOOKS.modelCallEnded),
    agentEnd: asBool(h.agentEnd, DEFAULT_HOOKS.agentEnd),
    sessionStart: asBool(h.sessionStart, DEFAULT_HOOKS.sessionStart),
    sessionEnd: asBool(h.sessionEnd, DEFAULT_HOOKS.sessionEnd),
  };
}

function mergeSanitization(raw: unknown): SanitizationConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_SANITIZATION, redactKeys: [...DEFAULT_SANITIZATION.redactKeys] };
  }
  const s = raw as Record<string, unknown>;
  const redactKeys = Array.isArray(s.redactKeys)
    ? s.redactKeys.filter((x): x is string => typeof x === "string" && x.length > 0)
    : [...DEFAULT_SANITIZATION.redactKeys];
  return {
    maxDepth: asNum(s.maxDepth, DEFAULT_SANITIZATION.maxDepth, 1, 32),
    maxStringLength: asNum(s.maxStringLength, DEFAULT_SANITIZATION.maxStringLength, 64, 1_000_000),
    maxArrayLength: asNum(s.maxArrayLength, DEFAULT_SANITIZATION.maxArrayLength, 1, 10_000),
    redactKeys: redactKeys.length > 0 ? redactKeys : [...DEFAULT_SANITIZATION.redactKeys],
  };
}

function mergeExporters(raw: unknown): ExportersConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return structuredClone(DEFAULT_EXPORTERS);
  }
  const e = raw as Record<string, unknown>;
  const fileRaw =
    e.file && typeof e.file === "object" && !Array.isArray(e.file)
      ? (e.file as Record<string, unknown>)
      : {};
  const webhookRaw =
    e.webhook && typeof e.webhook === "object" && !Array.isArray(e.webhook)
      ? (e.webhook as Record<string, unknown>)
      : {};
  return {
    file: {
      enabled: asBool(fileRaw.enabled, DEFAULT_EXPORTERS.file.enabled),
      path: asStr(fileRaw.path),
      mkdir: asBool(fileRaw.mkdir, DEFAULT_EXPORTERS.file.mkdir),
    },
    webhook: {
      enabled: asBool(webhookRaw.enabled, DEFAULT_EXPORTERS.webhook.enabled),
      url: asStr(webhookRaw.url),
      headers: { ...DEFAULT_EXPORTERS.webhook.headers, ...asRecordStr(webhookRaw.headers) },
      timeoutMs: asNum(webhookRaw.timeoutMs, DEFAULT_EXPORTERS.webhook.timeoutMs, 500, 120_000),
    },
  };
}

export function resolveObservabilityConfig(raw: unknown): ObservabilityPluginConfig {
  const root =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  return {
    hooks: mergeHooks(root.hooks),
    sanitization: mergeSanitization(root.sanitization),
    exporters: mergeExporters(root.exporters),
  };
}

export function validateExporterConfig(cfg: ObservabilityPluginConfig): string | null {
  const anyEnabled =
    (cfg.exporters.file.enabled && Boolean(cfg.exporters.file.path)) ||
    (cfg.exporters.webhook.enabled && Boolean(cfg.exporters.webhook.url));
  if (!anyEnabled) {
    return "openclaw-observability: enable at least one exporter (file.path or webhook.url).";
  }
  return null;
}
