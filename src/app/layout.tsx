import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://trustcore-media.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TrustCore Media — a daily brief on crypto and AI",
  description:
    "A calm daily brief on crypto and AI. Hand-picked headlines from the firehose, delivered every morning. No commentary, just signal.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "TrustCore Media",
    title: "TrustCore Media — a daily brief on crypto and AI",
    description:
      "A calm daily brief on crypto and AI. Hand-picked headlines from the firehose, delivered every morning.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "TrustCore Media — a daily brief on crypto and AI",
    description:
      "A calm daily brief on crypto and AI. Hand-picked headlines from the firehose.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
