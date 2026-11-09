import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionEffects } from "@/components/MotionEffects";
import { TabBar } from "@/components/TabBar";
import { PAGES } from "@/content/copy";
import { JS_FLAG_SCRIPT } from "@/lib/reveal";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";
import styles from "./layout.module.css";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--body",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cavallinilorenzo.com"),
  title: PAGES.home.title,
  description: PAGES.home.description,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
      </head>
      <body>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
        <TabBar />
        <MotionEffects />
      </body>
    </html>
  );
}
