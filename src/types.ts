/** Stable envelope for all exporters (file + webhook). */
export type ObservationEnvelope = {
  schema: "openclaw.observability/v1";
  pluginId: string;
  emittedAt: string;
  hook: string;
  correlation: {
    agentId?: string;
    sessionKey?: string;
    sessionId?: string;
    runId?: string;
    toolCallId?: string;
    toolName?: string;
  };
  /** Sanitized hook payload (event + optional context fields). */
  data: unknown;
};

export type ObservabilityHooksConfig = {
  beforeToolCall: boolean;
  afterToolCall: boolean;
  modelCallStarted: boolean;
  modelCallEnded: boolean;
  agentEnd: boolean;
  sessionStart: boolean;
  sessionEnd: boolean;
};

export type SanitizationConfig = {
  maxDepth: number;
  maxStringLength: number;
  maxArrayLength: number;
  redactKeys: string[];
};

export type FileExporterConfig = {
  enabled: boolean;
  path?: string;
  mkdir: boolean;
};

export type WebhookExporterConfig = {
  enabled: boolean;
  url?: string;
  headers: Record<string, string>;
  timeoutMs: number;
};

export type ExportersConfig = {
  file: FileExporterConfig;
  webhook: WebhookExporterConfig;
};

export type ObservabilityPluginConfig = {
  hooks: ObservabilityHooksConfig;
  sanitization: SanitizationConfig;
  exporters: ExportersConfig;
};
