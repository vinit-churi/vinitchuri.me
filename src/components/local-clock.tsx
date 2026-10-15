"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

export function LocalClock({ city, timeZone }: { city: string; timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()),
    () => null,
  );

  return (
    <span className="inline-flex items-center gap-2">
      <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[#2f9e6a] text-[#2f9e6a]" aria-hidden />
      {time ? `${time} in ${city} — probably shipping something` : `Based in ${city}`}
    </span>
  );
}
