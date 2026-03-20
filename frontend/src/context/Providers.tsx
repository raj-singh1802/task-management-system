'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthContext';
import { useState } from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: { retry: 1, staleTime: 1000 * 60 },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
};