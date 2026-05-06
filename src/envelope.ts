import type { ObservationEnvelope } from "./types.js";

export function buildEnvelope(params: {
  pluginId: string;
  hook: string;
  correlation: ObservationEnvelope["correlation"];
  data: unknown;
}): ObservationEnvelope {
  return {
    schema: "openclaw.observability/v1",
    pluginId: params.pluginId,
    emittedAt: new Date().toISOString(),
    hook: params.hook,
    correlation: { ...params.correlation },
    data: params.data,
  };
}
