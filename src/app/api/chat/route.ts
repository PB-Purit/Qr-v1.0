import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  id: string;
  name: string;
  message: string;
  sentAt: string;
  maskedIp: string;
};

const messages: ChatMessage[] = [];
const nameOwners = new Map<string, string>();
const maxMessages = 200;

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return forwardedIp || request.headers.get("x-real-ip") || "unknown";
};

const normalizeIp = (ip: string) => ip.replace(/^::ffff:/, "").replace(/^\[|\]$/g, "");

const maskIp = (ip: string) => {
  const normalizedIp = normalizeIp(ip);
  const ipv4Parts = normalizedIp.split(".");
  if (ipv4Parts.length === 4 && ipv4Parts.every((part) => /^\d+$/.test(part))) {
    return `${ipv4Parts.slice(0, 3).join(".")}.xxx`;
  }

  const ipv6Parts = normalizedIp.split(":");
  if (ipv6Parts.length > 2) {
    return `${ipv6Parts.slice(0, -2).join(":")}:xxxx:xxxx`;
  }

  return "ซ่อนเพื่อความเป็นส่วนตัว";
};

const fingerprintIp = (ip: string) =>
  createHash("sha256").update(normalizeIp(ip)).digest("hex");

const normalizeName = (name: string) => name.normalize("NFKC").toLocaleLowerCase();

export async function GET() {
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    message?: unknown;
  } | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !message || name.length > 40 || message.length > 500) {
    return NextResponse.json({ error: "ชื่อหรือข้อความไม่ถูกต้อง" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipFingerprint = fingerprintIp(ip);
  const nameKey = normalizeName(name);
  const owner = nameOwners.get(nameKey);
  if (owner && owner !== ipFingerprint) {
    return NextResponse.json(
      { error: "ชื่อนี้ถูกใช้งานจากเครื่องอื่นแล้ว กรุณาใช้ชื่ออื่น" },
      { status: 409 },
    );
  }

  nameOwners.set(nameKey, ipFingerprint);
  messages.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    message,
    sentAt: new Date().toISOString(),
    maskedIp: maskIp(ip),
  });
  if (messages.length > maxMessages) messages.splice(0, messages.length - maxMessages);

  return NextResponse.json({ message: messages[messages.length - 1] }, { status: 201 });
}