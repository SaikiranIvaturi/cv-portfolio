import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Saikiran";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px",
        background: "#FBF9F4",
        position: "relative",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "#8B2E2A",
        }}
      />
      <p
        style={{
          fontSize: "52px",
          fontWeight: 400,
          color: "#1C1C1E",
          lineHeight: 1.2,
          margin: 0,
          maxWidth: "900px",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </p>
      <p
        style={{
          position: "absolute",
          bottom: "48px",
          right: "80px",
          fontSize: "14px",
          color: "#8E8E93",
          margin: 0,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        ivaturisaikiran@gmail.com
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
