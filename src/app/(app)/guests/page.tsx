import { SEED_GUESTS } from "@/lib/seed";
import type { GuestTier } from "@/lib/types";

const TIER_STYLES: Record<GuestTier, { bg: string; color: string }> = {
  Pinnacle: { bg: "#FDF3DC", color: "#8A6F2E" },
  Élevé: { bg: "#E8F0EB", color: "#2A5240" },
  Standard: { bg: "var(--rw-parchment-3)", color: "var(--rw-ink-muted)" },
};

const STATUS_COLOR: Record<string, string> = {
  "Checked In": "var(--priority-low)",
  "VIP Arrival": "var(--rw-gold-dim)",
  Departing: "var(--rw-ink-faint)",
};

export default function GuestsPage() {
  return (
    <div>
      <h2 className="rw-display" style={{ fontSize: 28, marginBottom: 24 }}>
        In-House Guests
      </h2>

      <div
        style={{
          background: "var(--rw-parchment-2)",
          border: "1px solid var(--rw-border)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 100px 110px 1fr 120px",
            gap: 16,
            padding: "10px 20px",
            borderBottom: "1px solid var(--rw-border-med)",
          }}
        >
          {["Room", "Guest", "Tier", "Status", "Preferences", "Languages"].map((h) => (
            <span key={h} className="rw-label">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {SEED_GUESTS.map((guest, i) => {
          const tier = TIER_STYLES[guest.tier];
          return (
            <div
              key={guest.room}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 100px 110px 1fr 120px",
                gap: 16,
                padding: "14px 20px",
                borderBottom:
                  i < SEED_GUESTS.length - 1 ? "1px solid var(--rw-border)" : "none",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 20,
                  fontWeight: 300,
                  color: "var(--rw-ink)",
                }}
              >
                {guest.room}
              </span>
              <span style={{ fontSize: 13, color: "var(--rw-ink)" }}>{guest.name}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: tier.color,
                  background: tier.bg,
                  padding: "3px 8px",
                  borderRadius: 2,
                  display: "inline-block",
                }}
              >
                {guest.tier}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: STATUS_COLOR[guest.status] ?? "var(--rw-ink-muted)",
                }}
              >
                {guest.status}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--rw-ink-muted)",
                  lineHeight: 1.4,
                }}
              >
                {guest.preferences}
              </span>
              <span style={{ fontSize: 12, color: "var(--rw-ink-faint)" }}>
                {guest.languages}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
