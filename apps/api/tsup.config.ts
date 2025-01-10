import { defineConfig } from 'tsup';

export default defineConfig({
  tsconfig: './tsconfig.build.json',
  entry: ['src/hc.ts', 'src/hcs.ts'],
  format: ['esm'],
  outDir: 'dist',
  dts: true,
  clean: true,
  sourcemap: false,
  //! excluding dependencies.
  // external: [],
});
