import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "김태경 (Taekyung Kim) | MyLink",
  description: "Frontend & Software Developer 김태경의 프로필, 프로젝트 및 주요 링크 허브",
  keywords: ["김태경", "개발자", "프론트엔드", "포트폴리오", "MyLink", "Next.js"],
  authors: [{ name: "김태경" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased"><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
