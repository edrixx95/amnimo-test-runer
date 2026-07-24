import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_', 'caughtErrorsIgnorePattern': '^_' }],
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-unused-vars': 'off',
      'no-empty': 'error',
      'vue/block-order': ['error', {
        'order': [ 'script', 'template', 'style' ]
      }],
      'vue/no-v-html': 'warn'
    }
  }
)
