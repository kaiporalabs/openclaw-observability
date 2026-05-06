import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
import { resolveObservabilityConfig, validateExporterConfig } from "./config.js";
import { createObservationPipeline } from "./pipeline.js";

function slimAgentCtx(ctx: {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  jobId?: string;
  modelProviderId?: string;
  modelId?: string;
  trigger?: string;
  channelId?: string;
}) {
  return {
    agentId: ctx.agentId,
    sessionKey: ctx.sessionKey,
    sessionId: ctx.sessionId,
    runId: ctx.runId,
    jobId: ctx.jobId,
    modelProviderId: ctx.modelProviderId,
    modelId: ctx.modelId,
    trigger: ctx.trigger,
    channelId: ctx.channelId,
  };
}

export function registerObservability(api: OpenClawPluginApi): void {
  const cfg = resolveObservabilityConfig(api.pluginConfig);
  const validationError = validateExporterConfig(cfg);
  if (validationError) {
    api.logger.warn(validationError);
    return;
  }

  const pipeline = createObservationPipeline(api, cfg);
  const { hooks } = cfg;

  if (hooks.beforeToolCall) {
    api.on(
      "before_tool_call",
      (event, ctx) => {
        pipeline.emit({
          hook: "before_tool_call",
          correlation: {
            agentId: ctx.agentId,
            sessionKey: ctx.sessionKey,
            sessionId: ctx.sessionId,
            runId: event.runId ?? ctx.runId,
            toolCallId: event.toolCallId ?? ctx.toolCallId,
            toolName: event.toolName,
          },
          data: {
            event: {
              toolName: event.toolName,
              params: event.params,
              runId: event.runId,
              toolCallId: event.toolCallId,
            },
            toolContext: {
              agentId: ctx.agentId,
              sessionKey: ctx.sessionKey,
              sessionId: ctx.sessionId,
              runId: ctx.runId,
              toolCallId: ctx.toolCallId,
              toolName: ctx.toolName,
            },
          },
        });
      },
      { priority: -100 },
    );
  }

  if (hooks.afterToolCall) {
    api.on(
      "after_tool_call",
      (event, ctx) => {
        pipeline.emit({
          hook: "after_tool_call",
          correlation: {
            agentId: ctx.agentId,
            sessionKey: ctx.sessionKey,
            sessionId: ctx.sessionId,
            runId: event.runId ?? ctx.runId,
            toolCallId: event.toolCallId ?? ctx.toolCallId,
            toolName: event.toolName,
          },
          data: {
            event: {
              toolName: event.toolName,
              params: event.params,
              runId: event.runId,
              toolCallId: event.toolCallId,
              result: event.result,
              error: event.error,
              durationMs: event.durationMs,
            },
            toolContext: {
              agentId: ctx.agentId,
              sessionKey: ctx.sessionKey,
              sessionId: ctx.sessionId,
              runId: ctx.runId,
              toolCallId: ctx.toolCallId,
              toolName: ctx.toolName,
            },
          },
        });
      },
      { priority: -100 },
    );
  }

  if (hooks.modelCallStarted) {
    api.on("model_call_started", (event, ctx) => {
      pipeline.emit({
        hook: "model_call_started",
        correlation: {
          agentId: ctx.agentId,
          sessionKey: ctx.sessionKey ?? event.sessionKey,
          sessionId: ctx.sessionId ?? event.sessionId,
          runId: ctx.runId ?? event.runId,
        },
        data: { event, agentContext: slimAgentCtx(ctx) },
      });
    });
  }

  if (hooks.modelCallEnded) {
    api.on("model_call_ended", (event, ctx) => {
      pipeline.emit({
        hook: "model_call_ended",
        correlation: {
          agentId: ctx.agentId,
          sessionKey: ctx.sessionKey ?? event.sessionKey,
          sessionId: ctx.sessionId ?? event.sessionId,
          runId: ctx.runId ?? event.runId,
        },
        data: { event, agentContext: slimAgentCtx(ctx) },
      });
    });
  }

  if (hooks.agentEnd) {
    api.on("agent_end", (event, ctx) => {
      pipeline.emit({
        hook: "agent_end",
        correlation: {
          agentId: ctx.agentId,
          sessionKey: ctx.sessionKey,
          sessionId: ctx.sessionId,
          runId: ctx.runId ?? event.runId,
        },
        data: { event, agentContext: slimAgentCtx(ctx) },
      });
    });
  }

  if (hooks.sessionStart) {
    api.on("session_start", (event, ctx) => {
      pipeline.emit({
        hook: "session_start",
        correlation: {
          agentId: ctx.agentId,
          sessionKey: ctx.sessionKey ?? event.sessionKey,
          sessionId: ctx.sessionId ?? event.sessionId,
        },
        data: { event, sessionContext: ctx },
      });
    });
  }

  if (hooks.sessionEnd) {
    api.on("session_end", (event, ctx) => {
      pipeline.emit({
        hook: "session_end",
        correlation: {
          agentId: ctx.agentId,
          sessionKey: ctx.sessionKey ?? event.sessionKey,
          sessionId: ctx.sessionId ?? event.sessionId,
        },
        data: { event, sessionContext: ctx },
      });
    });
  }
}
