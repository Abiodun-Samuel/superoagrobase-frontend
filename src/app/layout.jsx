import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import NextTopLoader from 'nextjs-toploader';
import { loadingIndicatorProperties } from '@/utils/config';
import { Toaster } from 'react-hot-toast';
import { TanstackQueryProvider } from '@/components/provider/TanstackQueryProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import { getAuth } from '@/lib/auth';

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const auth = await getAuth();
  return (
    <html lang="en">
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
