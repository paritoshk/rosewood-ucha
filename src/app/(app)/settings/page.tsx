import { SEED_STAFF } from "@/lib/seed";

const inputStyle: React.CSSProperties = {
  background: "var(--rw-parchment-2)",
  border: "1px solid var(--rw-border)",
  borderRadius: 2,
  padding: "8px 12px",
  fontFamily: "var(--font-geist-sans), sans-serif",
  fontSize: 13,
  color: "var(--rw-ink)",
  width: "100%",
  outline: "none",
};

const DEPT_COLORS: Record<string, string> = {
  "Front Desk": "var(--dept-front_desk)",
  Housekeeping: "var(--dept-housekeeping)",
  Maintenance: "var(--dept-maintenance)",
  Concierge: "var(--dept-concierge)",
};

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h2 className="rw-display" style={{ fontSize: 28, marginBottom: 32 }}>
        Settings
      </h2>

      {/* Property */}
      <section style={{ marginBottom: 48 }}>
        <p
          className="rw-label"
          style={{ marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid var(--rw-border)" }}
        >
          Property
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { label: "Property Name", value: "Rosewood Sand Hill" },
            { label: "Timezone", value: "America/Los_Angeles (PST)" },
            { label: "Voice Language", value: "English (US)" },
            { label: "Property Code", value: "RSH-001" },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="rw-label" style={{ display: "block", marginBottom: 6 }}>
                {label}
              </label>
              <input
                type="text"
                defaultValue={value}
                style={inputStyle}
                readOnly
              />
            </div>
          ))}
        </div>
      </section>

      {/* Staff roster */}
      <section>
        <p
          className="rw-label"
          style={{ marginBottom: 20, paddingBottom: 10, borderBottom: "1px solid var(--rw-border)" }}
        >
          Staff Roster
        </p>
        <div
          style={{
            background: "var(--rw-parchment-2)",
            border: "1px solid var(--rw-border)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              padding: "8px 16px",
              borderBottom: "1px solid var(--rw-border-med)",
            }}
          >
            {["Name", "Department", "Shift"].map((h) => (
              <span key={h} className="rw-label">
                {h}
              </span>
            ))}
          </div>
          {SEED_STAFF.map((s, i) => (
            <div
              key={s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "12px 16px",
                borderBottom:
                  i < SEED_STAFF.length - 1 ? "1px solid var(--rw-border)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--rw-ink)" }}>{s.name}</span>
              <span
                style={{
                  fontSize: 11,
                  color: DEPT_COLORS[s.department] ?? "var(--rw-ink-muted)",
                  fontWeight: 500,
                }}
              >
                {s.department}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--rw-ink-faint)",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {s.shift}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
