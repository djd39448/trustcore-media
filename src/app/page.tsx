import { fetchAllFeeds } from "@/lib/fetch-feeds";
import { Dashboard } from "@/components/dashboard";
import { SubscribeForm } from "@/components/subscribe-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const items = await fetchAllFeeds();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              TrustCore Media
            </h1>
            <p className="text-sm text-muted">Crypto & AI News Aggregator</p>
          </div>
          <div className="text-xs text-muted font-mono">
            {items.length} headlines &middot; Updated{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/New_York",
            })}{" "}
            ET
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <Dashboard items={items} />
          <aside className="space-y-4">
            <SubscribeForm />
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-foreground mb-2">
                API Access
              </p>
              <p className="text-xs text-muted leading-relaxed">
                All data is available via JSON API. Agents and scripts can hit{" "}
                <code className="text-accent-ai">/api/feeds</code>,{" "}
                <code className="text-accent-ai">/api/brief</code>,{" "}
                <code className="text-accent-ai">/api/sources</code>, and{" "}
                <code className="text-accent-ai">/api/subscribers</code>.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        Powered by TrustCore Systems
      </footer>
    </div>
  );
}
