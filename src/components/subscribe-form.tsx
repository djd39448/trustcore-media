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
      <div className="bg-card border border-border rounded-lg p-4 text-center">
        <p className="text-sm text-green-400 font-medium">
          You're in! Watch for the morning brief.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-4"
    >
      <p className="text-sm font-medium text-foreground mb-2">
        Get the daily morning brief
      </p>
      <p className="text-xs text-muted mb-3">
        Top crypto & AI headlines delivered to your inbox at 6:30 AM ET.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-ai/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-accent-ai hover:bg-accent-ai/80 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
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
