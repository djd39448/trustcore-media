import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — TrustCore Media",
  description:
    "How TrustCore Media handles your data. Short answer: we don't have much of it. Long answer below.",
  alternates: { canonical: "/privacy" },
};

/**
 * /privacy — minimal but honest privacy page.
 *
 * Satisfies the §5 compliance-footer requirement for the 50by50 launch
 * gate. The aggregator collects very little: page-load events via GA4
 * (with IP anonymized and ad-personalization signals disabled), and
 * the subscriber email (only if the user submits the form). No
 * third-party trackers beyond GA4.
 *
 * Edit this page as policy evolves — and update the "Last updated"
 * line at the bottom whenever you do.
 */
export default function PrivacyPage() {
  const updated = "May 13, 2026";
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <header className="border-b border-rule-strong">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-7">
          <p className="kicker mb-3">TrustCore Media</p>
          <h1 className="font-editorial text-4xl sm:text-5xl tracking-tight text-fg leading-[1.0]">
            Privacy
          </h1>
          <p className="font-editorial italic text-fg-dim text-lg mt-4 max-w-2xl leading-snug">
            Short version: we don&rsquo;t collect much, we don&rsquo;t
            sell what we do, and the aggregator runs locally in your
            browser once the page loads.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 space-y-8">
        <section>
          <h2 className="font-editorial text-2xl text-fg mb-3">
            What we collect
          </h2>
          <ul className="space-y-2 text-fg-dim text-[15px] leading-relaxed list-disc pl-5">
            <li>
              <strong className="text-fg">Page-load analytics</strong> via
              Google Analytics 4. IP addresses are anonymized at
              collection. We do not enable advertising features or
              remarketing signals.
            </li>
            <li>
              <strong className="text-fg">Your email address</strong>, but
              only if you submit it to the daily-brief signup form.
              Stored in Supabase. Used to send the morning brief and
              nothing else. Unsubscribe at any time.
            </li>
            <li>
              <strong className="text-fg">Standard server logs</strong>{" "}
              from Vercel (the host) — IP, user agent, timestamp, path
              — retained per Vercel&rsquo;s default policy.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-editorial text-2xl text-fg mb-3">
            What we don&rsquo;t collect
          </h2>
          <ul className="space-y-2 text-fg-dim text-[15px] leading-relaxed list-disc pl-5">
            <li>
              No third-party trackers beyond GA4. No Facebook Pixel,
              no LinkedIn Insight, no programmatic ad networks.
            </li>
            <li>
              No fingerprinting, no session replay, no scroll heatmaps.
            </li>
            <li>
              No data about which headlines you clicked beyond the
              standard outbound-click event GA4 records by default
              (which we may disable in a future update).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-editorial text-2xl text-fg mb-3">
            Where the headlines come from
          </h2>
          <p className="text-fg-dim text-[15px] leading-relaxed">
            TrustCore Media is an RSS aggregator. Every headline you see
            is pulled from the named source&rsquo;s public RSS or Atom
            feed at page-load time. We do not store the content of the
            headlines; we re-fetch on every load. Source attribution
            stays with every headline. Clicking a headline takes you
            directly to the publisher&rsquo;s site — we do not
            interstitial or rewrite outbound links.
          </p>
        </section>

        <section>
          <h2 className="font-editorial text-2xl text-fg mb-3">Contact</h2>
          <p className="text-fg-dim text-[15px] leading-relaxed">
            Questions, corrections, or removal requests:{" "}
            <a
              href="mailto:hello@trustcore.systems"
              className="text-accent underline underline-offset-2"
            >
              hello@trustcore.systems
            </a>
            . We respond within two business days.
          </p>
        </section>

        <section>
          <h2 className="font-editorial text-2xl text-fg mb-3">
            Affiliate disclosure
          </h2>
          <p className="text-fg-dim text-[15px] leading-relaxed">
            TrustCore Media does not run affiliate links on any
            outbound headline. We do not accept payment to feature
            specific stories or sources. If that ever changes, this
            page will say so before any monetized link goes live.
          </p>
        </section>

        <p className="kicker pt-6 border-t border-rule">
          Last updated · {updated}
        </p>
      </main>

      <footer className="border-t border-rule mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-baseline justify-between flex-wrap gap-3">
          <Link
            href="/"
            className="font-editorial text-fg text-base hover:text-accent"
          >
            ← Back to TrustCore Media
          </Link>
          <p className="kicker text-fg-muted">
            © {new Date().getFullYear()} TrustCore Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
