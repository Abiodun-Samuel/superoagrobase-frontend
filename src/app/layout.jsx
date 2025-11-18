import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import NextTopLoader from 'nextjs-toploader';
import { loadingIndicatorProperties } from '@/utils/config';
import { Toaster } from 'react-hot-toast';
import { TanstackQueryProvider } from '@/lib/TanstackQueryProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Toaster />
        <TanstackQueryProvider>
          <NextTopLoader {...loadingIndicatorProperties} />
          <SidebarProvider>{children}</SidebarProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
