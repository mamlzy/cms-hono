const path = require('path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  settings: {
    tailwindcss: {
      config: path.join(__dirname, './tailwind.config.ts'),
    },
  },
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
  },
};
