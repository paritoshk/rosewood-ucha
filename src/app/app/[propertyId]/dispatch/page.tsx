import { PushToTalk } from "@/components/dispatch/PushToTalk";

const DEMO_REQUESTS = [
  {
    id: "req-001",
    room: "412",
    guest: "Mr. Chen",
    dept: "Housekeeping",
    deptColor: "#2C5240",
    request: "Extra towels and pillow turndown service.",
    time: "09:14",
    status: "In progress",
    statusColor: "#B8893B",
    urgency: null,
  },
  {
    id: "req-002",
    room: "218",
    guest: "Ms. Thornton",
    dept: "Maintenance",
    deptColor: "#6B6258",
    request: "Air conditioning not cooling adequately.",
    time: "09:02",
    status: "Assigned",
    statusColor: "#6B6258",
    urgency: null,
  },
  {
    id: "req-003",
    room: "601",
    guest: "Mr. & Mrs. Okafor",
    dept: "Concierge",
    deptColor: "#1F3A2E",
    request: "Restaurant reservation for 2 tonight, 7:30pm.",
    time: "08:47",
    status: "Done",
    statusColor: "#D9D2C2",
    urgency: null,
  },
];

export default async function DispatchPage({
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
      {/* Page header */}
      <div
        style={{
          borderBottom: "1px solid #D9D2C2",
          padding: "20px 36px",
          display: "flex",
          alignItems: "flex-start",
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
            {propertyLabel} &nbsp;/&nbsp; Dispatch
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
            Dispatch
          </h1>
        </div>

        {/* Live indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "6px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#1F3A2E",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6B6258",
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* Canvas body */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          overflow: "hidden",
        }}
      >
        {/* PTT area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            borderRight: "1px solid #D9D2C2",
            gap: "0",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontWeight: 300,
              fontSize: "32px",
              letterSpacing: "-0.01em",
              color: "#1A1A1A",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            Hold to speak.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8E867A",
              margin: "0 0 40px",
              textAlign: "center",
            }}
          >
            Any request · Any department
          </p>

          <PushToTalk />
        </div>

        {/* Active queue sidebar */}
        <div
          style={{
            overflow: "auto",
            borderLeft: "1px solid #D9D2C2",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #D9D2C2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8E867A",
              }}
            >
              Active queue
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "#1F3A2E",
                background: "rgba(31,58,46,0.08)",
                padding: "3px 7px",
                borderRadius: "2px",
              }}
            >
              {DEMO_REQUESTS.length} open
            </span>
          </div>

          {DEMO_REQUESTS.map((req, i) => (
            <div
              key={req.id}
              style={{
                padding: "16px 20px",
                borderBottom: i < DEMO_REQUESTS.length - 1 ? "1px solid #D9D2C2" : undefined,
                borderLeft: `2px solid ${req.deptColor}`,
                background: "#FFFFFF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "4px",
                }}
              >
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#1A1A1A",
                      lineHeight: 1,
                    }}
                  >
                    {req.room}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#8E867A",
                    }}
                  >
                    {req.guest}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    color: "#8E867A",
                  }}
                >
                  {req.time}
                </span>
              </div>

              <p
                style={{
                  fontSize: "12.5px",
                  color: "#2C2A26",
                  margin: "0 0 8px",
                  lineHeight: 1.4,
                }}
              >
                {req.request}
              </p>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: req.deptColor,
                    border: `1px solid ${req.deptColor}`,
                    padding: "2px 6px",
                    borderRadius: "2px",
                    opacity: 0.85,
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
                    color: req.statusColor,
                  }}
                >
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
