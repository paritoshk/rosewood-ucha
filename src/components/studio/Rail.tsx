"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    id: "dispatch",
    label: "Dispatch",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v8m0 0a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3Zm6 0v1a6 6 0 0 1-12 0v-1m6 7v4m-4 0h8" />
      </svg>
    ),
  },
  {
    id: "requests",
    label: "Requests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    id: "guests",
    label: "Guests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      </svg>
    ),
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M4 10h16M10 10v10" />
      </svg>
    ),
  },
  {
    id: "activity",
    label: "Activity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h4l3-7 4 14 3-7h4" />
      </svg>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 20V8m6 12V4m6 16v-9m4 9V12" />
      </svg>
    ),
  },
];

const SETTINGS_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);

export function Rail({ propertyId }: { propertyId: string }) {
  const pathname = usePathname();

  function isActive(id: string) {
    return pathname.startsWith(`/app/${propertyId}/${id}`);
  }

  return (
    <nav
      aria-label="Main navigation"
      style={{
        width: "60px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "16px",
        paddingBottom: "16px",
        gap: "4px",
        background: "#EEE8D8",
        borderRight: "1px solid #D9D2C2",
        height: "100%",
      }}
    >
      {/* Brand mark */}
      <Link
        href="/select-property"
        title="Property picker"
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "1.5px solid #1A1A1A",
          display: "grid",
          placeItems: "center",
          marginBottom: "16px",
          textDecoration: "none",
          flexShrink: 0,
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "12px",
          fontStyle: "italic",
          color: "#1A1A1A",
          lineHeight: 1,
        }}
      >
        Ü
      </Link>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.id);
        return (
          <Link
            key={item.id}
            href={`/app/${propertyId}/${item.id}`}
            title={item.label}
            style={{
              width: "40px",
              height: "40px",
              display: "grid",
              placeItems: "center",
              borderRadius: "8px",
              color: active ? "#F5F1E8" : "#6B6258",
              background: active ? "#1A1A1A" : "transparent",
              textDecoration: "none",
              flexShrink: 0,
              transition: "background 0.1s, color 0.1s",
            }}
          >
            <span
              style={{
                width: "18px",
                height: "18px",
                display: "block",
              }}
            >
              {item.icon}
            </span>
          </Link>
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Settings */}
      <Link
        href={`/app/${propertyId}/settings`}
        title="Settings"
        style={{
          width: "40px",
          height: "40px",
          display: "grid",
          placeItems: "center",
          borderRadius: "8px",
          color: isActive("settings") ? "#F5F1E8" : "#6B6258",
          background: isActive("settings") ? "#1A1A1A" : "transparent",
          textDecoration: "none",
          flexShrink: 0,
          transition: "background 0.1s, color 0.1s",
        }}
      >
        <span style={{ width: "18px", height: "18px", display: "block" }}>
          {SETTINGS_ICON}
        </span>
      </Link>

      {/* Avatar */}
      <Link
        href={`/app/${propertyId}/settings`}
        title="Account"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#1F3A2E",
          color: "#F5F1E8",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          textDecoration: "none",
          flexShrink: 0,
          marginTop: "4px",
          fontStyle: "italic",
        }}
      >
        N
      </Link>
    </nav>
  );
}
