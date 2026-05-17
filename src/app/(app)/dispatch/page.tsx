import { DispatchBoard } from "@/components/DispatchBoard";

// Push-to-talk now lives in the TopBar (available from every page), so the
// dispatch board is the full main view.
export default function DispatchPage() {
  return <DispatchBoard />;
}
