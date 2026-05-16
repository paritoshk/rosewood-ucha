"use client";

import { IconDiamond } from "@tabler/icons-react";
import type { DispatchRequest, Status } from "@/lib/types";
import { useDispatch } from "@/context/DispatchContext";

const PRIORITY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  urgent: { label: "Urgent", color: "var(--priority-urgent)", bg: "rgba(192,57,43,0.08)" },
  normal: { label: "Normal", color: "var(--priority-normal)", bg: "rgba(181,133,26,0.08)" },
  low: { label: "Low", color: "var(--priority-low)", bg: "rgba(46,125,82,0.08)" },
};

interface Props {
  request: DispatchRequest;
}

export function RequestCard({ request }: Props) {
  const { updateStatus } = useDispatch();
  const priority = PRIORITY_STYLES[request.priority];
  const isPinnacle = request.guestTier === "Pinnacle";

  const nextStatus: Partial<Record<Status, Status>> = {
    pending: "in_progress",
    in_progress: "resolved",
  };
  const actionLabel: Partial<Record<Status, string>> = {
    pending: "Assign",
    in_progress: "Resolve",
  };

  return (
    <div
      style={{
        background: "var(--rw-parchment)",
        border: "1px solid var(--rw-border)",
        borderLeft:
          request.priority === "urgent"
            ? "2px solid var(--priority-urgent)"
            : "1px solid var(--rw-border)",
        borderRadius:
          request.priority === "urgent" ? "0 4px 4px 0" : "4px",
        padding: 16,
        marginBottom: 8,
      }}
    >
      {/* Row 1: Room + priority */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <span className="rw-room">{request.room}</span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: priority.color,
            background: priority.bg,
            padding: "3px 8px",
            borderRadius: 2,
          }}
        >
          {priority.label}
        </span>
      </div>

      {/* Row 2: Summary */}
      <p
        style={{
          fontSize: 13,
          color: "var(--rw-ink-muted)",
          marginTop: 4,
          lineHeight: 1.4,
        }}
      >
        {request.summary}
      </p>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--rw-border)",
          margin: "10px 0",
        }}
      />

      {/* Guest block */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 12,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--rw-ink)",
            }}
          >
            {request.guestName}
          </span>
          {isPinnacle && (
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "0.5px solid var(--rw-gold-dim)",
                color: "var(--rw-gold-dim)",
                padding: "2px 7px",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <IconDiamond size={8} strokeWidth={1.5} />
              Pinnacle
            </span>
          )}
        </div>
        {request.guestPrefs && (
          <p style={{ fontSize: 11, color: "var(--rw-ink-faint)", lineHeight: 1.4 }}>
            {request.guestPrefs}
          </p>
        )}
      </div>

      {/* Bottom: ETA + action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--rw-ink-faint)" }}>
          {request.eta ? `ETA ${request.eta}` : "—"}
        </span>
        {nextStatus[request.status] && (
          <button
            className={request.status === "pending" ? "rw-btn-ghost" : "rw-btn-primary"}
            onClick={() => updateStatus(request.id, nextStatus[request.status]!)}
          >
            {actionLabel[request.status]}
          </button>
        )}
      </div>
    </div>
  );
}
