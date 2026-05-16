import Link from "next/link";

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#F5F1E8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px" }}>
      <Link href="/" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "28px", fontWeight: 400, color: "#1A1A1A", textDecoration: "none", marginBottom: "48px" }}>Üchá</Link>
      <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300, fontSize: "56px", margin: "0 0 16px", letterSpacing: "-0.01em" }}>Pricing</h1>
      <p style={{ color: "#6B6258", fontSize: "15px", margin: "0 0 32px" }}>Per-property tiers. Contact us for details.</p>
      <Link href="/" style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#6B6258", textDecoration: "none" }}>← Back</Link>
    </div>
  );
}
