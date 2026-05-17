"use client";

import { useState } from "react";
import type { DispatchRequest } from "@/lib/types";

const DEPT_COLORS: Record<string, string> = {
  housekeeping: "var(--priority-normal)",
  maintenance: "var(--priority-urgent)",
  front_desk: "#7c6d5a",
  concierge: "var(--rw-gold)",
};

const DEPT_LABELS: Record<string, string> = {
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
  front_desk: "Front Desk",
  concierge: "Concierge",
};

// "Roger" — a male American voice, the hotel staff member calling in. Distinct
// from Lauren (Üchá) so the demo plays as a real two-person conversation.
const STAFF_VOICE = "CwhRBWXzGAHq8TQ4Fs17";

const SCENARIOS = [
  {
    id: 1,
    label: "Scenario 1",
    title: "Pinnacle Guest — Urgent Turndown",
    narration:
      "First, an urgent request for a Pinnacle guest. Listen as a staff member calls it in.",
    script:
      "Room 814 needs an urgent full turndown before the guest's dinner tonight at seven PM. Please send someone immediately.",
    context:
      "Pinnacle guest Mrs. Chen Wei. Watch the system auto-escalate priority and pull her preferences from the CRM.",
    icon: "🛏️",
  },
  {
    id: 2,
    label: "Scenario 2",
    title: "In-Room Safe Malfunction",
    narration:
      "Next, a maintenance issue — and the staff member adds a language request on top.",
    script:
      "The guest in room 1101 can't open the in-room safe. He's also asking for a German-speaking staff member if possible.",
    context:
      "Baron von Richter — Pinnacle tier. CRM preferences auto-surface. Maintenance routed with language note.",
    icon: "🔒",
  },
  {
    id: 3,
    label: "Scenario 3",
    title: "VIP Airport Transfer",
    narration:
      "And finally, a VIP airport transfer. Watch the concierge routing pull her car preference.",
    script:
      "Doctor Osei in room 1204 needs a Tesla or electric vehicle to SFO Terminal 3 tomorrow morning at five AM.",
    context:
      "Concierge routing. EV preference already in guest profile — watch it populate without Claude knowing.",
    icon: "🚗",
  },
];

type Step = "idle" | "tts" | "stt" | "routing" | "done" | "error";

const STEP_LABELS: Record<Step, string> = {
  idle: "Run scenario",
  tts: "Synthesizing voice…",
  stt: "Transcribing audio…",
  routing: "Routing with Claude…",
  done: "Done",
  error: "Failed",
};

interface Result {
  transcript: string;
  request: DispatchRequest;
}

