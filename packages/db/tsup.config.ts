import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/schema/index.ts',
    'src/types/index.ts',
    'src/constant.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: isProduction,
});
