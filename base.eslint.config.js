import typescript from '@nx/eslint-plugin/typescript.js';
import nx from '@nx/eslint-plugin/nx.js';
import jsonc from "jsonc-eslint-parser"

export default [
  { plugins: nx },
  ...typescript.configs.javascript,
  ...typescript.configs.typescript,
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    "files": ["**/*.json"],
    languageOptions: {
      "parser": jsonc
    },
    "rules": {
      "@nx/dependency-checks": "error"
    }
  }
];
