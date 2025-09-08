import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': 'off', // tu peux aussi mettre 'error' pour forcer
        // 👇 Ajoute cette ligne pour désactiver tous les warnings
        'no-warning-comments': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      // 'react-refresh/only-export-components': [
      //   'warn',
      //   { allowConstantExport: true },
      // ],
    },
      reportUnusedDisableDirectives: false, // (optionnel)
      warnIgnored: false,
  },
)
