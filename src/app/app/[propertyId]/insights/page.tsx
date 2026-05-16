export default async function InsightsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const propertyLabel = propertyId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const stats = [
    { label: "Requests today", value: "24", delta: "+3 vs yesterday", up: true },
    { label: "Avg. resolution", value: "8m 12s", delta: "-1m 4s", up: true },
    { label: "Dropped requests", value: "1", delta: "SLA met: 95.8%", up: false },
    { label: "Active guests", value: "38", delta: "12 check out today", up: false },
  ];

  const deptBreakdown = [
    { dept: "Housekeeping", count: 11, color: "#2C5240" },
    { dept: "Maintenance", count: 5, color: "#6B6258" },
    { dept: "Concierge", count: 5, color: "#1F3A2E" },
    { dept: "Front Desk", count: 3, color: "#8B4543" },
  ];

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
          {propertyLabel} &nbsp;/&nbsp; Insights
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
          Insights
        </h1>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "32px 36px" }}>
        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            border: "1px solid #D9D2C2",
            marginBottom: "32px",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "24px",
                borderLeft: i > 0 ? "1px solid #D9D2C2" : undefined,
                background: "#FFFFFF",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8E867A",
                  margin: "0 0 8px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "40px",
                  fontWeight: 300,
                  color: "#1A1A1A",
                  margin: "0 0 4px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: stat.up ? "#1F3A2E" : "#6B6258",
                  margin: 0,
                }}
              >
                {stat.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Department breakdown */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 400,
            fontSize: "22px",
            color: "#1A1A1A",
            margin: "0 0 16px",
          }}
        >
          By department
        </h2>
        <div
          style={{
            border: "1px solid #D9D2C2",
            background: "#FFFFFF",
          }}
        >
          {deptBreakdown.map((d, i) => (
            <div
              key={d.dept}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 20px",
                borderBottom:
                  i < deptBreakdown.length - 1 ? "1px solid #D9D2C2" : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: d.color,
                  minWidth: "120px",
                }}
              >
                {d.dept}
              </span>
              <div style={{ flex: 1, position: "relative" }}>
                <div
                  style={{
                    height: "6px",
                    background: "#EEE8D8",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(d.count / 24) * 100}%`,
                      background: d.color,
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "20px",
                  color: "#1A1A1A",
                  minWidth: "28px",
                  textAlign: "right",
                }}
              >
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
