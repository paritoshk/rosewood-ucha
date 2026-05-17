"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State = "idle" | "recording" | "processing" | "done";

const DEMO_TRANSCRIPT =
  "Room 412 needs extra towels and a bottle of still water. Guest has a nut allergy — please note on the profile.";

export function PushToTalk() {
  const [state, setState] = useState<State>("idle");
  const [transcript, setTranscript] = useState("");
  const [level, setLevel] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(() => {
    if (state !== "idle") return;
    setState("recording");
    setTranscript("");

    levelRef.current = setInterval(() => {
      setLevel(Math.random() * 0.8 + 0.2);
    }, 80);
  }, [state]);

  const stopRecording = useCallback(() => {
    if (state !== "recording") return;
    if (levelRef.current) clearInterval(levelRef.current);
    setLevel(0);
    setState("processing");

    timerRef.current = setTimeout(() => {
      setTranscript(DEMO_TRANSCRIPT);
      setState("done");
    }, 1200);
  }, [state]);

  const reset = useCallback(() => {
    setState("idle");
    setTranscript("");
    setLevel(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        startRecording();
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") {
        stopRecording();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (levelRef.current) clearInterval(levelRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      {/* State label */}
      <p
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color:
            state === "recording"
              ? "#B23A2E"
              : state === "processing"
                ? "#B8893B"
                : "#8E867A",
          margin: 0,
          height: "16px",
        }}
      >
        {state === "idle" && "Hold to speak · Space bar"}
        {state === "recording" && "● Recording"}
        {state === "processing" && "Processing…"}
        {state === "done" && ""}
      </p>

      {/* Button */}
      {state !== "done" && (
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          onTouchStart={(e) => {
            e.preventDefault();
            startRecording();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopRecording();
          }}
          aria-label="Push to talk"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border:
              state === "recording"
                ? "2px solid #B23A2E"
                : state === "processing"
                  ? "2px solid #B8893B"
                  : "1.5px solid #1A1A1A",
            background:
              state === "recording"
                ? "#B23A2E"
                : state === "processing"
                  ? "#EEE8D8"
                  : "#1A1A1A",
            color:
              state === "recording"
                ? "#FFFFFF"
                : state === "processing"
                  ? "#B8893B"
                  : "#F5F1E8",
            cursor: state === "processing" ? "default" : "pointer",
            display: "grid",
            placeItems: "center",
            transition: "background 0.15s, border 0.15s, transform 0.1s",
            transform:
              state === "recording" ? "scale(1.08)" : "scale(1)",
            userSelect: "none",
            WebkitUserSelect: "none",
            outline: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Pulse ring while recording */}
          {state === "recording" && (
            <span
              style={{
                position: "absolute",
                inset: "-8px",
                borderRadius: "50%",
                border: "1px solid #B23A2E",
                opacity: level * 0.6,
                pointerEvents: "none",
                transition: "opacity 0.08s",
              }}
            />
          )}
          <MicIcon state={state} />
        </button>
      )}

      {/* Level bars */}
      {state === "recording" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "3px",
            height: "24px",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: `${Math.max(4, Math.round(level * 24 * (((Math.sin(i * 1.8) + 1) / 2) * 0.5 + 0.5)))}px`,
                background: "#B23A2E",
                borderRadius: "1.5px",
                transition: "height 0.08s",
                opacity: 0.6 + level * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript result */}
      {state === "done" && transcript && (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #D9D2C2",
            padding: "24px",
            maxWidth: "480px",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8E867A",
              margin: "0 0 12px",
            }}
          >
            Transcribed · Confirm and dispatch
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#1A1A1A",
              lineHeight: 1.55,
              margin: "0 0 20px",
            }}
          >
            {transcript}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => alert("Dispatched to Housekeeping — Room 412")}
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#F5F1E8",
                background: "#1F3A2E",
                border: "none",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Send to Housekeeping →
            </button>
            <button
              onClick={reset}
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6B6258",
                background: "transparent",
                border: "1px solid #D9D2C2",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MicIcon({ state }: { state: State }) {
  if (state === "processing") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ animation: "spin 1s linear infinite" }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
      </svg>
    );
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2v8m0 0a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3Zm6 0v1a6 6 0 0 1-12 0v-1m6 7v4m-4 0h8" />
    </svg>
  );
}
