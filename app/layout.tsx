import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biblian365 - 경건시간 & 성경통독",
  description: "교회 청년부를 위한 경건시간 관리 및 1년 성경통독 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
