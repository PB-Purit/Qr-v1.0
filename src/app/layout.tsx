import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Store PM 1 QR | ST 11142 Loss Prevention",
  description: "สร้าง QR Code และเทมเพลตรายงานสาขาเพชรเกษม 1",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={prompt.variable}>
      <body className="min-h-dvh overflow-x-hidden bg-black font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
