/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        useTabs: false,
        printWidth: 80,
        tabWidth: 2,
        quoteProps: 'as-needed',
        // trailingComma: 'es5',
        arrowParens: 'always',
        vueIndentScriptAndStyle: true,
      },
    ],
  },
  overrides: [
    {
      files: ['api/types/index.js'],
      rules: {
        'prettier/prettier': ['off'],
      },
    },
  ],
}
