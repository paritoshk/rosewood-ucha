"use client";

import { useRef, useState } from "react";
import { IconMicrophone, IconLoader2 } from "@tabler/icons-react";
import { useDispatch } from "@/context/DispatchContext";
import type { DispatchRequest } from "@/lib/types";

const MIN_HOLD_MS = 400;

/**
 * Compact push-to-talk control for the TopBar. True hold-to-talk: recording runs
 * only while the pointer is held. Pointer capture keeps the release reliable even
 * if the cursor leaves the button; a minimum-hold guard discards stray clicks so
 * we never send empty audio to the transcriber.
 */
export function VoiceButton() {
  const {
    addRequest,
    isRecording,
    setIsRecording,
    isProcessing,
    setIsProcessing,
    setLastTranscript,
  } = useDispatch();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const activeRef = useRef(false);
  const pressStartRef = useRef(0);
  const discardRef = useRef(false);
  const [hint, setHint] = useState("");

  async function playAcknowledgment(text: string) {
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const url = URL.createObjectURL(await res.blob());
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play().catch(() => {});
    } catch {
      /* TTS is non-critical */
    }
  }

  async function processAudio(blob: Blob) {
    setIsProcessing(true);
    setHint("");
    try {
      const fd = new FormData();
      fd.append("audio", blob, "recording.webm");
      const res = await fetch("/api/voice", { method: "POST", body: fd });
      const data = (await res.json()) as {
        request?: DispatchRequest;
        acknowledgment?: string;
        reply?: string;
        transcript?: string;
        error?: string;
      };
      if (!res.ok) {
        setHint(data?.error ?? "Something went wrong.");
        return;
      }
      if (data.transcript) setLastTranscript(data.transcript);
      if (data.request) {
        // A new service request — drop the card on the board.
        await addRequest(data.request);
        if (data.acknowledgment) await playAcknowledgment(data.acknowledgment);
      } else if (data.reply) {
        // A question or status remark — Üchá just answers, no card.
        await playAcknowledgment(data.reply);
      }
    } catch {
      setHint("Network error — try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function startHold(e: React.PointerEvent<HTMLButtonElement>) {
    if (isRecording || isProcessing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    activeRef.current = true;
    pressStartRef.current = Date.now();
    discardRef.current = false;
    setHint("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // Pointer was released before the mic opened — abort cleanly.
      if (!activeRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        setHint("Hold the button and speak.");
        return;
      }
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (discardRef.current) return;
        const blob = new Blob(chunksRef.current, { type: mime });
        if (blob.size < 1200) {
          setHint("Hold a little longer and speak.");
          return;
        }
        processAudio(blob);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setHint("Microphone access denied.");
      activeRef.current = false;
    }
  }

  function endHold() {
    if (!activeRef.current) return;
    activeRef.current = false;
    const held = Date.now() - pressStartRef.current;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      discardRef.current = held < MIN_HOLD_MS;
      if (discardRef.current) setHint("Hold to speak — press and keep holding.");
      recorder.stop();
    }
    recorderRef.current = null;
    setIsRecording(false);
  }

  const label = isProcessing
    ? "Routing…"
    : isRecording
      ? "Release to send"
      : "Hold to speak";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {hint && (
        <span className="rw-label" style={{ color: "var(--priority-urgent)", maxWidth: 220 }}>
          {hint}
        </span>
      )}
      <button
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        disabled={isProcessing}
        aria-label="Push to talk"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 30,
          padding: "0 12px",
          borderRadius: 9999,
          border: isRecording
            ? "1px solid var(--priority-urgent)"
            : "1px solid var(--rw-border-med)",
          background: isRecording
            ? "rgba(192,57,43,0.08)"
            : "var(--rw-parchment-2)",
          color: isRecording ? "var(--priority-urgent)" : "var(--rw-ink)",
          cursor: isProcessing ? "wait" : "pointer",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          userSelect: "none",
          touchAction: "none",
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        {isProcessing ? (
          <IconLoader2
            size={14}
            strokeWidth={1.8}
            style={{ animation: "spin 1s linear infinite" }}
          />
        ) : (
          <IconMicrophone size={14} strokeWidth={1.8} />
        )}
        {label}
      </button>
    </div>
  );
}
