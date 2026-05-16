import Link from "next/link";

const DEMO_PROPERTIES = [
  {
    id: "rosewood-sand-hill",
    name: "Rosewood Sand Hill",
    location: "Menlo Park, CA",
    role: "Manager",
    lastActive: "Active now",
    demo: true,
  },
  {
    id: "rosewood-london",
    name: "Rosewood London",
    location: "London, UK",
    role: "Admin",
    lastActive: "2 days ago",
    demo: false,
  },
];

export default function SelectPropertyPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F5F1E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "28px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "#1A1A1A",
          textDecoration: "none",
          marginBottom: "48px",
          display: "block",
        }}
      >
        Üchá
      </Link>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 400,
            fontSize: "36px",
            letterSpacing: "-0.01em",
            margin: "0 0 6px",
          }}
        >
          Select a property
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6B6258",
            margin: "0 0 28px",
          }}
        >
          You have access to {DEMO_PROPERTIES.length} properties.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            border: "1px solid #D9D2C2",
          }}
        >
          {DEMO_PROPERTIES.map((property, i) => (
            <Link
              key={property.id}
              href={`/app/${property.id}/dispatch`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                background: "#FFFFFF",
                borderTop: i > 0 ? "1px solid #D9D2C2" : undefined,
                textDecoration: "none",
                transition: "background 0.1s",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#1A1A1A",
                    }}
                  >
                    {property.name}
                  </span>
                  {property.demo && (
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#B8893B",
                        border: "1px solid #B8893B",
                        padding: "2px 6px",
                      }}
                    >
                      Demo
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "#8E867A",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {property.location} · {property.role}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    color: "#8E867A",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {property.lastActive}
                </p>
                <span
                  style={{
                    fontSize: "18px",
                    color: "#D9D2C2",
                  }}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "13px",
            color: "#8E867A",
          }}
        >
          <Link
            href="/signin"
            style={{ color: "#6B6258", textDecoration: "none" }}
          >
            ← Sign in to a different account
          </Link>
        </p>
      </div>
    </div>
  );
}
