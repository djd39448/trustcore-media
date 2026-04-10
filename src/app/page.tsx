import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { Dashboard } from "@/components/dashboard";
import { SubscribeForm } from "@/components/subscribe-form";
import { AtAGlance } from "@/components/at-a-glance";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const items = await fetchAllFeeds();
  const cryptoCount = items.filter((i) => i.category === "crypto").length;
  const aiCount = items.filter((i) => i.category === "ai").length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              TrustCore<span className="text-accent-ai">Media</span>
            </h1>
            <p className="text-sm text-muted mt-0.5">
              Crypto & AI intelligence, aggregated
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted font-mono">
              {items.length} headlines
            </p>
            <p className="text-[11px] text-muted/60">
              {cryptoCount} crypto &middot; {aiCount} AI &middot;{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: "America/New_York",
              })}{" "}
              ET
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <AtAGlance items={items} />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
          <Dashboard items={items} />
          <aside className="space-y-5">
            <SubscribeForm />
            <div className="rounded-xl border border-border bg-card/50 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                Sources
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(items.map((i) => i.source))).map((src) => (
                  <span
                    key={src}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted/80"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card/50 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">
                For Developers
              </h3>
              <p className="text-xs text-muted/80 leading-relaxed">
                JSON API available at{" "}
                <code className="text-accent-ai text-[11px]">/api/feeds</code>,{" "}
                <code className="text-accent-ai text-[11px]">/api/brief</code>,{" "}
                <code className="text-accent-ai text-[11px]">/api/sources</code>
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-muted/50">
            &copy; {new Date().getFullYear()} TrustCore Systems
          </p>
          <p className="text-[11px] text-muted/50">
            Updated every page load &middot; 14 sources
          </p>
        </div>
      </footer>
    </div>
  );
}
