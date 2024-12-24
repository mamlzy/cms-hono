const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:prettier/recommended',
    'turbo',
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    project,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    'node_modules/',
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
  rules: {
    //! TS
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    //! try to fix lags issue
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/no-shadow': 'off',
    //! react
    'react-hooks/exhaustive-deps': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['function-declaration', 'arrow-function'],
        unnamedComponents: 'arrow-function',
      },
    ],
    'react-hooks/rules-of-hooks': 'off',
    'react/no-unescaped-entities': 'off',
    //! jsx-a11y
    'jsx-a11y/label-has-associated-control': 'off',
    //! tailwindcss
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': 'error',
    //! import
    'import/order': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    //! no
    'no-console': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
  },
};
