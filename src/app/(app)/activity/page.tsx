"use client";

import { useDispatch } from "@/context/DispatchContext";
import type { DispatchRequest } from "@/lib/types";

const DEPT_COLORS: Record<string, string> = {
  housekeeping: "var(--dept-housekeeping)",
  maintenance: "var(--dept-maintenance)",
  front_desk: "var(--dept-front_desk)",
  concierge: "var(--dept-concierge)",
};

const DEPT_LABELS: Record<string, string> = {
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
  front_desk: "Front Desk",
  concierge: "Concierge",
};

function groupByHour(requests: DispatchRequest[]) {
  const groups: Record<string, DispatchRequest[]> = {};
  [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .forEach((r) => {
      const hour = new Date(r.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const key = hour.slice(0, 2) + ":00";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
  return groups;
}

export default function ActivityPage() {
  const { requests } = useDispatch();
  const groups = groupByHour(requests);
  const resolved = requests.filter((r) => r.status === "resolved").length;
  const total = requests.length;
  const avgResponse = 14; // mock

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
      {/* Log */}
      <div>
        <h2
          className="rw-display"
          style={{ fontSize: 28, marginBottom: 24 }}
        >
          Activity Log
        </h2>
        {Object.keys(groups).length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--rw-ink-faint)" }}>No requests yet.</p>
        ) : (
          Object.entries(groups).map(([hour, items]) => (
            <div key={hour} style={{ marginBottom: 24 }}>
              <p className="rw-label" style={{ marginBottom: 8 }}>
                {hour}
              </p>
              {items.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--rw-border)",
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                >
                  <span style={{ color: "var(--rw-ink-faint)", minWidth: 44 }}>
                    {new Date(r.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: DEPT_COLORS[r.department],
                      minWidth: 80,
                    }}
                  >
                    {DEPT_LABELS[r.department]}
                  </span>
                  <span style={{ flex: 1, color: "var(--rw-ink)", fontFamily: "var(--font-geist-sans), sans-serif" }}>
                    {r.summary}
                  </span>
                  <span style={{ color: "var(--rw-ink-faint)", minWidth: 32, textAlign: "right" }}>
                    {r.room}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 56 }}>
        {[
          { label: "Requests Today", value: total },
          { label: "Avg Response", value: `${avgResponse}m` },
          { label: "Resolved", value: resolved },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "var(--rw-parchment-2)",
              border: "1px solid var(--rw-border)",
              borderRadius: 4,
              padding: 20,
            }}
          >
            <p
              className="rw-display"
              style={{ fontSize: 40, marginBottom: 4 }}
            >
              {value}
            </p>
            <p className="rw-label">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
