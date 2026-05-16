"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const ROLES = [
  { value: "front_desk", label: "Front Desk" },
  { value: "housekeeping", label: "Housekeeping" },
  { value: "maintenance", label: "Maintenance" },
  { value: "concierge", label: "Concierge" },
  { value: "room_service", label: "Room Service" },
  { value: "management", label: "Management" },
];

const GREEN = "#1C3A2D";
const PARCHMENT = "#F4EFE4";
const NEAR_BLACK = "#0D0D0D";
const GOLD = "#C9A84C";

export default function Home() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const canEnter = name.trim().length > 0 && role.length > 0;

  const handleEnter = () => {
    if (!canEnter) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("staff_name", name.trim());
      sessionStorage.setItem("staff_role", role);
    }
    router.push("/dispatch");
  };

  return (
    <div className="flex flex-1 min-h-screen">
      {/* Left panel */}
      <aside
        className="hidden lg:flex flex-col justify-between p-16 w-[440px] shrink-0"
        style={{ background: GREEN }}
      >
        <div>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-10"
            style={{ color: GOLD, fontFamily: "var(--font-geist-sans)" }}
          >
            Est. 1979
          </p>
          <h1
            className="text-6xl font-light leading-[1.1]"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: PARCHMENT,
              fontStyle: "italic",
            }}
          >
            Rosewood
            <br />
            Hotel
            <br />
            Collection
          </h1>
        </div>

        <div>
          <div style={{ width: 40, height: 1, background: PARCHMENT, opacity: 0.25, marginBottom: 20 }} />
          <p
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: PARCHMENT, opacity: 0.4 }}
          >
            Staff Operations Portal
          </p>
        </div>
      </aside>

      {/* Right panel */}
      <main
        className="flex flex-1 flex-col justify-center px-8 sm:px-16 lg:px-24 py-16"
        style={{ background: PARCHMENT }}
      >
        {/* Mobile brand */}
        <div className="lg:hidden mb-10">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: GREEN }}
          >
            Rosewood Hotel Collection
          </p>
        </div>

        <div className="max-w-md w-full">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: NEAR_BLACK, opacity: 0.45 }}
          >
            Staff Portal
          </p>
          <h2
            className="text-5xl font-light leading-[1.15] mb-12"
            style={{ fontFamily: "var(--font-cormorant)", color: NEAR_BLACK }}
          >
            Welcome.
            <br />
            <span style={{ fontStyle: "italic" }}>Please identify yourself.</span>
          </h2>

          <div className="space-y-9">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: NEAR_BLACK, opacity: 0.5 }}
              >
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnter()}
                placeholder="Full name"
                autoComplete="off"
                className="bg-transparent border-0 border-b rounded-none px-0 h-10 text-base placeholder:opacity-30 focus-visible:ring-0 focus-visible:outline-none"
                style={{
                  borderBottom: `1px solid ${NEAR_BLACK}26`,
                  color: NEAR_BLACK,
                  fontFamily: "var(--font-geist-sans)",
                }}
              />
            </div>

            {/* Role */}
            <div className="space-y-3">
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: NEAR_BLACK, opacity: 0.5 }}
              >
                Your Role
              </p>
              <RadioGroup
                value={role}
                onValueChange={setRole}
                className="grid grid-cols-2 gap-x-6 gap-y-3"
              >
                {ROLES.map((r) => (
                  <div key={r.value} className="flex items-center gap-2.5">
                    <RadioGroupItem
                      value={r.value}
                      id={r.value}
                      style={{
                        borderColor: role === r.value ? GREEN : `${NEAR_BLACK}40`,
                        color: GREEN,
                      }}
                    />
                    <Label
                      htmlFor={r.value}
                      className="text-sm cursor-pointer font-normal tracking-wide"
                      style={{ color: NEAR_BLACK }}
                    >
                      {r.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Submit */}
            <Button
              onClick={handleEnter}
              disabled={!canEnter}
              className="w-full h-12 rounded-none text-xs tracking-[0.25em] uppercase transition-all duration-200 mt-2"
              style={{
                background: canEnter ? GREEN : `${GREEN}40`,
                color: canEnter ? PARCHMENT : `${PARCHMENT}80`,
                border: "none",
              }}
            >
              Enter Dispatch Board
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
