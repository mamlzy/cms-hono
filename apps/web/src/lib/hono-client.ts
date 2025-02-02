import { hcWithType } from '@repo/api/hc';
import { hcsWithType, type AppRoute } from '@repo/api/hcs';

export const hc = hcWithType(process.env.NEXT_PUBLIC_API_BASE_URL!, {
  init: { credentials: 'include' },
});

export const hcs = hcsWithType<AppRoute>(
  process.env.NEXT_PUBLIC_API_BASE_URL!,
  {
    init: { credentials: 'include' },
  }
);
