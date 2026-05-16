const ACTIVITY = [
  { time: "09:14:22", actor: "Dispatch", event: "New request created", detail: "Room 412 · Housekeeping — extra towels", dept: "Housekeeping" },
  { time: "09:14:35", actor: "System", event: "Request routed", detail: "→ Maria Santos (Housekeeping)", dept: "Housekeeping" },
  { time: "09:02:11", actor: "Dispatch", event: "New request created", detail: "Room 218 · Maintenance — AC issue", dept: "Maintenance" },
  { time: "09:02:19", actor: "System", event: "Request routed", detail: "→ Carlos Reyes (Maintenance)", dept: "Maintenance" },
  { time: "08:55:44", actor: "Maria Santos", event: "Request updated", detail: "Room 410 — marked In Progress", dept: "Housekeeping" },
  { time: "08:47:55", actor: "Dispatch", event: "New request created", detail: "Room 601 · Concierge — dinner reservation", dept: "Concierge" },
  { time: "08:48:03", actor: "System", event: "Request routed", detail: "→ James Osei (Concierge)", dept: "Concierge" },
  { time: "08:30:01", actor: "James Osei", event: "Request closed", detail: "Room 501 — transport arranged ✓", dept: "Concierge" },
  { time: "08:20:18", actor: "Dispatch", event: "New request created", detail: "Room 502 · Front Desk — early checkout", dept: "Front Desk" },
  { time: "08:21:00", actor: "Front Desk", event: "Request closed", detail: "Room 502 — paperwork complete ✓", dept: "Front Desk" },
];

const DEPT_COLORS: Record<string, string> = {
  Housekeeping: "#2C5240",
  Maintenance: "#6B6258",
  Concierge: "#1F3A2E",
  "Front Desk": "#8B4543",
  System: "#8E867A",
  Dispatch: "#1A1A1A",
};

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const propertyLabel = propertyId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          borderBottom: "1px solid #D9D2C2",
          padding: "20px 36px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8E867A",
            margin: "0 0 4px",
          }}
        >
          {propertyLabel} &nbsp;/&nbsp; Activity
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 400,
            fontSize: "36px",
            letterSpacing: "-0.01em",
            margin: 0,
            lineHeight: 1,
          }}
        >
          Activity
        </h1>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 36px" }}>
        {ACTIVITY.map((entry, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "96px 120px 1fr",
              gap: "0 16px",
              padding: "12px 0",
              borderBottom: "1px solid #D9D2C2",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.04em",
                color: "#8E867A",
              }}
            >
              [{entry.time}]
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: DEPT_COLORS[entry.actor] ?? "#6B6258",
              }}
            >
              {entry.actor}
            </span>
            <div>
              <span
                style={{
                  fontSize: "13.5px",
                  color: "#1A1A1A",
                  fontWeight: 500,
                  marginRight: "8px",
                }}
              >
                {entry.event}
              </span>
              <span style={{ fontSize: "13px", color: "#6B6258" }}>
                {entry.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
