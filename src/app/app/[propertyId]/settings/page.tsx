import Link from "next/link";

const SETTINGS_SECTIONS = [
  {
    title: "Property",
    items: [
      { label: "Name & branding", desc: "Property name, timezone, logo" },
      { label: "Departments", desc: "Configure departments and routing rules" },
      { label: "Voice model", desc: "Whisper v3 · On-premise or cloud" },
      { label: "Integrations", desc: "PMS, PBX, and webhook connections" },
    ],
  },
  {
    title: "Access & identity",
    items: [
      { label: "Members", desc: "Invite, manage, and suspend team members" },
      { label: "Roles", desc: "Built-in roles and custom capability sets" },
      { label: "Invitations", desc: "Pending invitations" },
      { label: "SSO & SCIM", desc: "Okta, Google Workspace, Azure AD" },
    ],
  },
  {
    title: "Audit",
    items: [
      { label: "Audit log", desc: "All actions across this property" },
    ],
  },
];

export default async function SettingsPage({
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
          {propertyLabel} &nbsp;/&nbsp; Settings
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
          Settings
        </h1>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "32px 36px" }}>
        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: "36px" }}>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#8E867A",
                margin: "0 0 12px",
                paddingTop: "0",
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                border: "1px solid #D9D2C2",
                background: "#FFFFFF",
              }}
            >
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom:
                      i < section.items.length - 1
                        ? "1px solid #D9D2C2"
                        : undefined,
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#1A1A1A",
                        margin: "0 0 2px",
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#8E867A",
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <span style={{ color: "#D9D2C2", fontSize: "18px" }}>→</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <div style={{ paddingTop: "12px" }}>
          <Link
            href="/signin"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#B23A2E",
              textDecoration: "none",
              borderBottom: "1px solid #B23A2E",
              paddingBottom: "2px",
            }}
          >
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
