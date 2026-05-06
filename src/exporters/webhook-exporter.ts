import type { ObservationEnvelope, WebhookExporterConfig } from "../types.js";
import type { ObservationExporter } from "./types.js";

export function createWebhookExporter(params: {
  cfg: WebhookExporterConfig;
  warn: (msg: string) => void;
}): ObservationExporter | null {
  const { cfg, warn } = params;
  if (!cfg.enabled || !cfg.url) {
    return null;
  }

  const url = cfg.url;
  const timeoutMs = cfg.timeoutMs;
  const headers = {
    "content-type": "application/json; charset=utf-8",
    ...cfg.headers,
  };

  return {
    id: "webhook",
    async export(envelope: ObservationEnvelope): Promise<void> {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(envelope),
          signal: controller.signal,
        });
        if (!res.ok) {
          warn(
            `openclaw-observability webhook exporter: HTTP ${res.status} ${res.statusText} url=${url}`,
          );
        }
      } catch (err) {
        warn(`openclaw-observability webhook exporter: ${String(err)}`);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
