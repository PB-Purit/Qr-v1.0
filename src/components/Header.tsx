"use client";

import {
  FireExtinguisher,
  House,
  Info,
  Menu,
  PhoneCall,
} from "lucide-react";

type HeaderProps = {
  onOpenMenu: () => void;
  onGoHome: () => void;
  onShowFireman: () => void;
  onShowEmergencyContacts: () => void;
};

export function Header({ onOpenMenu, onGoHome, onShowFireman, onShowEmergencyContacts }: HeaderProps) {
  const headerItems = [
    { label: "Home", icon: House },
    { label: "Fireman", icon: FireExtinguisher },
    { label: "Emergency contact", icon: PhoneCall },
    { label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#ff7a18]/30 bg-black/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-3 sm:flex-nowrap sm:px-4 md:px-6">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-[10px] leading-tight text-[#ff7a18] sm:text-xs">
           (Loss Prevention)
          </p>
          <h1 className="text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl">
            Store PM 1
          </h1>
          <p className="mt-1 overflow-hidden whitespace-nowrap text-[10px] font-bold text-red-500 sm:text-xs">
            <span className="inline-block animate-marquee">⚠️ สแกนจุดกรุณาตรวจสอบทุกจุดก่อนกดส่ง  **รอ 2 นาที** ⚠️</span>
          </p>
        </div>
        <nav aria-label="เมนูหลัก" className="order-3 flex w-full min-w-0 items-center gap-1 sm:order-none sm:w-auto sm:gap-2">
          {headerItems.map(({ label, icon: Icon }) => {
            const isEmergencyContact = label === "Emergency contact";
            const isHome = label === "Home";
            const isFireman = label === "Fireman";
            const isAbout = label === "About";
            const className = "flex h-9 min-w-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 text-white/75 transition hover:border-[#ff7a18] hover:bg-[#ff7a18]/10 hover:text-[#ffb347] sm:h-10 sm:flex-none sm:px-2.5";

            if (isAbout) {
              return (
                <a
                  key={label}
                  href="https://github.com/PB-Purit/Qr-v1.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  aria-label={label}
                  className={className}
                >
                  <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  <span className="hidden text-xs font-medium lg:inline">{label}</span>
                </a>
              );
            }

            return (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                onClick={isHome ? onGoHome : isFireman ? onShowFireman : onShowEmergencyContacts}
                className={className}
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span className="hidden text-xs font-medium lg:inline">{label}</span>
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="เปิดเมนู"
          className="click-pop group flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/20 hover:border-[#ff7a18] hover:bg-[#ff7a18]/10"
        >
          <Menu aria-hidden="true" size={22} className="text-white transition group-hover:text-[#ff7a18]" />
        </button>
      </div>
    </header>
  );
}
