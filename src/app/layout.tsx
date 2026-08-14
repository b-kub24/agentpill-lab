import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentpill Lab",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
