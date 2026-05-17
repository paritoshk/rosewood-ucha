import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C3A2D",
          borderRadius: "20%",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 300,
            fontStyle: "italic",
            color: "#F4EFE4",
            lineHeight: 1,
          }}
        >
          Ü
        </span>
      </div>
    ),
    { ...size },
  );
}
