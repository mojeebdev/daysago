import { ImageResponse } from "next/og";
import { elapsedSince, formatDayLabel } from "@/lib/dates";

export const runtime = "edge";

const INK = "#12151c";
const BOARD = "#1b1f29";
const BONE = "#f5efdd";
const AMBER = "#ffb020";
const SLATE = "#7c8798";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const label = (searchParams.get("label") || "2020").slice(0, 60);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.get("date") || "")
    ? (searchParams.get("date") as string)
    : "2020-01-01";

  // `days` lets a caller (the anchored hero share) pass an already-computed
  // number directly instead of deriving it from a real calendar date.
  const explicitDays = Number(searchParams.get("days"));
  const days = Number.isFinite(explicitDays) && explicitDays > 0
    ? Math.trunc(explicitDays)
    : elapsedSince(date).days;

  const digits = Math.max(4, days.toString().length);
  const dayStr = days.toString().padStart(digits, "0").split("");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            color: AMBER,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          days elapsed
        </div>
        <div
          style={{
            display: "flex",
            color: BONE,
            fontSize: 34,
            marginBottom: 28,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          {label} was
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          {dayStr.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 90,
                height: 130,
                background: BOARD,
                color: BONE,
                fontSize: 84,
                borderRadius: 10,
                border: `2px solid #2a303d`,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", color: BONE, fontSize: 34, marginBottom: 10 }}>
          days ago
        </div>
        <div style={{ display: "flex", color: SLATE, fontSize: 22 }}>
          {searchParams.get("since") || `since ${formatDayLabel(date)}`}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
