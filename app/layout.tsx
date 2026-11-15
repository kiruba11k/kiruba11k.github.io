import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirubakaran Periyasamy — AI / ML Engineer",
  description: "AI/ML Engineer in Bengaluru with 1.5+ years of experience in machine learning, deep learning, computer vision, NLP and Generative AI.",
  metadataBase: new URL("https://kiruba11k.github.io"),
  openGraph: {
    title: "Kirubakaran Periyasamy — GitHub Directory",
    description: "Explore AI/ML projects across computer vision, LLM fine-tuning, RAG pipelines and production AI engineering.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
