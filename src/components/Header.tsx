"use client";

type HeaderProps = {
  onOpenMenu: () => void;
};

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ff7a18]/30 bg-black/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        <div className="min-w-0 pr-2">
          <p className="text-[10px] leading-tight text-[#ff7a18] sm:text-xs">
            ST 11142 ( Loss Prevention )
          </p>
          <h1 className="text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl">
            Store PM 1 <span className="text-[#ff7a18]">QR</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="เปิดเมนู"
          className="click-pop group flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/20 hover:border-[#ff7a18] hover:bg-[#ff7a18]/10"
        >
          <span className="h-0.5 w-6 bg-white transition group-hover:bg-[#ff7a18]" />
          <span className="h-0.5 w-6 bg-white transition group-hover:bg-[#ff7a18]" />
          <span className="h-0.5 w-6 bg-white transition group-hover:bg-[#ff7a18]" />
        </button>
      </div>
    </header>
  );
}
