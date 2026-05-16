"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconSpeakerphone,
  IconList,
  IconUsers,
  IconSettings,
  IconPlayerPlay,
  IconLoader2,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";

const DEMO_SCRIPT = [
  {
    department: "housekeeping" as const,
    priority: "urgent" as const,
    summary: "Guest requests immediate room refresh before dinner",
    room: "814",
    guestName: "Mrs. Chen Wei",
    guestTier: "Pinnacle" as const,
    guestPrefs: "Hypoallergenic bedding, no fragrance",
    status: "pending" as const,
    eta: "5 min",
    transcript: "Room 814 needs an urgent turndown before the Fontaines arrive for dinner.",
    acknowledgment: "Urgent turndown dispatched to room 814. Team is on their way.",
  },
  {
    department: "concierge" as const,
    priority: "normal" as const,
    summary: "Arrange Tesla transfer to SFO Terminal 3, 5AM tomorrow",
    room: "1204",
    guestName: "Dr. Amara Osei",
    guestTier: "Pinnacle" as const,
    guestPrefs: "Quiet floor, high level",
    status: "pending" as const,
    eta: "Confirmed",
    transcript: "Dr. Osei in 1204 needs a car to the airport tomorrow morning, 5AM, Terminal 3.",
    acknowledgment: "Tesla transfer to SFO Terminal 3 confirmed for 5AM. Dr. Osei is all set.",
  },
  {
    department: "maintenance" as const,
    priority: "urgent" as const,
    summary: "Flooding under bathroom sink, water pooling on floor",
    room: "612",
    guestName: "",
    guestTier: "Standard" as const,
    guestPrefs: "",
    status: "pending" as const,
    eta: "5 min",
    transcript: "Room 612 has water coming from under the sink, there's pooling on the bathroom floor.",
    acknowledgment: "Maintenance dispatched to 612 immediately. We're on it.",
  },
];

const NAV_ITEMS = [
  { href: "/dispatch", icon: IconSpeakerphone, label: "Dispatch" },
  { href: "/activity", icon: IconList, label: "Activity" },
  { href: "/guests", icon: IconUsers, label: "Guests" },
  { href: "/settings", icon: IconSettings, label: "Settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [running, setRunning] = useState(false);

  async function runDemo() {
    if (running) return;
    setRunning(true);
    try {
      for (const step of DEMO_SCRIPT) {
        const request = { ...step, id: nanoid(), createdAt: new Date().toISOString() };
        await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        await new Promise((r) => setTimeout(r, 1200));
      }
    } finally {
      setRunning(false);
    }
  }

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

      {/* Bottom controls */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {/* Launch Demo */}
        <button
          onClick={runDemo}
          disabled={running}
          title="Launch Demo"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(244,239,228,0.35)",
            background: running ? "rgba(244,239,228,0.12)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: running ? "wait" : "pointer",
            color: "var(--rw-parchment)",
            opacity: running ? 0.7 : 1,
            transition: "background 0.15s, opacity 0.15s",
          }}
        >
          {running ? (
            <IconLoader2 size={14} strokeWidth={1.5} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <IconPlayerPlay size={14} strokeWidth={1.5} />
          )}
        </button>

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
      </div>
    </aside>
  );
}
