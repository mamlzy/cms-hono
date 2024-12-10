module.exports = {
  root: true,
  extends: ['@repo/eslint-config/server.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    'import/no-cycle': 'off',
  },
};
