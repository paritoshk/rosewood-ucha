import { SEED_GUESTS } from "@/lib/seed";

const FLOOR_SECTIONS = [5, 6, 7, 8, 9, 10, 11, 12];

const ROOM_SEEDS: Record<string, { type: string; beds: string }> = {
  "502": { type: "Deluxe King", beds: "King" },
  "613": { type: "Classic Queen", beds: "Queen" },
  "709": { type: "Premier Suite", beds: "King + Sofa" },
  "814": { type: "Deluxe King", beds: "King" },
  "1101": { type: "Pinnacle Suite", beds: "King + Parlour" },
  "1204": { type: "Corner King", beds: "King" },
};

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  occupied: { color: "var(--priority-low)", label: "Occupied" },
  vacant: { color: "var(--rw-ink-faint)", label: "Vacant" },
  departing: { color: "var(--rw-gold-dim)", label: "Departing" },
  maintenance: { color: "var(--priority-normal)", label: "Maintenance" },
};

const OCCUPIED_ROOMS = new Set(
  SEED_GUESTS.filter((g) => g.status !== "Departing").map((g) => g.room)
);
const DEPARTING_ROOMS = new Set(
  SEED_GUESTS.filter((g) => g.status === "Departing").map((g) => g.room)
);

function getRoomStatus(room: string) {
  if (DEPARTING_ROOMS.has(room)) return "departing";
  if (OCCUPIED_ROOMS.has(room)) return "occupied";
  return "vacant";
}

const ALL_ROOMS = FLOOR_SECTIONS.flatMap((floor) =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => {
    const num = `${floor}${String(n).padStart(2, "0")}`;
    return {
      room: num,
      floor,
      type: ROOM_SEEDS[num]?.type ?? (n <= 4 ? "Deluxe King" : n <= 10 ? "Classic Queen" : "Premium Twin"),
      beds: ROOM_SEEDS[num]?.beds ?? (n <= 4 ? "King" : n <= 10 ? "Queen" : "Twin"),
      status: getRoomStatus(num),
      guest: SEED_GUESTS.find((g) => g.room === num),
    };
  })
);

const SUMMARY = {
  total: ALL_ROOMS.length,
  occupied: ALL_ROOMS.filter((r) => r.status === "occupied").length,
  departing: ALL_ROOMS.filter((r) => r.status === "departing").length,
  vacant: ALL_ROOMS.filter((r) => r.status === "vacant").length,
};

export default function RoomsPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 32, marginBottom: 24 }}>
        <h2 className="rw-display" style={{ fontSize: 28, margin: 0 }}>
          Rooms
        </h2>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Total", value: SUMMARY.total },
            { label: "Occupied", value: SUMMARY.occupied, color: "var(--priority-low)" },
            { label: "Departing", value: SUMMARY.departing, color: "var(--rw-gold-dim)" },
            { label: "Vacant", value: SUMMARY.vacant, color: "var(--rw-ink-faint)" },
          ].map(({ label, value, color }) => (
            <span key={label} style={{ fontSize: 12, color: "var(--rw-ink-muted)" }}>
              <span style={{ color: color ?? "var(--rw-ink)", fontWeight: 500 }}>{value}</span>{" "}
              {label}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "var(--rw-parchment-2)",
          border: "1px solid var(--rw-border)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 50px 1fr 120px 120px 1fr",
            gap: 16,
            padding: "10px 20px",
            borderBottom: "1px solid var(--rw-border-med)",
          }}
        >
          {["Room", "Floor", "Type", "Beds", "Status", "Guest"].map((h) => (
            <span key={h} className="rw-label">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {ALL_ROOMS.map((r, i) => {
          const st = STATUS_STYLES[r.status];
          return (
            <div
              key={r.room}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 50px 1fr 120px 120px 1fr",
                gap: 16,
                padding: "12px 20px",
                borderBottom:
                  i < ALL_ROOMS.length - 1 ? "1px solid var(--rw-border)" : "none",
                alignItems: "center",
                opacity: r.status === "vacant" ? 0.65 : 1,
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
                {r.room}
              </span>
              <span style={{ fontSize: 12, color: "var(--rw-ink-muted)" }}>{r.floor}</span>
              <span style={{ fontSize: 13, color: "var(--rw-ink)" }}>{r.type}</span>
              <span style={{ fontSize: 12, color: "var(--rw-ink-muted)" }}>{r.beds}</span>
              <span style={{ fontSize: 11, color: st.color }}>{st.label}</span>
              <span style={{ fontSize: 12, color: "var(--rw-ink-muted)" }}>
                {r.guest ? r.guest.name : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
