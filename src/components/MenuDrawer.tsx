"use client";

import { useState } from "react";
import { CopyBox } from "./CopyBox";
import { QrDisplay } from "./QrDisplay";
import { pdaItems } from "@/lib/stations";
import { listTemplates } from "@/lib/templates";

type MenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const [openList, setOpenList] = useState<string | null>("list-1");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="ปิดเมนู"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <aside className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-none flex-col border-l border-[#ff7a18]/40 bg-[#0d0d0d] sm:max-w-md md:max-w-lg">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:py-4">
          <h2 className="text-base font-semibold text-[#ff7a18] sm:text-lg">เมนูรายงาน</h2>
          <button
            type="button"
            onClick={onClose}
            className="click-pop min-h-10 rounded-full border border-white/20 px-4 py-1.5 text-sm hover:border-[#ff7a18] hover:text-[#ff7a18]"
          >
            ปิด
          </button>
        </div>
        <div className="space-y-5 overflow-y-auto p-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-4">
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
              PDA
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pdaItems.map((item) => (
                <QrDisplay
                  key={item.id}
                  compact
                  title={item.title}
                  subtitle={item.value}
                  value={item.value}
                  fileName={item.id}
                />
              ))}
            </div>
          </section>

          {listTemplates.map((group) => {
            const expanded = openList === group.id;
            return (
              <section key={group.id} className="rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setOpenList(expanded ? null : group.id)}
                  className="click-pop flex min-h-12 w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-semibold hover:text-[#ff7a18] sm:px-4 sm:text-base"
                >
                  <span className="break-words">{group.title}</span>
                  <span className="shrink-0 text-[#ff7a18]">{expanded ? "−" : "+"}</span>
                </button>
                {expanded ? (
                  <div className="space-y-3 border-t border-white/10 p-3">
                    {group.items.map((item) => (
                      <CopyBox key={item.id} title={item.title} text={item.text} />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
