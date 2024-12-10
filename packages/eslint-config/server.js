const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', '@typescript-eslint'],
  rules: {
    //! typescript
    '@typescript-eslint/no-redeclare': 0,
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/naming-convention': 0,
    //! import
    'import/prefer-default-export': 'off',
    'import/extensions': 0,
    'import/order': 'off',
    'import/no-extraneous-dependencies': 0,
    //! no
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'no-console': 0,
    'no-plusplus': 0,
    //! others
    'comma-dangle': 0,
    camelcase: 0,
    // 'consistent-return': 0,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['**/*.js'],
};
