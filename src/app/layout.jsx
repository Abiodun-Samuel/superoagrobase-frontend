import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import NextTopLoader from 'nextjs-toploader';
import { loadingIndicatorProperties } from '@/utils/config/lib.config';
import { Toaster } from 'react-hot-toast';
import { TanstackQueryProvider } from '@/components/provider/TanstackQueryProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import { getAuth } from '@/server/auth.action';
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/utils/seo/seo.jsonld';
import { getRootLayoutViewport, getRootLayoutMetadata } from '@/utils/seo/seo.layout';

const outfit = Outfit({
  subsets: ["latin"],
});

export const viewport = getRootLayoutViewport();
export const metadata = getRootLayoutMetadata();

export default async function RootLayout({ children }) {
  const auth = await getAuth();

  const jsonLdScripts = [
    getOrganizationJsonLd(),
    getWebSiteJsonLd(),
  ];

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {jsonLdScripts.map((jsonLd, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ))}
      </head>

      <body className={`${outfit.className}`}>
        <TanstackQueryProvider>
          <Toaster />
          <NextTopLoader {...loadingIndicatorProperties} />
          <SidebarProvider>
            <AuthProvider initialAuth={auth}>
              {children}
            </AuthProvider>
          </SidebarProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}