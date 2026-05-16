"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F5F1E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "28px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "#1A1A1A",
          textDecoration: "none",
          marginBottom: "48px",
          display: "block",
        }}
      >
        Üchá
      </Link>

      {/* Card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #D9D2C2",
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
        }}
      >
        {/* Demo banner */}
        {isDemo && (
          <div
            style={{
              background: "#EEE8D8",
              border: "1px solid #D9D2C2",
              padding: "10px 14px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#6B6258",
              }}
            >
              Demo credentials pre-filled
            </span>
          </div>
        )}

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 400,
            fontSize: "32px",
            letterSpacing: "-0.01em",
            margin: "0 0 6px",
          }}
        >
          Sign in
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6B6258",
            margin: "0 0 32px",
          }}
        >
          Access your property workspace.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "/select-property";
          }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#6B6258",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              defaultValue={isDemo ? "demo@rosewoodsandhill.com" : ""}
              placeholder="you@property.com"
              required
              style={{
                border: "1px solid #D9D2C2",
                background: "#F5F1E8",
                padding: "10px 12px",
                fontSize: "14px",
                color: "#1A1A1A",
                outline: "none",
                fontFamily: "inherit",
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="password"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#6B6258",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              defaultValue={isDemo ? "demo1234" : ""}
              placeholder="••••••••"
              required
              style={{
                border: "1px solid #D9D2C2",
                background: "#F5F1E8",
                padding: "10px 12px",
                fontSize: "14px",
                color: "#1A1A1A",
                outline: "none",
                fontFamily: "inherit",
                width: "100%",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "-8px",
            }}
          >
            <Link
              href="/forgot"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "#8E867A",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#F5F1E8",
              background: "#1F3A2E",
              border: "none",
              padding: "13px 24px",
              cursor: "pointer",
              marginTop: "8px",
              width: "100%",
            }}
          >
            Continue →
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#D9D2C2" }} />
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8E867A",
            }}
          >
            or continue with
          </span>
          <div style={{ flex: 1, height: "1px", background: "#D9D2C2" }} />
        </div>

        {/* SSO buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { label: "Google Workspace", icon: "G" },
            { label: "Okta SSO", icon: "O" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #D9D2C2",
                background: "#F5F1E8",
                padding: "10px 14px",
                cursor: "pointer",
                width: "100%",
                fontFamily: "inherit",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#6B6258",
                  width: "20px",
                  textAlign: "center",
                }}
              >
                {icon}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#2C2A26",
                  fontFamily: "inherit",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo link */}
      {!isDemo && (
        <p
          style={{
            marginTop: "24px",
            fontSize: "13px",
            color: "#8E867A",
            textAlign: "center",
          }}
        >
          Just exploring?{" "}
          <Link
            href="/signin?demo=1"
            style={{
              color: "#1F3A2E",
              textDecoration: "none",
              borderBottom: "1px solid #1F3A2E",
              paddingBottom: "1px",
            }}
          >
            Try the demo workspace
          </Link>
        </p>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
