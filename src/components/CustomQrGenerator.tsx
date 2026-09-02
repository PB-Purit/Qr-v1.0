"use client";

import { useMemo, useState } from "react";
import { QrDisplay } from "./QrDisplay";

export function CustomQrGenerator() {
  const [text, setText] = useState("");
  const value = useMemo(() => text.trim(), [text]);

  return (
    <section className="animate-rise rounded-2xl border border-white/10 bg-[#111] p-4 sm:rounded-3xl sm:p-5">
      <h2 className="text-xl font-bold sm:text-2xl">1. สร้าง QR Code เอง</h2>
      <p className="mt-1 text-sm text-white/70">
        พิมพ์ข้อความ ตัวเลข หรือลิงก์ที่ต้องการสร้าง แสดงผลเป็น QR Code สแกนและดาวน์โหลดได้
      </p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="พิมพ์ข้อความ ตัวเลข หรือลิงก์..."
        className="mt-4 min-h-24 w-full rounded-2xl border border-white/15 bg-black px-3 py-3 text-base text-white outline-none transition focus:border-[#ff7a18] sm:min-h-28 sm:px-4"
      />
      {value ? (
        <div className="mt-4 w-full max-w-sm">
          <QrDisplay
            title="ผลลัพธ์ QR"
            subtitle={value}
            value={value}
            fileName="custom-qr"
          />
        </div>
      ) : null}
    </section>
  );
}
