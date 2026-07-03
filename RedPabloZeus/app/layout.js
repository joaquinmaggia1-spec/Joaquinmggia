import { CONFIG } from './config'
import Script from 'next/script'
import './globals.css'

export const metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: 'RED ZEUS — Bono de bienvenida 100%',
  description: 'Duplicá tu primera carga con el bono de bienvenida del 100%. Retiros en menos de 10 minutos. Reclamá por WhatsApp al instante.',
  alternates: {
    canonical: CONFIG.SITE_URL,
  },
  openGraph: {
    title: 'RED ZEUS — Bono de bienvenida 100%',
    description: 'Duplicá tu primera carga. Bono del 100% para nuevos jugadores. Retiros en menos de 10 min. Reclamá ya por WhatsApp.',
    type: 'website',
    url: CONFIG.SITE_URL,
    siteName: 'RED ZEUS',
    locale: 'es_AR',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'RED ZEUS — Bono de bienvenida 100%',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RED ZEUS — Bono de bienvenida 100%',
    description: 'Duplicá tu primera carga. Bono del 100% para nuevos jugadores.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }) {
  const pixelId = CONFIG.META_PIXEL_ID

  return (
    <html lang="es">
      <head>
        {/* Meta domain verification — completá FB_DOMAIN_VERIFICATION en config.js */}
        {CONFIG.FB_DOMAIN_VERIFICATION && (
          <meta name="facebook-domain-verification" content={CONFIG.FB_DOMAIN_VERIFICATION} />
        )}

        {/* Meta Pixel */}
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
            fbq('track', 'ViewContent', {
              content_name: 'Landing Bono 100%',
              content_category: 'Casino',
              content_ids: ['bono-100'],
              content_type: 'product',
              currency: 'ARS',
            });
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
