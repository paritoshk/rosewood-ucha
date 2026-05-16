import { DispatchProvider } from "@/context/DispatchContext";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DispatchProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "var(--rw-parchment)",
        }}
      >
        <Sidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <TopBar />
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </DispatchProvider>
  );
}
