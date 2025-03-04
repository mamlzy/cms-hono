import { ColumnsContainerPropsSchema as BaseColumnsContainerPropsSchema } from '@usewaypoint/block-columns-container';
import { z } from 'zod';

const BasePropsShape = BaseColumnsContainerPropsSchema.shape.props
  .unwrap()
  .unwrap().shape;

export const ColumnsContainerPropsSchema = z.object({
  style: BaseColumnsContainerPropsSchema.shape.style,
  props: z
    .object({
      ...BasePropsShape,
      columns: z.tuple([
        z.object({ childrenIds: z.array(z.string()) }),
        z.object({ childrenIds: z.array(z.string()) }),
        z.object({ childrenIds: z.array(z.string()) }),
      ]),
    })
    .optional()
    .nullable(),
});

export type ColumnsContainerProps = z.infer<typeof ColumnsContainerPropsSchema>;
