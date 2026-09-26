"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Clock } from "lucide-react";

type ScanPopupProps = {
  open: boolean;
  onClose: () => void;
};

export function ScanPopup({ open, onClose }: ScanPopupProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [scannedPoints, setScannedPoints] = useState<string[]>([]);
  const requiredTime = 120; // 2 minutes in seconds

  useEffect(() => {
    if (!open) {
      setElapsedTime(0);
      setCanSubmit(false);
      setScannedPoints([]);
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= requiredTime) {
          setCanSubmit(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePoint = (point: string) => {
    setScannedPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const points = [
    "จุดตรวจสอบที่ 1",
    "จุดตรวจสอบที่ 2",
    "จุดตรวจสอบที่ 3",
    "จุดตรวจสอบที่ 4",
    "จุดตรวจสอบที่ 5",
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="ปิดป๊อปอัพ"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border border-[#ff7a18]/40 bg-[#0d0d0d] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-[#ff7a18]">สแกนจุดตรวจสอบ</h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/20 p-2 text-white/60 hover:border-[#ff7a18] hover:text-[#ff7a18]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-white/10 bg-[#181818] p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="text-[#ffb347]" size={20} aria-hidden="true" />
              <span className="text-sm font-medium text-white">เวลาที่ผ่านไป:</span>
            </div>
            <span className={`text-lg font-bold ${canSubmit ? "text-emerald-400" : "text-red-500"}`}>
              {formatTime(elapsedTime)}
            </span>
          </div>
          <p className="mt-2 text-xs text-white/50">
            {canSubmit
              ? "✅ ผ่านเวลาขั้นต่ำ 2 นาทีแล้ว สามารถกดส่งได้"
              : `⏳ กรุณารออีก ${formatTime(requiredTime - elapsedTime)} ก่อนกดส่ง`}
          </p>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm font-semibold text-white/80">เลือกจุดที่สแกนแล้ว:</p>
          {points.map((point) => (
            <button
              key={point}
              type="button"
              onClick={() => togglePoint(point)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                scannedPoints.includes(point)
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-[#181818] text-white/70 hover:border-white/20"
              }`}
            >
              {scannedPoints.includes(point) ? (
                <CheckCircle2 className="shrink-0 text-emerald-400" size={16} aria-hidden="true" />
              ) : (
                <div className="shrink-0 h-4 w-4 rounded-full border-2 border-white/30" />
              )}
              {point}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!canSubmit || scannedPoints.length === 0}
          className="click-pop w-full rounded-lg bg-[#ff7a18] px-4 py-3 font-semibold text-black transition hover:bg-[#ffb347] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => {
            alert(`ส่งข้อมูลสำเร็จ!\nสแกนแล้ว ${scannedPoints.length} จุด`);
            onClose();
          }}
        >
          {canSubmit ? "ส่งข้อมูล" : `รอ ${formatTime(requiredTime - elapsedTime)}`}
        </button>
      </div>
    </div>
  );
}
