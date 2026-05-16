export type Department = "housekeeping" | "maintenance" | "front_desk" | "concierge";
export type Priority = "urgent" | "normal" | "low";
export type Status = "pending" | "in_progress" | "resolved";
export type GuestTier = "Pinnacle" | "Élevé" | "Standard";

export interface DispatchRequest {
  id: string;
  department: Department;
  room: string;
  summary: string;
  guestName: string;
  guestTier: GuestTier;
  guestPrefs: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  eta?: string;
}

export interface Guest {
  room: string;
  name: string;
  tier: GuestTier;
  status: "Checked In" | "VIP Arrival" | "Departing";
  preferences: string;
  languages: string;
}

export interface StaffMember {
  name: string;
  department: string;
  shift: string;
}
