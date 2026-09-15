import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ChatWidget from "@/components/ChatWidget";
import AttributionTracker from "@/components/AttributionTracker";

export const metadata: Metadata = {
  title: "Black Top Digital | Marketing Built for the Trades",
  description: "Black Top Digital puts local businesses at the top of Google, ahead of their competitors: Google Business Profile optimization, local SEO, reviews, and websites that turn searches into phone calls.",
  keywords: "local SEO, Google Business Profile optimization, local marketing agency, truck repair marketing, plumber SEO, electrician SEO, emergency service marketing",
};

// OpenAI (ChatGPT) ads pixel, as supplied by the ads dashboard.
const OPENAI_PIXEL = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"XgXWaytVSHatmMn4Ekeq13",debug:false});`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: OPENAI_PIXEL }} />
      </head>
      <body style={{ background: '#000', color: '#f0f0f0', minHeight: '100vh' }}>
        <Nav />
        {/* Bottom padding keeps the floating chat bar from covering page footers. */}
        <main style={{ paddingTop: '64px', paddingBottom: '96px' }}>
          {children}
        </main>
        <ChatWidget />
        <AttributionTracker />
      </body>
    </html>
  );
}
