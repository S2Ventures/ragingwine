import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Raging Wine | Your Wine Adventure Wingman',
  description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations. We help you make better wine decisions when dining out.',
  keywords: ['wine list', 'restaurant wine', 'wine reviews', 'wine pairing', 'wine guide'],
  openGraph: {
    title: 'Raging Wine | Your Wine Adventure Wingman',
    description: 'Restaurant wine list reviews, city guides, and AI-powered recommendations.',
    url: 'https://ragingwine.com',
    siteName: 'Raging Wine',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script id="chatbase-widget" strategy="lazyOnload">
          {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="VfiyzUzWeXBsznKfVXp1P";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
        </Script>
      </body>
    </html>
  );
}
