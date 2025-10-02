import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import AuthStatus from "@/components/AuthStatus";
import styles from "./layout.module.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = process.env.SITE_NAME ?? "CIS";

export const metadata: Metadata = {
  title: siteName,
  description: `${siteName} practice site`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <header className={styles.siteHeader}>
            <div className={styles.brandGroup}>
              <Link href="/" className={styles.brand}>
                {siteName}
              </Link>
              <nav className={styles.navLinks} aria-label="主要ナビゲーション">
                <Link href="/study" className={styles.navLink}>
                  テキスト
                </Link>
              </nav>
            </div>
            <AuthStatus />
          </header>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
