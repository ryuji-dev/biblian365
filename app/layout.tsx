import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIBLIAN365 - 경건시간 & 성경통독",
  description: "서울에스라교회 청년부를 위한 경건시간 관리 및 1년 성경통독 앱",
  openGraph: {
    title: "BIBLIAN365 - 경건시간 & 성경통독",
    description: "서울에스라교회 청년부를 위한 경건시간 관리 및 1년 성경통독 앱",
    images: [
      {
        url: "/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "BIBLIAN365",
      },
    ],
    type: "website",
  },
  manifest: "/manifest.webmanifest",
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
