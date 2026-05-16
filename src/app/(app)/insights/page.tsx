const METRICS = [
  { label: "Requests Today", value: "47", sub: "+12% vs yesterday" },
  { label: "Avg Response", value: "14m", sub: "Target: < 20m" },
  { label: "Resolution Rate", value: "91%", sub: "38 of 42 closed" },
  { label: "Active Guests", value: "7", sub: "of 112 rooms occupied" },
];

const DEPT_BREAKDOWN: { dept: string; count: number; color: string }[] = [
  { dept: "Housekeeping", count: 18, color: "var(--dept-housekeeping)" },
  { dept: "Front Desk", count: 12, color: "var(--dept-front_desk)" },
  { dept: "Maintenance", count: 10, color: "var(--dept-maintenance)" },
  { dept: "Concierge", count: 7, color: "var(--dept-concierge)" },
];

const TOTAL_DEPT = DEPT_BREAKDOWN.reduce((s, d) => s + d.count, 0);

const HOURLY: { hour: string; count: number }[] = [
  { hour: "06:00", count: 2 },
  { hour: "08:00", count: 7 },
  { hour: "10:00", count: 9 },
  { hour: "12:00", count: 5 },
  { hour: "14:00", count: 11 },
  { hour: "16:00", count: 6 },
  { hour: "18:00", count: 4 },
  { hour: "20:00", count: 3 },
];

const HOURLY_MAX = Math.max(...HOURLY.map((h) => h.count));

export default function InsightsPage() {
  return (
    <div>
      <h2 className="rw-display" style={{ fontSize: 28, marginBottom: 24 }}>
        Insights
      </h2>

      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {METRICS.map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              background: "var(--rw-parchment-2)",
              border: "1px solid var(--rw-border)",
              borderRadius: 4,
              padding: 20,
            }}
          >
            <p className="rw-display" style={{ fontSize: 40, marginBottom: 4 }}>
              {value}
            </p>
            <p className="rw-label" style={{ marginBottom: 4 }}>
              {label}
            </p>
            <p style={{ fontSize: 11, color: "var(--rw-ink-faint)" }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Hourly volume */}
        <div
          style={{
            background: "var(--rw-parchment-2)",
            border: "1px solid var(--rw-border)",
            borderRadius: 4,
            padding: 24,
          }}
        >
          <p className="rw-label" style={{ marginBottom: 20 }}>
            Hourly Volume
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
            {HOURLY.map(({ hour, count }) => (
              <div
                key={hour}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: "100%",
                    background: "var(--rw-green)",
                    borderRadius: 2,
                    height: `${(count / HOURLY_MAX) * 100}px`,
                    opacity: 0.75,
                    transition: "height 0.2s",
                  }}
                />
                <span style={{ fontSize: 9, color: "var(--rw-ink-faint)", whiteSpace: "nowrap" }}>
                  {hour}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Department breakdown */}
        <div
          style={{
            background: "var(--rw-parchment-2)",
            border: "1px solid var(--rw-border)",
            borderRadius: 4,
            padding: 24,
          }}
        >
          <p className="rw-label" style={{ marginBottom: 20 }}>
            By Department
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {DEPT_BREAKDOWN.map(({ dept, count, color }) => {
              const pct = Math.round((count / TOTAL_DEPT) * 100);
              return (
                <div key={dept}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--rw-ink)" }}>{dept}</span>
                    <span style={{ fontSize: 12, color: "var(--rw-ink-muted)" }}>
                      {count} <span style={{ color: "var(--rw-ink-faint)" }}>({pct}%)</span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: 3,
                      background: "var(--rw-border)",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
