"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

type QrDisplayProps = {
  value: string;
  title: string;
  subtitle?: string;
  fileName?: string;
  compact?: boolean;
  hideSubtitle?: boolean;
  mini?: boolean;
};

export function QrDisplay({
  value,
  title,
  subtitle,
  fileName,
  compact = false,
  hideSubtitle = false,
  mini = false,
}: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState(mini ? 140 : compact ? 180 : 220);
  const [expanded, setExpanded] = useState(!compact);
  const hasValue = Boolean(value.trim());
  const isUrl = /^https?:\/\//i.test(value);
  const qrSize = Math.max(96, size - 16);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const apply = () => {
      const next = Math.floor(frame.clientWidth);
      if (next > 0) setSize(next);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${fileName || title || "qr-code"}.png`;
    link.click();
  };

  const content = (
    <>
      {subtitle && !hideSubtitle ? (
        <p className="mt-1 break-all text-xs text-white/60">{subtitle}</p>
      ) : null}
      <div
        className={`mx-auto mt-3 flex aspect-square w-full items-center justify-center rounded-2xl border border-black/5 bg-white p-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] ${
          mini
            ? "max-w-[140px]"
            : compact
              ? "max-w-[180px]"
              : "max-w-[220px] sm:max-w-[240px]"
        }`}
      >
        <div ref={frameRef} className="relative h-full w-full overflow-hidden rounded-xl bg-white">
          {hasValue && ready ? (
            <QRCodeCanvas
              ref={canvasRef}
              value={value}
              size={qrSize}
              level="M"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#000000"
              className="block h-full w-full object-contain"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-black/50">
              รอข้อความ
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <div className="flex w-full max-w-[260px] flex-col items-center gap-2 sm:flex-row sm:justify-center sm:flex-wrap">
          <button
            type="button"
            onClick={download}
            disabled={!hasValue || !ready}
            className={`${mini ? "min-h-8 px-2.5 py-1.5 text-xs" : "min-h-10 px-4 py-2 text-sm"} click-pop w-full rounded-full bg-[#ff7a18] font-semibold text-black transition hover:bg-[#ffb347] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto`}
          >
            ดาวน์โหลด
          </button>
          {isUrl ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className={`${mini ? "min-h-8 px-2.5 py-1.5 text-xs" : "min-h-10 px-4 py-2 text-sm"} click-pop flex w-full items-center justify-center rounded-full border border-[#ff7a18] text-center font-semibold text-[#ff7a18] transition hover:bg-[#ff7a18] hover:text-black sm:w-auto`}
            >
              เปิดลิงก์ / สแกน
            </a>
          ) : null}
        </div>
      </div>
    </>
  );

  if (compact) {
    return (
      <article
        className={`hover-glow rounded-2xl border border-white/10 bg-[#141414] ${mini ? "p-2" : "p-3 sm:p-4"}`}
      >
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className={`flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#1b1b1b] text-left text-white transition hover:border-[#ff7a18]/70 ${mini ? "px-2 py-2" : "gap-3 px-3 py-3"}`}
        >
          <span className={`${mini ? "text-xs" : "text-sm sm:text-base"} min-w-0 break-words font-semibold`}>{title}</span>
          <span className="shrink-0 rounded-full border border-[#ff7a18]/60 bg-[#ff7a18]/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#ffb347]">
            {expanded ? "ซ่อน" : "ดู QR"}
          </span>
        </button>
        {expanded ? <div className="mt-3">{content}</div> : null}
      </article>
    );
  }

  return (
    <article className="hover-glow rounded-2xl border border-white/10 bg-[#141414] p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
      {content}
    </article>
  );
}
