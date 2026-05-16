"use client";

import { useRef } from "react";
import { IconMicrophone, IconLoader2 } from "@tabler/icons-react";
import { useDispatch } from "@/context/DispatchContext";
import type { DispatchRequest } from "@/lib/types";

export function VoiceButton() {
  const { addRequest, isRecording, setIsRecording, isProcessing, setIsProcessing } =
    useDispatch();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (isRecording || isProcessing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsProcessing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const fd = new FormData();
          fd.append("audio", blob, "recording.webm");
          const res = await fetch("/api/voice", { method: "POST", body: fd });
          const request: DispatchRequest = await res.json();
          await addRequest(request);
        } catch {
          // voice processing failed silently
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      // microphone access denied
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={isProcessing}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: isRecording
            ? "1px solid var(--priority-urgent)"
            : "1px solid var(--rw-border-med)",
          background: "var(--rw-parchment-2)",
          boxShadow: isRecording ? "0 0 0 8px rgba(192,57,43,0.08)" : "none",
          cursor: isProcessing ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.15s, box-shadow 0.15s",
          outline: "none",
        }}
      >
        {isProcessing ? (
          <IconLoader2
            size={24}
            strokeWidth={1.5}
            color="var(--rw-ink-muted)"
            style={{ animation: "spin 1s linear infinite" }}
          />
        ) : (
          <IconMicrophone
            size={24}
            strokeWidth={1.5}
            color={isRecording ? "var(--priority-urgent)" : "var(--rw-ink)"}
          />
        )}
      </button>
      <span className="rw-label">
        {isProcessing ? "Processing…" : isRecording ? "Release to send" : "Hold to speak"}
      </span>
    </div>
  );
}
