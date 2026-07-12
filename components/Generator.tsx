"use client";

import { useMemo, useRef, useState } from "react";
import { elapsedSince, padDigits, formatDayLabel } from "@/lib/dates";
import { FlipGroup } from "./FlipGroup";

const DEFAULT_LABEL = "my last first day of school";

export function Generator({ siteUrl }: { siteUrl: string }) {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState<{ label: string; date: string } | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const result = submitted ? elapsedSince(submitted.date) : null;
  const digits = result
    ? padDigits(result.days, Math.max(4, result.days.toString().length))
    : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSubmitted({ label: label.trim() || "that", date });
    setCopyState("idle");
  }

  const shareUrl = submitted
    ? `${siteUrl}/?label=${encodeURIComponent(submitted.label)}&date=${submitted.date}`
    : siteUrl;

  const tweetText = submitted && result
    ? `${submitted.label} was ${result.days.toLocaleString()} days ago.`
    : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      // clipboard access denied — silently ignore, link is still shown
    }
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#12151c",
      });
      const link = document.createElement("a");
      link.download = "days-ago.png";
      link.href = dataUrl;
      link.click();
    } catch {
      // best-effort — if it fails, sharing the link still works
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="generator">
      <p className="eyebrow">make your own</p>
      <h2 className="generator__title">How long ago was it, really?</h2>

      <form className="generator__form" onSubmit={handleSubmit}>
        <label className="generator__field">
          <span>what happened</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={DEFAULT_LABEL}
            maxLength={60}
          />
        </label>
        <label className="generator__field">
          <span>when</span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="generator__submit">
          count it up
        </button>
      </form>

      {submitted && result && digits && (
        <div className="generator__result">
          <div className="share-card" ref={cardRef}>
            <p className="share-card__eyebrow">days elapsed</p>
            <p className="share-card__label">{submitted.label} was</p>
            <FlipGroup
              digits={digits}
              size="lg"
              ariaLabel={`${result.days.toLocaleString()} days`}
            />
            <p className="share-card__sub">
              days ago · since {formatDayLabel(submitted.date)}
            </p>
            <p className="share-card__brand">daysago</p>
          </div>

          <div className="generator__actions">
            <a
              className="generator__action generator__action--primary"
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                tweetText
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              share to X
            </a>
            <button type="button" className="generator__action" onClick={handleDownload} disabled={downloading}>
              {downloading ? "saving…" : "download card"}
            </button>
            <button type="button" className="generator__action" onClick={handleCopy}>
              {copyState === "copied" ? "link copied" : "copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
