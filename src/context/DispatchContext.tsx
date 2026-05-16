"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { DispatchRequest, Status } from "@/lib/types";

interface DispatchContextType {
  requests: DispatchRequest[];
  addRequest: (r: DispatchRequest) => void;
  updateStatus: (id: string, status: Status) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
  lastTranscript: string;
  setLastTranscript: (v: string) => void;
}

const DispatchContext = createContext<DispatchContextType | null>(null);

export function DispatchProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<DispatchRequest[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/requests");
        if (res.ok) setRequests(await res.json());
      } catch {
        // silent fail during polling
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const addRequest = async (r: DispatchRequest) => {
    setRequests((prev) => [r, ...prev]);
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
    } catch {
      // optimistic update already applied
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      // optimistic update already applied
    }
  };

  return (
    <DispatchContext.Provider
      value={{
        requests,
        addRequest,
        updateStatus,
        isRecording,
        setIsRecording,
        isProcessing,
        setIsProcessing,
        lastTranscript,
        setLastTranscript,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useDispatch must be used within DispatchProvider");
  return ctx;
}
