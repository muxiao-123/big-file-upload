/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
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
}
