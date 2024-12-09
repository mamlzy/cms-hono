import { hcWithType } from '@repo/api/hc';

export const hc = hcWithType(process.env.NEXT_PUBLIC_API_BASE_URL!);
