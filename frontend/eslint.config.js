import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings:{
      react: {
        version: "detect"
      }
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/function-component-definition": [
      "error",
      {
        "namedComponents": "function-declaration",
      }
    ],
      "no-empty-object": false,
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "react/react-in-jsx-scope": "off",
      "react/function-component-definition": [
        "error",
        {
          "namedComponents": "function-declaration",
          "unnamedComponents": "function-expression"
        }]
      },
    },
)
