"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconSpeakerphone,
  IconList,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";

const NAV_ITEMS = [
  { href: "/dispatch", icon: IconSpeakerphone, label: "Dispatch" },
  { href: "/activity", icon: IconList, label: "Activity" },
  { href: "/guests", icon: IconUsers, label: "Guests" },
  { href: "/settings", icon: IconSettings, label: "Settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 64,
        flexShrink: 0,
        background: "var(--rw-green)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom: 20,
      }}
    >
      {/* Monogram */}
      <div
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: 22,
          fontWeight: 300,
          color: "var(--rw-parchment)",
          letterSpacing: "0.06em",
          fontStyle: "italic",
          marginBottom: 32,
        }}
      >
        Ü
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={{
                width: 64,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderLeft: active
                  ? "2px solid var(--rw-parchment)"
                  : "2px solid transparent",
                opacity: active ? 1 : 0.5,
                transition: "opacity 0.15s, border-color 0.15s",
                color: "var(--rw-parchment)",
                textDecoration: "none",
              }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </Link>
          );
        })}
      </nav>

      {/* Property initial */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "1px solid rgba(244,239,228,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "rgba(244,239,228,0.6)",
        }}
      >
        R
      </div>
    </aside>
  );
}
