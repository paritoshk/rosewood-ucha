import { DispatchBoard } from "@/components/DispatchBoard";
import { VoiceButton } from "@/components/VoiceButton";

export default function DispatchPage() {
  return (
    <div>
      {/* Voice capture */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 40,
          borderBottom: "1px solid var(--rw-border)",
          marginBottom: 32,
        }}
      >
        <p
          className="rw-label"
          style={{ marginBottom: 20, opacity: 0.6 }}
        >
          New Request
        </p>
        <VoiceButton />
      </div>

      {/* Board */}
      <DispatchBoard />
    </div>
  );
}
