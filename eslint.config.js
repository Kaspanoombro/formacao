import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // example project rules
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      'prefer-const': 'warn',
      'no-constant-binary-expression': 'error',
    },
  },
);
