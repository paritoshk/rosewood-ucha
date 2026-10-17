"use client";

import { useRef } from "react";
import MorphOrb, { type MorphOrbAnswer } from "@/components/ui/ai-thinking-orb-and-input";
import { useDispatch } from "@/context/DispatchContext";
import type { DispatchRequest } from "@/lib/types";

const DEPT_LABELS: Record<string, string> = {
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
  front_desk: "Front Desk",
  concierge: "Concierge",
};

const SUGGESTIONS = [
  "What's urgent right now?",
  "Room 1207 needs extra pillows",
  "The TV in 318 won't turn on",
  "What's pending for housekeeping?",
];

type AskResponse = {
  reply?: string;
  request?: DispatchRequest;
  acknowledgment?: string;
  error?: string;
};

// Typed Üchá: same brain as push-to-talk (/api/voice), rendered through the
// MorphOrb. Questions come back as an answer card; new requests are added to
// the dispatch board and confirmed on the card.
export default function AskPage() {
  const { addRequest } = useDispatch();
  // Prior turns, so follow-ups like "assign that to maintenance" have context.
  const historyRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const ask = async (text: string): Promise<MorphOrbAnswer> => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, history: historyRef.current }),
      });
      const data = (await res.json()) as AskResponse;
      if (!res.ok || data.error) {
        return { title: "Üchá", body: data.error ?? "Something went wrong — try again." };
      }

      let answer: MorphOrbAnswer;
      if (data.request) {
        const r = data.request;
        addRequest(r);
        const room = r.room && r.room !== "—" ? ` · Room ${r.room}` : "";
        answer = {
          title: `Dispatched · ${DEPT_LABELS[r.department] ?? r.department}${room}`,
          body: `${data.acknowledgment ?? r.summary} ETA ${r.eta}.`,
        };
      } else {
        answer = { title: "Üchá", body: data.reply ?? "" };
      }

      historyRef.current = [
        ...historyRef.current,
        { role: "user" as const, content: text },
        { role: "assistant" as const, content: answer.body },
      ].slice(-12);
      return answer;
    } catch {
      return { title: "Üchá", body: "I couldn't reach the server — check your connection and try again." };
    }
  };

  return (
    <div className="ask-page">
      <div className="ask-head">
        <div
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: 40,
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--rw-parchment)",
            letterSpacing: "0.02em",
          }}
        >
          Ask Üchá
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: "rgba(244,239,228,0.55)" }}>
          Ask about the live board, or type a request to dispatch it.
        </div>
      </div>
      <MorphOrb
        onSubmit={ask}
        minThinkMs={1800}
        suggestions={SUGGESTIONS}
        copy={{ placeholder: "Ask Üchá or log a request…", answerTitle: "Üchá" }}
      />
    </div>
  );
}
