"use client";

import { useEffect, useState } from "react";
import { CustomQrGenerator } from "@/components/CustomQrGenerator";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { Header } from "@/components/Header";
import { MenuDrawer } from "@/components/MenuDrawer";
import { QrDisplay } from "@/components/QrDisplay";
import { ScanPopup } from "@/components/ScanPopup";
import {
  nightStations,
  openingStations,
  smartLogStore,
} from "@/lib/stations";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFireman, setShowFireman] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showScanPopup, setShowScanPopup] = useState(false);

  useEffect(() => {
    const sectionId = showFireman ? "fireman-guide" : showEmergencyContacts ? "emergency-contacts" : null;
    if (sectionId) document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }, [showFireman, showEmergencyContacts]);

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(255,122,24,0.12),_transparent_38%),#000]">
      <Header
        onOpenMenu={() => setMenuOpen(true)}
        onGoHome={() => {
          setMenuOpen(false);
          setShowEmergencyContacts(false);
          setShowFireman(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onShowFireman={() => {
          setShowFireman((visible) => !visible);
          setShowEmergencyContacts(false);
        }}
        onShowEmergencyContacts={() => {
          setShowEmergencyContacts((visible) => !visible);
          setShowFireman(false);
        }}
      />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ScanPopup open={showScanPopup} onClose={() => setShowScanPopup(false)} />

      <main className="mx-auto max-w-7xl space-y-4 px-2.5 py-4 sm:space-y-5 sm:px-4 sm:py-5 md:px-5 md:py-6">
        <CustomQrGenerator />

        <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold sm:text-xl">2. Opening ST</h2>
            <button
              type="button"
              onClick={() => setShowScanPopup(true)}
              className="click-pop shrink-0 rounded-lg bg-[#ff7a18] px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-[#ffb347]"
            >
              สแกนจุดตรวจสอบ
            </button>
          </div>
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

    
        {showFireman && (
          <section id="fireman-guide" className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
            <h2 className="text-lg font-bold sm:text-xl">Fireman Map</h2>
            <div className="mt-3 flex justify-center">
              <img 
                src="/pic/Map.png" 
                alt="Fireman Map" 
                className="max-w-full h-auto rounded-lg border border-white/10"
              />
            </div>
          </section>
        )}

        {showEmergencyContacts && <EmergencyContacts />}
      </main>

      <footer className="border-t border-[#ff7a18]/30 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-white/80">
        Make By Leo 😊🎉
      </footer>
    </div>
  );
}
