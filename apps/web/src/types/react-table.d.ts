import { CellContext } from '@tanstack/react-table';

import { TableCellProps } from '@/components/ui/table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    // Your additional properties here
    width?: string;
    getCellContext?: (
      context: CellContext<TData, TValue>
    ) => TableCellProps | void;
  }
}
