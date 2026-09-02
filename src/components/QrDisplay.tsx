"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

type QrDisplayProps = {
  value: string;
  title: string;
  subtitle?: string;
  fileName?: string;
  compact?: boolean;
};

export function QrDisplay({
  value,
  title,
  subtitle,
  fileName,
  compact = false,
}: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState(compact ? 168 : 200);
  const hasValue = Boolean(value.trim());
  const isUrl = /^https?:\/\//i.test(value);

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

  return (
    <article className="hover-glow rounded-2xl border border-white/10 bg-[#141414] p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
      {subtitle ? (
        <p className="mt-1 break-all text-xs text-white/60">{subtitle}</p>
      ) : null}
      <div
        className={`mx-auto mt-3 aspect-square w-full overflow-hidden rounded-xl bg-white ${
          compact ? "max-w-[176px]" : "max-w-[208px] sm:max-w-[224px]"
        }`}
      >
        <div ref={frameRef} className="h-full w-full">
          {hasValue && ready ? (
            <QRCodeCanvas
              ref={canvasRef}
              value={value}
              size={size}
              level="M"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#000000"
              className="block h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-black/50">
              รอข้อความ
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={download}
          disabled={!hasValue || !ready}
          className="click-pop min-h-10 w-full rounded-full bg-[#ff7a18] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ffb347] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          ดาวน์โหลด
        </button>
        {isUrl ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="click-pop flex min-h-10 w-full items-center justify-center rounded-full border border-[#ff7a18] px-4 py-2 text-center text-sm font-semibold text-[#ff7a18] transition hover:bg-[#ff7a18] hover:text-black sm:w-auto"
          >
            เปิดลิงก์ / สแกน
          </a>
        ) : null}
      </div>
    </article>
  );
}
