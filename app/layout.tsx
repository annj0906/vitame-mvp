import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitame | 나를 위한 영양 루틴",
  description: "섭취 현황을 바탕으로 영양 루틴을 살펴보는 Vitame 프로토타입",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