export default function DemoPage() {
  const [steps, setSteps] = useState<Record<number, Step>>({});
  const [results, setResults] = useState<Record<number, Result>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [runningAll, setRunningAll] = useState(false);
  const [speaking, setSpeaking] = useState<{
    id: number;
    who: string;
    text: string;
  } | null>(null);

  function setStep(id: number, step: Step) {
    setSteps((s) => ({ ...s, [id]: step }));
  }

  // Synthesize `text` via /api/speak and play it to completion. `who` drives the
  // on-screen "speaking" indicator; omitting voiceId uses Lauren (Üchá).
  async function playClip(
    text: string,
    opts: { id: number; who: string; voiceId?: string },
  ): Promise<void> {
    if (!text?.trim()) return;
    setSpeaking({ id: opts.id, who: opts.who, text });
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          opts.voiceId ? { text, voice_id: opts.voiceId } : { text },
        ),
      });
      if (res.ok) {
        const url = URL.createObjectURL(await res.blob());
        await new Promise<void>((resolve) => {
          const audio = new Audio(url);
          let timer: ReturnType<typeof setTimeout>;
          const done = () => {
            clearTimeout(timer);
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.onended = done;
          audio.onerror = done;
          // Resolve right after the clip's real length even if `ended` is
          // flaky; a hard cap covers the case where metadata never loads.
          audio.onloadedmetadata = () => {
            if (Number.isFinite(audio.duration)) {
              clearTimeout(timer);
              timer = setTimeout(done, audio.duration * 1000 + 1500);
            }
          };
          timer = setTimeout(done, 25000);
          audio.play().catch(done);
        });
      }
    } catch {
      /* audio is non-critical — the pipeline still runs */
    } finally {
      setSpeaking(null);
    }
  }

  async function runScenario(
    scenario: (typeof SCENARIOS)[number],
  ): Promise<void> {
    const { id, script, narration } = scenario;
    const current = steps[id];
    if (current === "tts" || current === "stt" || current === "routing") return;

    setStep(id, "tts");
    setErrors((e) => {
      const n = { ...e };
      delete n[id];
      return n;
    });

    // Üchá narrates the scene, then the staff member speaks the request aloud —
    // two voices, a real conversation.
    await playClip(narration, { id, who: "Üchá" });
    await playClip(script, { id, who: "Staff", voiceId: STAFF_VOICE });

    setStep(id, "stt");
    await new Promise((r) => setTimeout(r, 400));
    setStep(id, "routing");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStep(id, "error");
        setErrors((e) => ({ ...e, [id]: data.error ?? "Unknown error" }));
        return;
      }
      setResults((r) => ({ ...r, [id]: data as Result }));
      setStep(id, "done");
      // Üchá reads her acknowledgment back — the other half of the conversation.
      await playClip((data as Result).request.acknowledgment ?? "", {
        id,
        who: "Üchá",
      });
    } catch {
      setStep(id, "error");
      setErrors((e) => ({ ...e, [id]: "Network error — check console" }));
    }
  }

  async function runAll() {
    if (runningAll) return;
    setRunningAll(true);
    for (const s of SCENARIOS) {
      await runScenario(s);
      await new Promise((r) => setTimeout(r, 600));
    }
    setRunningAll(false);
  }

  function reset() {
    setSteps({});
    setResults({});
    setErrors({});
    setRunningAll(false);
    setSpeaking(null);
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Faded brand monogram filling the side whitespace */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "min(88vh, 700px)",
          lineHeight: 1,
          color: "var(--rw-gold)",
          opacity: 0.05,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        R
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 900,
          padding: "40px 48px",
          fontFamily: "var(--font-geist-sans), sans-serif",
        }}
      >
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: 32,
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--rw-ink)",
            margin: 0,
            marginBottom: 8,
          }}
        >
          Live Demo
        </h1>
        <p style={{ fontSize: 13, color: "var(--rw-ink-muted)", margin: 0, lineHeight: 1.6 }}>
          Each scenario runs the full AI pipeline — ElevenLabs TTS synthesizes a staff voice, Scribe
          v1 transcribes it, Claude Haiku routes it, and the CRM enriches the card with guest data.
          Nothing is mocked.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            onClick={runAll}
            disabled={runningAll}
            style={{
              height: 36,
              padding: "0 20px",
              borderRadius: 6,
              border: "1px solid var(--rw-green)",
              background: "var(--rw-green)",
              color: "var(--rw-parchment)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: runningAll ? "wait" : "pointer",
              opacity: runningAll ? 0.7 : 1,
            }}
          >
            {runningAll ? "Running…" : "▶  Run All 3 Scenarios"}
          </button>
          <button
            onClick={reset}
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: 6,
              border: "1px solid var(--rw-border-med)",
              background: "transparent",
              color: "var(--rw-ink-muted)",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {SCENARIOS.map((scenario) => {
          const step = steps[scenario.id] ?? "idle";
          const result = results[scenario.id];
          const error = errors[scenario.id];
          const isActive = step === "tts" || step === "stt" || step === "routing";
          const isDone = step === "done";
          const isError = step === "error";

          return (
            <div
              key={scenario.id}
              style={{
                border: `1px solid ${isDone ? "var(--rw-border-med)" : isError ? "var(--priority-urgent)" : "var(--rw-border)"}`,
                borderRadius: 8,
                background: isDone ? "var(--rw-parchment-2)" : "var(--rw-parchment)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {/* Scenario header */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--rw-ink-faint)",
                      marginBottom: 4,
                    }}
                  >
                    {scenario.label}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--rw-ink)",
                      marginBottom: 6,
                    }}
                  >
                    {scenario.icon} {scenario.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--rw-ink-muted)",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    &ldquo;{scenario.script}&rdquo;
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      color: "var(--rw-ink-faint)",
                      lineHeight: 1.5,
                    }}
                  >
                    {scenario.context}
                  </div>
                </div>

                <button
                  onClick={() => runScenario(scenario)}
                  disabled={isActive || runningAll}
                  style={{
                    flexShrink: 0,
                    height: 32,
                    padding: "0 14px",
                    borderRadius: 6,
                    border: isDone
                      ? "1px solid var(--rw-border)"
                      : "1px solid var(--rw-green)",
                    background: isDone ? "transparent" : "var(--rw-green)",
                    color: isDone ? "var(--rw-ink-muted)" : "var(--rw-parchment)",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: isActive || runningAll ? "wait" : "pointer",
                    opacity: isActive || runningAll ? 0.6 : 1,
                    whiteSpace: "nowrap",
                    minWidth: 110,
                    textAlign: "center",
                  }}
                >
                  {isActive && (
                    <span style={{ marginRight: 4 }}>⟳</span>
                  )}
                  {isDone ? "✓ Re-run" : STEP_LABELS[step]}
                </button>
              </div>

              {/* Now-speaking indicator — which voice is talking + live text */}
              {speaking?.id === scenario.id && (
                <div
                  style={{
                    padding: "10px 20px",
                    borderTop: "1px solid var(--rw-border)",
                    color: "var(--rw-green)",
                    background: "rgba(46,125,82,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span style={{ animation: "ucha-pulse 1.3s infinite" }}>
                      🔊
                    </span>
                    {speaking.who === "Staff"
                      ? "Staff member speaking"
                      : "Üchá speaking"}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontStyle: "italic",
                      lineHeight: 1.5,
                      color: "var(--rw-ink)",
                    }}
                  >
                    &ldquo;{speaking.text}&rdquo;
                  </div>
                </div>
              )}

              {/* Pipeline steps indicator */}
              {(isActive || isDone) && (
                <div
                  style={{
                    padding: "8px 20px",
                    borderTop: "1px solid var(--rw-border)",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    background: "rgba(0,0,0,0.02)",
                  }}
                >
                  {(["tts", "stt", "routing"] as Step[]).map((s, i) => {
                    const stepOrder: Step[] = ["tts", "stt", "routing", "done"];
                    const currentIdx = stepOrder.indexOf(step);
                    const thisIdx = stepOrder.indexOf(s);
                    const isPast = isDone || currentIdx > thisIdx;
                    const isCurrent = currentIdx === thisIdx;

                    return (
                      <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {i > 0 && (
                          <span style={{ fontSize: 10, color: "var(--rw-ink-faint)" }}>→</span>
                        )}
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: isPast
                              ? "var(--rw-green)"
                              : isCurrent
                                ? "var(--rw-ink)"
                                : "var(--rw-ink-faint)",
                            fontWeight: isCurrent ? 600 : 400,
                          }}
                        >
                          {isPast ? "✓ " : ""}{STEP_LABELS[s]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Error */}
              {isError && error && (
                <div
                  style={{
                    padding: "10px 20px",
                    borderTop: "1px solid var(--priority-urgent)",
                    fontSize: 12,
                    color: "var(--priority-urgent)",
                    background: "rgba(192,57,43,0.04)",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Result card */}
              {isDone && result && (
                <div
                  style={{
                    padding: "12px 20px 16px",
                    borderTop: "1px solid var(--rw-border)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px 24px",
                  }}
                >
                  <div>
                    <div className="rw-label" style={{ marginBottom: 3 }}>
                      Transcript (Scribe v1)
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--rw-ink)",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      &ldquo;{result.transcript}&rdquo;
                    </div>
                  </div>

                  <div>
                    <div className="rw-label" style={{ marginBottom: 3 }}>
                      Routing (Claude {result.request.department && "→ "}
                      <span
                        style={{
                          color: DEPT_COLORS[result.request.department] ?? "inherit",
                          textTransform: "capitalize",
                        }}
                      >
                        {DEPT_LABELS[result.request.department] ?? result.request.department}
                      </span>
                      )
                    </div>
                    <div
                      style={{ fontSize: 12, color: "var(--rw-ink)", lineHeight: 1.5 }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "1px 6px",
                          borderRadius: 3,
                          marginRight: 6,
                          background:
                            result.request.priority === "urgent"
                              ? "rgba(192,57,43,0.1)"
                              : result.request.priority === "normal"
                                ? "rgba(44,98,90,0.1)"
                                : "rgba(0,0,0,0.06)",
                          color:
                            result.request.priority === "urgent"
                              ? "var(--priority-urgent)"
                              : result.request.priority === "normal"
                                ? "var(--priority-normal)"
                                : "var(--rw-ink-muted)",
                        }}
                      >
                        {result.request.priority}
                        {result.request.escalated && " ↑"}
                      </span>
                      {result.request.summary}
                    </div>
                  </div>

                  {result.request.guestName && (
                    <div>
                      <div className="rw-label" style={{ marginBottom: 3 }}>
                        CRM Enrichment
                      </div>
                      <div style={{ fontSize: 12, color: "var(--rw-ink)", lineHeight: 1.5 }}>
                        {result.request.guestName} ·{" "}
                        <span style={{ color: "var(--rw-gold)" }}>{result.request.guestTier}</span>
                        {result.request.guestPrefs && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--rw-ink-muted)",
                              marginTop: 2,
                            }}
                          >
                            {result.request.guestPrefs}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {result.request.acknowledgment && (
                    <div>
                      <div className="rw-label" style={{ marginBottom: 3 }}>
                        Acknowledgment (Lauren / ElevenLabs)
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--rw-ink)",
                          fontStyle: "italic",
                          lineHeight: 1.5,
                        }}
                      >
                        &ldquo;{result.request.acknowledgment}&rdquo;
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: 36,
          paddingTop: 20,
          borderTop: "1px solid var(--rw-border)",
          fontSize: 11,
          color: "var(--rw-ink-faint)",
          lineHeight: 1.7,
        }}
      >
        Cards appear on the{" "}
        <a href="/dispatch" style={{ color: "var(--rw-green)", textDecoration: "none" }}>
          Dispatch board
        </a>{" "}
        in real time. For a live demo, use the <strong>Hold to speak</strong> button in the top bar
        — hold it, speak any hotel request, release, and the full pipeline runs with your voice.
      </div>
      </div>
    </div>
  );
}
