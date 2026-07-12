import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ANCHOR_DATE, ANCHOR_VALUE, anchoredValue } from "@/lib/dates";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

// Set this to your real deployment URL before shipping.
export const SITE_URL = "https://daysago.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const { value } = anchoredValue(ANCHOR_DATE, ANCHOR_VALUE);
  const description = `2020 was ${value.toLocaleString()} days ago. You don't want to know.`;
  const image = `/api/og?label=2020&days=${value}&since=${encodeURIComponent(
    "ticking up every day"
  )}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: "daysago — 2020 was how many days ago?",
    description: "A live, ticking answer to the only question that matters right now.",
    openGraph: {
      title: "daysago",
      description,
      url: SITE_URL,
      siteName: "daysago",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: "daysago",
      description,
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
