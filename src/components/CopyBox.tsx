"use client";

import { useState } from "react";

type CopyBoxProps = {
  title: string;
  text: string;
};

export function CopyBox({ title, text }: CopyBoxProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <section className="hover-glow rounded-2xl border border-white/10 bg-black/40 p-3">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-sm font-semibold text-[#ffb347]">{title}</h4>
        <button
          type="button"
          onClick={copy}
          className="click-pop min-h-9 w-full rounded-full bg-[#ff7a18] px-3 py-1 text-xs font-semibold text-black hover:bg-[#ffb347] sm:w-auto"
        >
          {copied ? "คัดลอกแล้ว" : "คัดลอก"}
        </button>
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#0f0f0f] p-3 text-xs leading-5 text-white/90 sm:max-h-72">
        {text}
      </pre>
    </section>
  );
}
