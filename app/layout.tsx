import type { Metadata } from "next";
import { GraphProvider } from "../context/GraphContext";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MathGeo | 3D Digital Math Visualizer",
  description: "A production-ready, performant, and beautiful 3D digital graphing and geometry application built with Next.js, React Three Fiber, and MathJS.",
};

export default function RootLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full dark antialiased ${orbitron.variable} ${shareTechMono.variable}`}>
      <body className="h-full w-full overflow-hidden bg-slate-950 text-slate-100 antialiased font-mono">
        <GraphProvider>
          {children}
        </GraphProvider>
      </body>
    </html>
  );
}
