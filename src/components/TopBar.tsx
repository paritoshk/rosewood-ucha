"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconPlayerPlay } from "@tabler/icons-react";
import { VoiceButton } from "@/components/VoiceButton";
import { ConversationButton } from "@/components/ConversationButton";

const PAGE_NAMES: Record<string, string> = {
  "/dispatch": "Dispatch",
  "/activity": "Activity",
  "/guests": "Guests",
  "/settings": "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [voiceMode, setVoiceMode] = useState<"push" | "live">("push");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pageName = PAGE_NAMES[pathname] ?? "";

  return (
    <header
      style={{
        height: 48,
        flexShrink: 0,
        background: "var(--rw-parchment)",
        borderBottom: "1px solid var(--rw-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: 16,
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--rw-ink)",
          }}
        >
          Üchá
        </span>
        {pageName && (
          <>
            <span style={{ fontSize: 12, color: "var(--rw-ink-faint)", margin: "0 2px" }}>
              /
            </span>
            <span
              style={{
                fontSize: 13,
                color: "var(--rw-ink-muted)",
                fontFamily: "var(--font-geist-sans), sans-serif",
              }}
            >
              {pageName}
            </span>
          </>
        )}
      </div>

      {/* Clock */}
      <div
        style={{
          fontSize: 14,
          fontFamily: "var(--font-geist-mono), monospace",
          letterSpacing: "0.08em",
          color: "var(--rw-ink-muted)",
          minWidth: 100,
          textAlign: "center",
        }}
      >
        {time}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link
          href="/demo"
          className="rw-btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <IconPlayerPlay size={10} />
          Demo Mode
        </Link>

        {/* Voice control — hold-to-talk by default, live agent on toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {voiceMode === "push" ? <VoiceButton /> : <ConversationButton />}
          <button
            className="rw-btn-ghost"
            onClick={() => setVoiceMode((m) => (m === "push" ? "live" : "push"))}
            title={
              voiceMode === "push"
                ? "Switch to the live Üchá agent"
                : "Switch to hold-to-talk"
            }
          >
            {voiceMode === "push" ? "Live agent" : "Hold to speak"}
          </button>
        </div>

        <span className="rw-label" style={{ opacity: 0.6 }}>
          Rosewood Sand Hill
        </span>
      </div>
    </header>
  );
}
