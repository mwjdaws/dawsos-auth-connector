
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider component
 * 
 * Creates and provides a QueryClient instance to the application.
 * Uses useState to ensure the client is only created once per component instance.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient instance inside useState to ensure 
  // it's only created once per component instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        // Use meta for error handling instead of onError
        meta: {
          handleError: true
        }
      },
      mutations: {
        // Use meta for error handling instead of onError
        meta: {
          handleError: true
        }
      }
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
