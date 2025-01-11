import { hcWithType } from '@repo/api/hc';
import { AppRoute, hcs } from '@repo/api/hcs';

export const hc = hcWithType(process.env.NEXT_PUBLIC_API_BASE_URL!, {
  init: { credentials: 'include' },
});

/*
 * This code below has incorrect types, but works in "apps/api"
 */

export const hcsClient = hcs<AppRoute>(process.env.NEXT_PUBLIC_API_BASE_URL!, {
  init: { credentials: 'include' },
});
