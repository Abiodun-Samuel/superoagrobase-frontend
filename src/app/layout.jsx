import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import NextTopLoader from 'nextjs-toploader';
import { loadingIndicatorProperties } from '@/utils/config/lib.config';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/provider/QueryProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import { getAuth } from '@/server/auth.server';
import { getOrganizationJsonLd, getWebSiteJsonLd } from '@/utils/seo/seo.jsonld';
import { getRootLayoutViewport, getRootLayoutMetadata } from '@/utils/seo/seo.layout';
import JsonLdScripts from '@/components/provider/JsonLdScripts';

const outfit = Outfit({ subsets: ["latin"] });

export const viewport = getRootLayoutViewport();
export const metadata = getRootLayoutMetadata();

export default async function RootLayout({ children }) {
  const auth = await getAuth();
  const jsonLdScripts = [getOrganizationJsonLd, getWebSiteJsonLd];

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <JsonLdScripts generators={jsonLdScripts} />
      </head>

      <body className={`${outfit.className}`}>
        <QueryProvider>
          <Toaster />
          <NextTopLoader {...loadingIndicatorProperties} />
          <SidebarProvider>
            <AuthProvider initialAuth={auth}>
              {children}
            </AuthProvider>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}