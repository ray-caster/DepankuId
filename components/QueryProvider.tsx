'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ReactNode } from 'react';
import { ApplicationProvider } from '@/contexts/ApplicationContext';
import { OpportunityProvider } from '@/contexts/OpportunityContext';

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider>
        <OpportunityProvider>
          {children}
        </OpportunityProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}

