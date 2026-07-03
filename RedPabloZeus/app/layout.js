import { CONFIG } from './config'
import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'RED ZEUS — Bono de bienvenida 100%',
  description: 'Duplicá tu primera carga con el bono de bienvenida del 100%. Retiros en menos de 10 minutos. Reclamá por WhatsApp al instante.',
  openGraph: {
    title: 'RED ZEUS — Bono de bienvenida 100%',
    description: 'Duplicá tu primera carga. Bono del 100% para nuevos jugadores. Reclamá ya por WhatsApp.',
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
