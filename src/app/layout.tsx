import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laboratório de Tesouraria — Prof. José Américo",
  description:
    "Simulações interativas para o aprendizado prático da gestão de tesouraria de empresas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${serif.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
