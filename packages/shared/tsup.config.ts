import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/types/index.ts',
    'src/schemas/index.ts',
    'src/constants.ts',
    'src/lib/zod.ts',
    'src/lib/utils.ts',
  ],
  format: ['esm'],
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: false,
  //! excluding dependencies.
  external: [],
});
