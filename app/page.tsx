import type { Metadata } from "next";
import { HeroCounter } from "@/components/HeroCounter";
import { ShockerRow } from "@/components/ShockerRow";
import { Generator } from "@/components/Generator";
import { SHOCKERS, elapsedSince, ANCHOR_DATE, ANCHOR_VALUE } from "@/lib/dates";
import { SITE_URL } from "./layout";

type SearchParams = Promise<{ label?: string; date?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { label, date } = await searchParams;
  const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date);

  if (!label || !isValidDate) {
    return {}; // falls back to the anchored default in root layout
  }

  const { days } = elapsedSince(date);
  const title = `${label} was ${days.toLocaleString()} days ago`;
  const ogImage = `/api/og?label=${encodeURIComponent(label)}&date=${date}`;

  return {
    title: `${title} — daysago`,
    description: `${label} was ${days.toLocaleString()} days ago. Find out how long ago your moment was.`,
    openGraph: {
      title,
      description: "Find out how long ago your moment was.",
      url: `${SITE_URL}/?label=${encodeURIComponent(label)}&date=${date}`,
      siteName: "daysago",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogImage],
    },
  };
}

export default function Home() {
  return (
    <main className="page">
      <section className="page__hero">
        <HeroCounter label="2020" anchorDate={ANCHOR_DATE} anchorValue={ANCHOR_VALUE} />
      </section>

      <section className="page__shockers">
        <ShockerRow shockers={SHOCKERS.slice(1)} />
      </section>

      <section className="page__generator">
        <Generator siteUrl={SITE_URL} />
      </section>

      <footer className="page__footer">
        <p>
          every day is a flap that never flips back.{" "}
          <span className="page__footer-source">idea via @stats_feed</span>
        </p>
        <p className="page__footer-credit">
          built with{" "}
          <span className="page__footer-heart" aria-hidden="true">
            ♥
          </span>{" "}
          by{" "}
          <a
            href="https://x.com/MojeebMotion"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mojeeb
          </a>
        </p>
      </footer>
    </main>
  );
}
