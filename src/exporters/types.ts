import type { ObservationEnvelope } from "../types.js";

export type ObservationExporter = {
  readonly id: string;
  export(envelope: ObservationEnvelope): Promise<void>;
};
