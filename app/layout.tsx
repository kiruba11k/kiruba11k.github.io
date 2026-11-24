import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirubakaran Periyasamy — AI / ML Engineer",
  description: "AI/ML Engineer in Bengaluru building computer vision, NLP and Generative AI systems. An open-world portfolio with missions, a weapon wheel of skills and a garage of live GitHub repositories.",
  metadataBase: new URL("https://kiruba11k.github.io"),
  openGraph: {
    title: "Kirubakaran Periyasamy — AI / ML Engineer",
    description: "Open-world portfolio: computer vision, LLM fine-tuning, RAG pipelines and production AI engineering.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0b0614" }, { media: "(prefers-color-scheme: light)", color: "#f6eee3" }]
};

const boot = `try{var t=localStorage.getItem("kp-theme"),f=localStorage.getItem("kp-font");document.documentElement.dataset.theme=t==="day"?"light":"dark";if(f)document.documentElement.dataset.font=f}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" data-font="allo" suppressHydrationWarning>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=JetBrains+Mono:wght@400;500;600&family=Silkscreen:wght@400;700&display=swap" />
      <script dangerouslySetInnerHTML={{ __html: boot }} />
    </head>
    <body>{children}</body>
  </html>;
}
