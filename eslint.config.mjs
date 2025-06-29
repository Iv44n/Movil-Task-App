// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import expoConfig from 'eslint-config-expo/flat.js'
import stylistic from '@stylistic/eslint-plugin'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'src/drizzle']
  },
  {
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
      '@stylistic/jsx': stylisticJsx
    },
    rules: {
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/comma-dangle': ['error', 'never'],
      '@stylistic/ts/block-spacing': ['error', 'always'],
      '@stylistic/ts/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/ts/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/brace-style': 'error',
      '@stylistic/ts/function-call-spacing': ['error', 'never'],
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['case', 'default'], next: '*' }
      ],
      '@stylistic/ts/space-infix-ops': 'error',
      '@stylistic/ts/type-annotation-spacing': 'error',
      '@stylistic/jsx/jsx-closing-bracket-location': 1,
      '@stylistic/jsx/jsx-closing-tag-location': 1,
      '@stylistic/jsx/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never', propElementValues: 'always' }
      ],
      '@stylistic/jsx/jsx-curly-newline': 'error'
    }
  }
])
