"use client";

import { useEffect, useRef } from "react";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p !== undefined) void p.catch(() => {});
  }, []);

  return (
    <section className="w-full bg-white py-12 md:py-16" aria-label="Видео">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.1] object-cover"
          src="/Main/AnimationMain.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Видео контент"
        />
      </div>
    </section>
  );
}
