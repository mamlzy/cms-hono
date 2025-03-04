import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  entry: ['src/auth-client.ts', 'src/auth-server.ts'],
  format: ['esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: isProduction,
});
