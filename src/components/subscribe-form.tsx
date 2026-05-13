"use client";

import { useState } from "react";

/**
 * SubscribeForm — editorial inset, top-of-sidebar.
 *
 * Reads as "subscribe to a publication," not "newsletter signup." Serif
 * headline, kicker label, terracotta CTA. Single accent system.
 */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-l-2 border-accent bg-accent-soft p-5">
        <p className="kicker mb-1" style={{ color: "var(--accent)" }}>
          Subscribed
        </p>
        <p className="font-editorial text-fg text-lg leading-snug">
          You&rsquo;re in. The next edition lands tomorrow at 6:30 AM ET.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-l-2 border-accent pl-5">
      <p className="kicker mb-2" style={{ color: "var(--accent)" }}>
        The morning brief
      </p>
      <h3 className="font-editorial text-fg text-xl leading-tight">
        Crypto + AI, hand-picked, 6:30 AM ET.
      </h3>
      <p className="text-sm text-fg-dim mt-2 leading-relaxed">
        One short email. No commentary, just what moved.
      </p>
      <div className="mt-4 space-y-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-bg-elev border border-rule rounded-md px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-accent hover:opacity-90 text-bg text-sm font-semibold px-4 py-2 rounded-md transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-bad mt-2">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
