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

      <main className="mx-auto max-w-7xl space-y-4 px-2.5 py-4 sm:space-y-5 sm:px-4 sm:py-5 md:px-5 md:py-6">
        <CustomQrGenerator />

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
          <h2 className="text-lg font-bold sm:text-xl">2. Opening ST</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
            {openingStations.map((station) => (
              <QrDisplay
                key={station.id}
                title={station.label}
                value={station.url}
                fileName={station.id}
                compact
                mini
              />
            ))}
          </div>
        </section>

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
          <h2 className="text-lg font-bold sm:text-xl">3. Night ST</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
            {nightStations.map((station) => (
              <QrDisplay
                key={station.id}
                title={station.label}
                value={station.url}
                fileName={station.id}
                compact
                mini
              />
            ))}
          </div>
        </section>

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
          <h2 className="text-lg font-bold sm:text-xl">4. Smart Log Store</h2>
          <div className="mt-3 w-full max-w-[180px]">
            <QrDisplay
              title={smartLogStore.label}
              value={smartLogStore.url}
              fileName={smartLogStore.id}
              compact
              mini
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ff7a18]/30 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-white/80">
        Make By Leo 😊🎉
      </footer>
    </div>
  );
}
