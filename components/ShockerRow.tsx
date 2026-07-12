"use client";

import { useEffect, useState } from "react";
import { elapsedSince, padDigits, formatDayLabel, type Shocker } from "@/lib/dates";
import { FlipGroup } from "./FlipGroup";

function ShockerCard({ shocker }: { shocker: Shocker }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const { days } = now ? elapsedSince(shocker.date, now) : elapsedSince(shocker.date);
  const digits = padDigits(days, Math.max(5, days.toString().length));

  return (
    <div className="shocker-card">
      <p className="shocker-card__label">{shocker.label}</p>
      <FlipGroup digits={digits} size="sm" ariaLabel={`${days.toLocaleString()} days ago`} />
      <p className="shocker-card__sub">days ago · {formatDayLabel(shocker.date)}</p>
    </div>
  );
}

export function ShockerRow({ shockers }: { shockers: Shocker[] }) {
  return (
    <div className="shocker-row">
      {shockers.map((s) => (
        <ShockerCard key={s.slug} shocker={s} />
      ))}
    </div>
  );
}
