"use client";

import {
  FireExtinguisher,
  House,
  Info,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  PhoneCall,
} from "lucide-react";

type HeaderProps = {
  onOpenMenu: () => void;
};

export function Header({ onOpenMenu }: HeaderProps) {
  const headerItems = [
    { label: "Home", icon: House },
    { label: "Fireman", icon: FireExtinguisher },
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Emergency contact", icon: PhoneCall },
    { label: "About", icon: Info },
    { label: "Webboard", icon: MessageSquareText },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#ff7a18]/30 bg-black/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        <div className="min-w-0 pr-2">
          <p className="text-[10px] leading-tight text-[#ff7a18] sm:text-xs">
            ST 11142 ( Loss Prevention )
          </p>
          <h1 className="text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl">
            Store PM 1
          </h1>
        </div>
        <nav aria-label="เมนูหลัก" className="flex min-w-0 items-center gap-1 sm:gap-2">
          {headerItems.map(({ label, icon: Icon }) => (
            label === "Webboard" ? (
              <a
                key={label}
                href="#webboard"
                title={label}
                aria-label={label}
                className="flex h-9 w-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/10 text-white/75 transition hover:border-[#ff7a18] hover:bg-[#ff7a18]/10 hover:text-[#ffb347] sm:h-10 sm:w-auto sm:px-2.5"
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span className="hidden text-xs font-medium lg:inline">{label}</span>
              </a>
            ) : (
              <span
                key={label}
                title={label}
                aria-label={label}
                className="flex h-9 w-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/10 text-white/75 transition hover:border-[#ff7a18] hover:bg-[#ff7a18]/10 hover:text-[#ffb347] sm:h-10 sm:w-auto sm:px-2.5"
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span className="hidden text-xs font-medium lg:inline">{label}</span>
              </span>
            )
          ))}
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
