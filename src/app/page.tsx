import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { Dashboard } from "@/components/dashboard";
import { SubscribeForm } from "@/components/subscribe-form";
import { TodaysBrief } from "@/components/at-a-glance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const items = await fetchAllFeeds();
  const cryptoCount = items.filter((i) => i.category === "crypto").length;
  const aiCount = items.filter((i) => i.category === "ai").length;
  const sourceCount = new Set(items.map((i) => i.source)).size;

  const now = new Date();
  const dateLong = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
  const timeShort = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* Masthead */}
      <header className="border-b border-rule-strong">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-7">
          <p className="kicker mb-3">A daily brief · crypto + AI</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h1 className="font-editorial text-5xl sm:text-6xl tracking-tight text-fg leading-[0.95]">
              TrustCore <span className="italic text-accent">Media</span>
            </h1>
            <div className="text-right shrink-0">
              <p className="kicker">{dateLong}</p>
              <p className="kicker mt-1">
                Edition · {items.length} items · {timeShort} ET
              </p>
            </div>
          </div>
          <p className="font-editorial italic text-fg-dim text-lg mt-5 max-w-2xl leading-snug">
            Calm signal from the crypto and AI firehoses — hand-picked
            from {sourceCount} sources, every morning. No commentary,
            just what moved.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <TodaysBrief items={items} />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-10 mt-10">
          <Dashboard items={items} />
          <aside className="space-y-6">
            <SubscribeForm />
            <SidebarPanel kicker="Sources">
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(items.map((i) => i.source))).map((src) => (
                  <span
                    key={src}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-rule text-fg-dim"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </SidebarPanel>
            <SidebarPanel kicker="For developers">
              <p className="text-xs text-fg-dim leading-relaxed">
                Read-only JSON API at{" "}
                <code className="text-accent text-[11px] font-mono">
                  /api/feeds
                </code>
                ,{" "}
                <code className="text-accent text-[11px] font-mono">
                  /api/brief
                </code>
                ,{" "}
                <code className="text-accent text-[11px] font-mono">
                  /api/sources
                </code>
                .
              </p>
            </SidebarPanel>
            <SidebarPanel kicker="Methodology">
              <p className="text-xs text-fg-dim leading-relaxed">
                We pull RSS / Atom from {sourceCount} named publications
                every page load. Headlines are unedited; ordering is
                chronological with a category split. Nothing here is
                investment advice.
              </p>
            </SidebarPanel>
          </aside>
        </div>
      </main>

      {/* Colophon */}
      <footer className="border-t border-rule mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <p className="font-editorial text-fg text-base">
              TrustCore Media
            </p>
            <p className="kicker mt-1">
              {cryptoCount} crypto · {aiCount} AI · {sourceCount} sources
            </p>
          </div>
          <p className="kicker text-fg-muted">
            © {now.getFullYear()} TrustCore Systems · Refreshes on load
          </p>
        </div>
      </footer>
    </div>
  );
}

function SidebarPanel({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-rule pt-4">
      <p className="kicker mb-2">{kicker}</p>
      {children}
    </div>
  );
}
