import { NextRequest, NextResponse } from "next/server";
import type { DispatchRequest } from "@/lib/types";

const MOCK_RESPONSES: Omit<DispatchRequest, "id" | "status" | "createdAt">[] = [
  {
    department: "housekeeping",
    room: "612",
    summary: "Guest requesting extra pillows and blanket",
    guestName: "Mr. James Harrington",
    guestTier: "Élevé",
    guestPrefs: "Down-free pillows only",
    priority: "normal",
    eta: "15 min",
  },
  {
    department: "maintenance",
    room: "908",
    summary: "Television remote not working",
    guestName: "Ms. Liu Yang",
    guestTier: "Standard",
    guestPrefs: "No disturbance after 22:00",
    priority: "low",
    eta: "20 min",
  },
  {
    department: "front_desk",
    room: "315",
    summary: "Guest locked out of room, needs new key card",
    guestName: "Mr. David Okafor",
    guestTier: "Élevé",
    guestPrefs: "Express service",
    priority: "urgent",
    eta: "5 min",
  },
  {
    department: "concierge",
    room: "1006",
    summary: "Theatre tickets for tonight — Swan Lake at Davies Hall",
    guestName: "Dr. & Mrs. Park",
    guestTier: "Pinnacle",
    guestPrefs: "Orchestra seats preferred",
    priority: "normal",
    eta: "30 min",
  },
  {
    department: "housekeeping",
    room: "711",
    summary: "Room refresh requested, guest returning at 16:00",
    guestName: "Ms. Isabelle Morin",
    guestTier: "Élevé",
    guestPrefs: "Lavender linen spray",
    priority: "normal",
    eta: "25 min",
  },
];

export async function POST(req: NextRequest) {
  // In production: send audio to Whisper, parse with GPT-4
  // For demo: return a random mock request
  void req; // audio blob would be processed here
  const mock = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  const request: DispatchRequest = {
    id: `req-${crypto.randomUUID().slice(0, 8)}`,
    ...mock,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(request);
}
