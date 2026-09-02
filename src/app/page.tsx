"use client";

import { useState } from "react";
import { CustomQrGenerator } from "@/components/CustomQrGenerator";
import { Header } from "@/components/Header";
import { MenuDrawer } from "@/components/MenuDrawer";
import { QrDisplay } from "@/components/QrDisplay";
import {
  nightStations,
  openingStations,
  smartLogStore,
} from "@/lib/stations";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(255,122,24,0.12),_transparent_38%),#000]">
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="mx-auto max-w-6xl space-y-5 px-3 py-5 sm:space-y-7 sm:px-4 sm:py-7 md:space-y-8 md:px-6 md:py-8">
        <CustomQrGenerator />

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-4 sm:rounded-3xl sm:p-5">
          <h2 className="text-xl font-bold sm:text-2xl">2. Opening ST</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {openingStations.map((station) => (
              <QrDisplay
                key={station.id}
                title={station.label}
                value={station.url}
                fileName={station.id}
              />
            ))}
          </div>
        </section>

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-4 sm:rounded-3xl sm:p-5">
          <h2 className="text-xl font-bold sm:text-2xl">3. Night ST</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {nightStations.map((station) => (
              <QrDisplay
                key={station.id}
                title={station.label}
                value={station.url}
                fileName={station.id}
              />
            ))}
          </div>
        </section>

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-4 sm:rounded-3xl sm:p-5">
          <h2 className="text-xl font-bold sm:text-2xl">4. Smart Log Store</h2>
          <div className="mt-4 w-full max-w-sm">
            <QrDisplay
              title={smartLogStore.label}
              value={smartLogStore.url}
              fileName={smartLogStore.id}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ff7a18]/30 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-white/80">
        Make By Leo 🎉
      </footer>
    </div>
  );
}
