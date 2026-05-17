"use client";

import { useCallback, useState } from "react";
import {
  ConversationProvider,
  useConversation,
  useConversationClientTool,
} from "@elevenlabs/react";
import { IconMicrophone, IconLoader2 } from "@tabler/icons-react";
import { useDispatch } from "@/context/DispatchContext";
import type { DispatchRequest } from "@/lib/types";

interface DispatchParams {
  department: string;
  priority: string;
  summary: string;
  room: string;
  eta_minutes: number;
}

function ConversationInner() {
  const { addRequest } = useDispatch();
  const [error, setError] = useState("");

  const { status, isSpeaking, startSession, endSession } = useConversation({
    onConnect: () => setError(""),
    onError: (err: unknown) => {
      if (typeof err === "string") setError(err);
      else if (err instanceof Error) setError(err.message);
      else setError("Connection error — try again.");
    },
  });

  useConversationClientTool("create_dispatch", async (params: Record<string, unknown>) => {
    const { department, priority, summary, room, eta_minutes } = params as unknown as DispatchParams;
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department, priority, summary, room, eta_minutes }),
      });
      if (!res.ok) return "Error creating dispatch";
      const { request, result } = (await res.json()) as {
        request: DispatchRequest;
        result: string;
      };
      await addRequest(request);
      return result;
    } catch {
      return "Dispatch failed";
    }
  });

  const toggle = useCallback(async () => {
    if (status === "connected") {
      await endSession();
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/conversation/token");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      await startSession({ signedUrl: data.signed_url });
    } catch {
      setError("Mic access denied or connection failed.");
    }
  }, [status, startSession, endSession]);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  const label = isConnecting
    ? "Connecting…"
    : isConnected
      ? isSpeaking
        ? "Speaking…"
        : "Listening…"
      : "Talk to Üchá";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {error && (
        <span
          className="rw-label"
          title={error}
          style={{
            color: "var(--priority-urgent)",
            maxWidth: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {error.length > 55 ? error.slice(0, 52) + "…" : error}
        </span>
      )}
      <button
        onClick={toggle}
        disabled={isConnecting}
        aria-label={isConnected ? "End conversation" : "Start conversation"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 30,
          padding: "0 12px",
          borderRadius: 9999,
          border: isConnected
            ? "1px solid var(--priority-urgent)"
            : "1px solid var(--rw-border-med)",
          background: isConnected
            ? "rgba(192,57,43,0.08)"
            : "var(--rw-parchment-2)",
          color: isConnected ? "var(--priority-urgent)" : "var(--rw-ink)",
          cursor: isConnecting ? "wait" : "pointer",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          userSelect: "none",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        {isConnecting ? (
          <IconLoader2
            size={14}
            strokeWidth={1.8}
            style={{ animation: "spin 1s linear infinite" }}
          />
        ) : (
          <IconMicrophone size={14} strokeWidth={1.8} />
        )}
        {label}
      </button>
    </div>
  );
}

export function ConversationButton() {
  return (
    <ConversationProvider>
      <ConversationInner />
    </ConversationProvider>
  );
}
