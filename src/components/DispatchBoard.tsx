"use client";

import { IconBed, IconTool, IconBuilding, IconBriefcase } from "@tabler/icons-react";
import type { Department } from "@/lib/types";
import { useDispatch } from "@/context/DispatchContext";
import { RequestCard } from "./RequestCard";

const DEPT_CONFIG: Record<
  Department,
  { label: string; icon: React.ReactNode; cssVar: string }
> = {
  housekeeping: {
    label: "Housekeeping",
    icon: <IconBed size={14} strokeWidth={1.5} />,
    cssVar: "var(--dept-housekeeping)",
  },
  maintenance: {
    label: "Maintenance",
    icon: <IconTool size={14} strokeWidth={1.5} />,
    cssVar: "var(--dept-maintenance)",
  },
  front_desk: {
    label: "Front Desk",
    icon: <IconBuilding size={14} strokeWidth={1.5} />,
    cssVar: "var(--dept-front_desk)",
  },
  concierge: {
    label: "Concierge",
    icon: <IconBriefcase size={14} strokeWidth={1.5} />,
    cssVar: "var(--dept-concierge)",
  },
};

const DEPT_ORDER: Department[] = ["housekeeping", "maintenance", "front_desk", "concierge"];

export function DispatchBoard() {
  const { requests } = useDispatch();
  const active = requests.filter((r) => r.status !== "resolved");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 24,
        alignItems: "start",
      }}
    >
      {DEPT_ORDER.map((dept) => {
        const config = DEPT_CONFIG[dept];
        const cards = active.filter((r) => r.department === dept);

        return (
          <div key={dept}>
            {/* Column header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: "1px solid var(--rw-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 2,
                    height: 14,
                    background: config.cssVar,
                    borderRadius: 1,
                  }}
                />
                <span className="rw-label">{config.label}</span>
              </div>
              <span style={{ fontSize: 11, color: "var(--rw-ink-faint)" }}>
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            {cards.length === 0 ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--rw-ink-faint)",
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                No active requests
              </p>
            ) : (
              cards.map((r) => <RequestCard key={r.id} request={r} />)
            )}
          </div>
        );
      })}
    </div>
  );
}
