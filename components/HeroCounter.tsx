"use client";

import { useEffect, useState } from "react";
import { anchoredValue, padDigits } from "@/lib/dates";
import { FlipGroup } from "./FlipGroup";

export function HeroCounter({
  label,
  anchorDate,
  anchorValue,
}: {
  label: string;
  anchorDate: string;
  anchorValue: number;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Client-only clock: server has no "now", so we hydrate a static shell
    // and come alive here to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render a static, non-ticking shell on the server / before hydration
  // so there's no mismatch, then come alive on the client.
  const { value, hours, minutes, seconds } = now
    ? anchoredValue(anchorDate, anchorValue, now)
    : anchoredValue(anchorDate, anchorValue, new Date(anchorDate + "T00:00:01Z"));

  const valueDigits = padDigits(value, value.toString().length);

  return (
    <div className="hero-counter">
      <p className="eyebrow">days elapsed</p>
      <h1 className="hero-counter__title">{label} was</h1>
      <FlipGroup
        digits={valueDigits}
        size="lg"
        ariaLabel={`${value.toLocaleString()} days`}
      />
      <p className="hero-counter__suffix">days ago</p>
      <div className="hero-counter__clock">
        <FlipGroup digits={padDigits(hours, 2)} size="sm" ariaLabel={`${hours} hours`} />
        <span className="hero-counter__colon">:</span>
        <FlipGroup digits={padDigits(minutes, 2)} size="sm" ariaLabel={`${minutes} minutes`} />
        <span className="hero-counter__colon">:</span>
        <FlipGroup digits={padDigits(seconds, 2)} size="sm" ariaLabel={`${seconds} seconds`} />
        <span className="hero-counter__clock-label">and counting</span>
      </div>
    </div>
  );
}
