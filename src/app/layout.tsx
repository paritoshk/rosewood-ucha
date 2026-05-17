import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Üchá — Voice-First Hotel Dispatch",
    template: "%s | Üchá",
  },
  description:
    "Staff press one button, speak a request, and Üchá transcribes, routes, enriches with guest-360 context, and confirms — in seconds. Zero dropped requests.",
  metadataBase: new URL("https://ucha-rosewood.vercel.app"),
  keywords: [
    "hotel dispatch",
    "voice AI",
    "hospitality",
    "operations",
    "Rosewood",
    "ElevenLabs",
    "Claude",
    "concierge",
  ],
  authors: [{ name: "Üchá" }],
  creator: "Üchá",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Üchá",
    title: "Üchá — Voice-First Hotel Dispatch",
    description:
      "One button, one voice, zero dropped requests. AI-powered dispatch for luxury hospitality.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Üchá — Voice-First Hotel Dispatch",
    description:
      "One button, one voice, zero dropped requests. AI-powered dispatch for luxury hospitality.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full">
        {children}
      </body>
    </html>
  );
}
