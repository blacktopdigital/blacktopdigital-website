import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Black Top Digital | AI-Powered Local Marketing That Gets Your Phone Ringing",
  description: "Black Top Digital uses AI to dominate local Google rankings, optimize your Google Business Profile, manage ads, and build websites that convert — for local businesses ready to grow.",
  keywords: "local SEO, Google Business Profile optimization, Google Ads management, local digital marketing agency, AI marketing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#000', color: '#f0f0f0', minHeight: '100vh' }}>
        <Nav />
        <main style={{ paddingTop: '64px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
