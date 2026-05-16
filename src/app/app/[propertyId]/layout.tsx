import { Rail } from "@/components/studio/Rail";

const DEMO_PROPERTIES = new Set(["rosewood-sand-hill"]);

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const isDemoMode = DEMO_PROPERTIES.has(propertyId);

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#F5F1E8",
      }}
    >
      {/* Demo banner */}
      {isDemoMode && (
        <div
          style={{
            borderBottom: "1px solid #D9D2C2",
            padding: "6px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#EEE8D8",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B8893B",
            }}
          >
            Demo mode · Rosewood Sand Hill · No data is stored
          </span>
        </div>
      )}

      {/* Shell */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Rail propertyId={propertyId} />

        {/* Canvas */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
