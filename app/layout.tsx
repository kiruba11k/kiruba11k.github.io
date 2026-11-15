import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kirubakaran Periyasamy — GitHub Directory",
  description: "A living directory of Kirubakaran Periyasamy public GitHub repositories, projects and engineering interests.",
  metadataBase: new URL("https://kiruba11k.github.io"),
  openGraph: {
    title: "Kirubakaran Periyasamy — GitHub Directory",
    description: "Explore projects across agentic AI, RAG, computer vision, backend engineering and data.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
