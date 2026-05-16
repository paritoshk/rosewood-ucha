const GUESTS = [
  { id: "g-001", name: "James Chen", room: "412", checkIn: "May 14", checkOut: "May 18", requests: 3, preferences: ["Still water", "Nut allergy"] },
  { id: "g-002", name: "Eleanor Thornton", room: "218", checkIn: "May 15", checkOut: "May 17", requests: 1, preferences: ["Hypoallergenic bedding"] },
  { id: "g-003", name: "Adaeze & Chidi Okafor", room: "601", checkIn: "May 13", checkOut: "May 20", requests: 4, preferences: ["Champagne on arrival", "Late checkout"] },
  { id: "g-004", name: "Ji-yeon Park", room: "305", checkIn: "May 16", checkOut: "May 17", requests: 2, preferences: [] },
];

export default async function GuestsPage({
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
          {propertyLabel} &nbsp;/&nbsp; Guests
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
          Guests
        </h1>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 140px 100px 1fr",
            padding: "10px 36px",
            borderBottom: "1px solid #D9D2C2",
            background: "#EEE8D8",
          }}
        >
          {["Guest", "Room", "Stay", "Requests", "Preferences"].map((col) => (
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
          ))}
        </div>

        {GUESTS.map((guest, i) => (
          <div
            key={guest.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 140px 100px 1fr",
              padding: "14px 36px",
              borderBottom: i < GUESTS.length - 1 ? "1px solid #D9D2C2" : undefined,
              background: "#FFFFFF",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", color: "#1A1A1A", fontWeight: 500 }}>
              {guest.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "20px",
                color: "#1A1A1A",
              }}
            >
              {guest.room}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "#6B6258",
              }}
            >
              {guest.checkIn} → {guest.checkOut}
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                color: "#6B6258",
              }}
            >
              {guest.requests}
            </span>
            <span style={{ fontSize: "12.5px", color: "#6B6258" }}>
              {guest.preferences.length > 0
                ? guest.preferences.join(" · ")
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
