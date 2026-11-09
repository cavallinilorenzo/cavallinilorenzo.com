import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Spline_Sans_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionEffects } from "@/components/MotionEffects";
import { TabBar } from "@/components/TabBar";
import { PAGES } from "@/content/copy";
import { JS_FLAG_SCRIPT } from "@/lib/reveal";
import "./globals.css";
import styles from "./layout.module.css";

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--display",
  display: "swap",
});
const mono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cavallinilorenzo.com"),
  title: PAGES.home.title,
  description: PAGES.home.description,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
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
