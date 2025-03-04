import { ContainerPropsSchema as BaseContainerPropsSchema } from '@usewaypoint/block-container';
import { z } from 'zod';

export const ContainerPropsSchema = z.object({
  style: BaseContainerPropsSchema.shape.style,
  props: z
    .object({
      childrenIds: z.array(z.string()).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type ContainerProps = z.infer<typeof ContainerPropsSchema>;
