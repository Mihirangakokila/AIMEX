import { ImageResponse } from "next/og";

export const alt = "AIMEX — Creative & Digital Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060810",
          color: "#F8FAFC",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", color: "#00F0FF", letterSpacing: "0.28em", fontSize: 22 }}>AIMEX</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 74, lineHeight: 0.92, letterSpacing: "-0.04em" }}>
          <div style={{ display: "flex" }}>WE CREATE WORK</div>
          <div style={{ display: "flex", color: "#00F0FF" }}>THAT GETS NOTICED.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 22 }}>
          <div style={{ display: "flex" }}>Creative & Digital Agency</div>
          <div style={{ display: "flex", color: "#00F0FF" }}>Create. Connect. Grow.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
