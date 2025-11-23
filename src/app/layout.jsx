import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import NextTopLoader from 'nextjs-toploader';
import { loadingIndicatorProperties } from '@/utils/config';
import { Toaster } from 'react-hot-toast';
import { TanstackQueryProvider } from '@/components/provider/TanstackQueryProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import { getAuth } from '@/server/auth.action';

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const auth = await getAuth();
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="max-image-preview:large, NOODP, NOYDIR" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" type="image/png" href="/favicon/apple-touch-icon.png" />
        <link rel="apple-touch-icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        <link rel="manifest" href="/favicon/site.webmanifest"></link>
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Toaster />
        <NextTopLoader {...loadingIndicatorProperties} />
        <TanstackQueryProvider>
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
