const ROOMS = [
  { number: "101", status: "occupied", guest: "Smith" },
  { number: "102", status: "vacant", guest: null },
  { number: "103", status: "maintenance", guest: null },
  { number: "104", status: "occupied", guest: "Johnson" },
  { number: "201", status: "occupied", guest: "Lee" },
  { number: "202", status: "vacant", guest: null },
  { number: "203", status: "occupied", guest: "Brown" },
  { number: "204", status: "checkout", guest: "Davis" },
  { number: "218", status: "occupied", guest: "Thornton" },
  { number: "301", status: "occupied", guest: "Wilson" },
  { number: "302", status: "vacant", guest: null },
  { number: "303", status: "occupied", guest: "Taylor" },
  { number: "305", status: "occupied", guest: "Park" },
  { number: "401", status: "vacant", guest: null },
  { number: "402", status: "occupied", guest: "Anderson" },
  { number: "403", status: "maintenance", guest: null },
  { number: "412", status: "occupied", guest: "Chen" },
  { number: "501", status: "occupied", guest: "Martinez" },
  { number: "502", status: "checkout", guest: "Williams" },
  { number: "601", status: "occupied", guest: "Okafor" },
  { number: "602", status: "vacant", guest: null },
];

const STATUS_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  occupied: { bg: "#F5F1E8", border: "#1F3A2E", label: "Occupied" },
  vacant: { bg: "#FFFFFF", border: "#D9D2C2", label: "Vacant" },
  maintenance: { bg: "#FFF8F0", border: "#B8893B", label: "Maintenance" },
  checkout: { bg: "#FFF5F5", border: "#D9D2C2", label: "Checkout" },
};

export default async function RoomsPage({
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
            {propertyLabel} &nbsp;/&nbsp; Rooms
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
            Rooms
          </h1>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {Object.entries(STATUS_COLORS).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  border: `1.5px solid ${val.border}`,
                  background: val.bg,
                  display: "block",
                  borderRadius: "2px",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8E867A",
                }}
              >
                {val.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "32px 36px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "8px",
          }}
        >
          {ROOMS.map((room) => {
            const colors = STATUS_COLORS[room.status];
            return (
              <div
                key={room.number}
                style={{
                  border: `1.5px solid ${colors.border}`,
                  background: colors.bg,
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                    lineHeight: 1,
                  }}
                >
                  {room.number}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "8px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: colors.border,
                  }}
                >
                  {room.guest ?? room.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
