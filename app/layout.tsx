import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Kirubakaran Periyasamy — GitHub Directory",
  description: "A living directory of Kirubakaran Periyasamy's public GitHub repositories, projects and engineering interests.",
  metadataBase: new URL("https://kiruba11k.github.io")
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}