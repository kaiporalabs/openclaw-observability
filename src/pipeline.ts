import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
import type { ObservationEnvelope, ObservabilityPluginConfig } from "./types.js";
import { buildEnvelope } from "./envelope.js";
import { sanitizeForExport } from "./sanitize.js";
import { buildExporters } from "./exporters/index.js";

export type ObservationPipeline = {
  emit: (input: {
    hook: string;
    correlation: ObservationEnvelope["correlation"];
    data: unknown;
  }) => void;
};

export function createObservationPipeline(
  api: OpenClawPluginApi,
  cfg: ObservabilityPluginConfig,
): ObservationPipeline {
  const exporters = buildExporters({ cfg, warn: (msg) => api.logger.warn(msg) });
  const sanitization = cfg.sanitization;
  const pluginId = api.id;

  const emitOne = async (envelope: ObservationEnvelope) => {
    await Promise.allSettled(exporters.map((ex) => ex.export(envelope)));
  };

  return {
    emit({ hook, correlation, data }) {
      const sanitizedData = sanitizeForExport(data, sanitization);
      const envelope = buildEnvelope({
        pluginId,
        hook,
        correlation,
        data: sanitizedData,
      });
      void emitOne(envelope).catch((err) => {
        api.logger.warn(`openclaw-observability pipeline: ${String(err)}`);
      });
    },
  };
}
