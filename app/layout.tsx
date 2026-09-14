import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Black Top Digital | AI-Powered Local Marketing That Gets Your Phone Ringing",
  description: "Black Top Digital uses AI to dominate local Google rankings, optimize your Google Business Profile, and build websites that convert — for truck repair shops, plumbers, electricians, and emergency service businesses.",
  keywords: "local SEO, Google Business Profile optimization, truck repair marketing, plumber SEO, electrician SEO, emergency service marketing, AI marketing",
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
