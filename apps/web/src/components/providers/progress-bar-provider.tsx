'use client';

import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider
      height='4px'
      color='hsl(var(--primary))'
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
