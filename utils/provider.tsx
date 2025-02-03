'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'next-themes';
import 'prism-themes/themes/prism-one-dark.min.css';
//import "prism-themes/themes/prism-night-owl.css"
//import { Toaster } from "@/components/ui/toaster";
import { Toaster } from '@/components/ui/sonner';
import { AuthContextProvider } from '@/context/AuthContext';

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default Providers;
