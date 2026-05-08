import fs from "node:fs/promises";
import path from "node:path";
import type { FileExporterConfig, ObservationEnvelope } from "../types.js";
import type { ObservationExporter } from "./types.js";

export function createFileExporter(params: {
  cfg: FileExporterConfig;
  warn: (msg: string) => void;
}): ObservationExporter | null {
  const { cfg, warn } = params;
  if (!cfg.enabled || !cfg.path) {
    return null;
  }

  const resolvedPath = cfg.path;
  let prepared = false;

  async function ensureParent(): Promise<void> {
    if (prepared) {
      return;
    }
    const dir = path.dirname(resolvedPath);
    if (cfg.mkdir && dir !== "." && dir !== "/") {
      await fs.mkdir(dir, { recursive: true });
    }
    prepared = true;
  }

  return {
    id: "file",
    async export(envelope: ObservationEnvelope): Promise<void> {
      try {
        await ensureParent();
        const line = `${JSON.stringify(envelope)}\n`;
        await fs.appendFile(resolvedPath, line, "utf8");
      } catch (err) {
        warn(`kaiporalabs-observability file exporter: ${String(err)}`);
      }
    },
  };
}
