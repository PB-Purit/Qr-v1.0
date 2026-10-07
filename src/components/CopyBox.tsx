"use client";

import { useState } from "react";

type CopyBoxProps = {
  title: string;
  text: string;
  url?: string;
  urlLabel?: string;
  credentials?: {
    username: string;
    password: string;
  };
};

export function CopyBox({ title, text, url, urlLabel, credentials }: CopyBoxProps) {
  const [copied, setCopied] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const togglePassword = () => {
    setPasswordVisible((visible) => !visible);
  };

  return (
    <section className="hover-glow rounded-2xl border border-white/10 bg-black/40 p-3">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="text-sm font-semibold text-[#ffb347]">{title}</h4>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-300 underline underline-offset-2 hover:text-sky-200"
            >
              {urlLabel ?? "เปิดลิงก์"}
            </a>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copy}
          className="click-pop min-h-9 w-full rounded-full bg-[#ff7a18] px-3 py-1 text-xs font-semibold text-black hover:bg-[#ffb347] sm:w-auto"
        >
          {copied ? "คัดลอกแล้ว" : "คัดลอก"}
        </button>
      </div>
      {text ? (
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#0f0f0f] p-3 text-xs leading-5 text-white/90 sm:max-h-72">
          {text}
        </pre>
      ) : null}
      {credentials ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-[#0f0f0f] p-3 text-xs text-white/90">
          <p>US: {credentials.username}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span>PW:</span>
            <span aria-live="polite">
              {passwordVisible ? credentials.password : "••••••••"}
            </span>
            <button
              type="button"
              onClick={togglePassword}
              aria-label={passwordVisible ? "ซ่อนรหัสผ่าน" : "ดูรหัสผ่าน"}
              className="rounded-full border border-white/20 px-3 py-1 text-xs hover:border-[#ff7a18] hover:text-[#ffb347] disabled:opacity-60"
            >
              {passwordVisible ? "ซ่อน" : "ดูรหัสผ่าน"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
