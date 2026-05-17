import {
  IconDatabase,
  IconUsers,
  IconMicrophone,
  IconRobot,
  IconCloud,
  IconMessage,
  IconShieldLock,
  IconChartBar,
} from "@tabler/icons-react";

const INTEGRATIONS = [
  {
    category: "Property Management",
    icon: IconDatabase,
    items: [
      {
        name: "Oracle OPERA",
        role: "PMS — reservations, guest profiles, folios",
        status: "Connected" as const,
      },
      {
        name: "Sabre SynXis",
        role: "CRS / GDS distribution",
        status: "Connected" as const,
      },
    ],
  },
  {
    category: "Guest Data & CRM",
    icon: IconUsers,
    items: [
      {
        name: "Salesforce (via Hapi)",
        role: "Guest-360 profiles, preferences, loyalty",
        status: "Connected" as const,
      },
      {
        name: "Cendyn",
        role: "CRM, campaign orchestration, eInsight",
        status: "Connected" as const,
      },
    ],
  },
  {
    category: "Voice & AI",
    icon: IconMicrophone,
    items: [
      {
        name: "ElevenLabs",
        role: "Speech-to-text (Scribe) + text-to-speech (Flash v2.5)",
        status: "Connected" as const,
      },
      {
        name: "Anthropic Claude",
        role: "Request routing, intent classification, tool-calling",
        status: "Connected" as const,
      },
    ],
  },
  {
    category: "Guest Experience",
    icon: IconMessage,
    items: [
      {
        name: "Canary Technologies",
        role: "Digital check-in, messaging, AI Voice & Webchat",
        status: "Available" as const,
      },
      {
        name: "Kipsu",
        role: "SMS / digital guest messaging",
        status: "Available" as const,
      },
    ],
  },
  {
    category: "Cloud & Data",
    icon: IconCloud,
    items: [
      {
        name: "AWS (via Hapi)",
        role: "Normalized PMS event streams, data lake",
        status: "Connected" as const,
      },
      {
        name: "Upstash Redis",
        role: "Real-time dispatch state, session store",
        status: "Connected" as const,
      },
    ],
  },
  {
    category: "Analytics & Privacy",
    icon: IconChartBar,
    items: [
      {
        name: "Adobe Analytics",
        role: "Web analytics, experience insights",
        status: "Available" as const,
      },
      {
        name: "OneTrust",
        role: "Consent & privacy management",
        status: "Available" as const,
      },
    ],
  },
  {
    category: "Security & Identity",
    icon: IconShieldLock,
    items: [
      {
        name: "SSO / IdP",
        role: "Federated authentication (per-property)",
        status: "Planned" as const,
      },
    ],
  },
  {
    category: "Operations AI",
    icon: IconRobot,
    items: [
      {
        name: "Üchá Dispatch",
        role: "Voice-first request routing, guest-360 enrichment",
        status: "Connected" as const,
      },
    ],
  },
] as const;

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Connected: { color: "#2E7D52", bg: "rgba(46,125,82,0.08)" },
  Available: { color: "#B5851A", bg: "rgba(181,133,26,0.08)" },
  Planned: { color: "#6B6560", bg: "rgba(107,101,96,0.08)" },
};

export default function IntegrationsPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p
          className="rw-label"
          style={{ marginBottom: 8 }}
        >
          Technology Stack
        </p>
        <h1
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: 36,
            fontWeight: 300,
            color: "var(--rw-ink)",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Integrations
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--rw-ink-muted)",
            marginTop: 8,
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          Üchá connects to the Rosewood technology ecosystem — from Oracle OPERA
          and Salesforce CRM to ElevenLabs voice AI — to route, enrich, and
          resolve every guest request.
        </p>
      </div>

      <div className="integrations-grid">
        {INTEGRATIONS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={group.category}
              style={{
                background: "var(--rw-parchment)",
                border: "1px solid var(--rw-border)",
                borderRadius: 4,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--rw-border)",
                }}
              >
                <GroupIcon
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--rw-green)" }}
                />
                <span className="rw-label">{group.category}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {group.items.map((item) => {
                  const status = STATUS_STYLES[item.status];
                  return (
                    <div key={item.name}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--rw-ink)",
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: status.color,
                            background: status.bg,
                            padding: "2px 8px",
                            borderRadius: 2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--rw-ink-faint)",
                          marginTop: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.role}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
