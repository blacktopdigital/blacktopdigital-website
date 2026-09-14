import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Black Top Digital | AI-Powered Local Marketing That Gets Your Phone Ringing",
  description: "Black Top Digital uses AI to dominate local Google rankings, optimize your Google Business Profile, and build websites that convert — for truck repair shops, plumbers, electricians, and emergency service businesses.",
  keywords: "local SEO, Google Business Profile optimization, truck repair marketing, plumber SEO, electrician SEO, emergency service marketing, AI marketing",
};

// OpenAI (ChatGPT) ads pixel, as supplied by the ads dashboard.
const OPENAI_PIXEL = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"XgXWaytVSHatmMn4Ekeq13",debug:true});`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: OPENAI_PIXEL }} />
      </head>
      <body style={{ background: '#000', color: '#f0f0f0', minHeight: '100vh' }}>
        <Nav />
        <main style={{ paddingTop: '64px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
