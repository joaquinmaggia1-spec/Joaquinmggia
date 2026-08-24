import { CONFIG } from './config'
import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'KRIPTONITA — Escalamos casinos online con paid media de alto rendimiento',
  description: 'Operamos campañas en Meta, Google y TikTok para operadores de iGaming. +47 casinos escalados, CPA promedio reducido -63%, ROAS sostenido sobre 8.4x.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'KRIPTONITA — Escalamos casinos online con paid media de alto rendimiento',
    description: 'Performance marketing para iGaming. Auditoría, reestructura de tracking, calibración y escalada.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  const pixelId = CONFIG.META_PIXEL_ID

  return (
    <html lang="es">
      <head>
        {/* Meta Pixel — Base Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  )
}
