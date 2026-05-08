import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { registerObservability } from "./register-hooks.js";

export default definePluginEntry({
  id: "kaiporalabs-observability",
  name: "OpenClaw Observability",
  description:
    "Structured agent, tool, and model observations with configurable NDJSON file and HTTP webhook exporters",
  register(api) {
    registerObservability(api);
  },
});
