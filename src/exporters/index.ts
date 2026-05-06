import type { ObservationExporter } from "./types.js";
import { createFileExporter } from "./file-exporter.js";
import { createWebhookExporter } from "./webhook-exporter.js";
import type { ObservabilityPluginConfig } from "../types.js";

export function buildExporters(params: {
  cfg: ObservabilityPluginConfig;
  warn: (msg: string) => void;
}): ObservationExporter[] {
  const { cfg, warn } = params;
  const list: ObservationExporter[] = [];
  const file = createFileExporter({ cfg: cfg.exporters.file, warn });
  const webhook = createWebhookExporter({ cfg: cfg.exporters.webhook, warn });
  if (file) {
    list.push(file);
  }
  if (webhook) {
    list.push(webhook);
  }
  return list;
}

export type { ObservationExporter } from "./types.js";
