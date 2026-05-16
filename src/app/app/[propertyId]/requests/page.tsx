const REQUESTS = [
  { id: "req-001", room: "412", guest: "Mr. Chen", dept: "Housekeeping", deptColor: "#2C5240", request: "Extra towels and pillow turndown service.", time: "09:14:22", status: "In progress", urgency: "Normal" },
  { id: "req-002", room: "218", guest: "Ms. Thornton", dept: "Maintenance", deptColor: "#6B6258", request: "Air conditioning not cooling adequately.", time: "09:02:11", status: "Assigned", urgency: "Normal" },
  { id: "req-003", room: "601", guest: "Mr. & Mrs. Okafor", dept: "Concierge", deptColor: "#1F3A2E", request: "Restaurant reservation for 2 tonight, 7:30pm.", time: "08:47:55", status: "Done", urgency: "Normal" },
  { id: "req-004", room: "305", guest: "Ms. Park", dept: "Housekeeping", deptColor: "#2C5240", request: "Room has not been serviced. Guest called front desk.", time: "08:31:04", status: "Open", urgency: "Urgent" },
  { id: "req-005", room: "502", guest: "Dr. Williams", dept: "Front Desk", deptColor: "#8B4543", request: "Early check-out — paperwork and transport needed.", time: "08:20:18", status: "Done", urgency: "Normal" },
];

export default async function RequestsPage({
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
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #D9D2C2",
          padding: "20px 36px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
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
            {propertyLabel} &nbsp;/&nbsp; Requests
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
            Requests
          </h1>
        </div>
        <span
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6B6258",
            border: "1px solid #D9D2C2",
            padding: "6px 12px",
          }}
        >
          {REQUESTS.length} total
        </span>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", padding: "0" }}>
        {/* Table head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 120px 1fr 140px 100px 100px",
            gap: "0",
            padding: "10px 36px",
            borderBottom: "1px solid #D9D2C2",
            background: "#EEE8D8",
          }}
        >
          {["Room", "Guest", "Request", "Department", "Status", "Time"].map(
            (col) => (
              <span
                key={col}
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8E867A",
                }}
              >
                {col}
              </span>
            )
          )}
        </div>

        {REQUESTS.map((req, i) => (
          <div
            key={req.id}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 120px 1fr 140px 100px 100px",
              gap: "0",
              padding: "14px 36px",
              borderBottom:
                i < REQUESTS.length - 1 ? "1px solid #D9D2C2" : undefined,
              borderLeft: `2px solid ${req.deptColor}`,
              background: req.urgency === "Urgent" ? "rgba(178,58,46,0.04)" : "#FFFFFF",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "20px",
                fontWeight: 500,
                color: "#1A1A1A",
              }}
            >
              {req.room}
            </span>
            <span style={{ fontSize: "13px", color: "#2C2A26" }}>
              {req.guest}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#2C2A26",
                paddingRight: "16px",
                lineHeight: 1.4,
              }}
            >
              {req.request}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: req.deptColor,
              }}
            >
              {req.dept}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:
                  req.status === "In progress"
                    ? "#B8893B"
                    : req.status === "Done"
                      ? "#D9D2C2"
                      : req.status === "Open"
                        ? "#B23A2E"
                        : "#6B6258",
              }}
            >
              {req.status}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "#8E867A",
              }}
            >
              {req.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
