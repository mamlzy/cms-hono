import { defineConfig } from 'tsup';

export default defineConfig({
  // tsconfig: './tsconfig.build.json',
  entry: ['src/index.ts', 'src/lib/hc.ts', 'src/lib/hcs.ts'],
  format: ['esm'],
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: false,
  //! excluding dependencies.
  // external: [],
});
