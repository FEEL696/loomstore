"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function PromoSectionHeader() {
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      setCountdown(formatCountdown(end.getTime() - now.getTime()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative left-1/2 z-0 mb-8 flex w-screen max-w-[100vw] -translate-x-1/2 flex-col items-center gap-2 px-4 text-center sm:px-6 lg:px-8"
      aria-label="Акция дня"
    >
      <h2 className="loom-promo-section-title">Акционные товары</h2>
      <time
        className="tabular-nums tracking-tight text-[clamp(1.5rem,4.8vw,2.1rem)] font-bold"
        style={{
          fontFamily: "var(--font-akony), sans-serif",
          fontWeight: 700,
        }}
        dateTime=""
        aria-live="polite"
      >
        {countdown}
      </time>
    </div>
  );
}
