"use client";

import { useState } from "react";

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
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 text-center">
        <p className="text-sm text-green-400 font-semibold">You're in.</p>
        <p className="text-xs text-green-400/70 mt-1">
          Morning brief hits your inbox at 6:30 AM ET.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-accent-ai/20 bg-accent-ai/5 p-5"
    >
      <h3 className="text-sm font-bold text-foreground">
        Daily Morning Brief
      </h3>
      <p className="text-xs text-muted mt-1 leading-relaxed">
        Top crypto & AI headlines, curated and delivered at 6:30 AM ET.
      </p>
      <div className="flex gap-2 mt-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-ai/30"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-accent-ai hover:bg-accent-ai/80 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-2">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
