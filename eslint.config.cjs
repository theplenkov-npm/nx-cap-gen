const nx = require('@nx/eslint-plugin');
const jsonc = require('jsonc-eslint-parser');
const eslint = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  eslint.configs.recommended,
  prettier,
  ...nx.configs['flat/base'],
  ...merge({ files: ['**/*.ts', '**/*.{m,c}ts'] }, nx.configs['flat/typescript']),
  {
    ignores: ['.nx/', '**/dist'],
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
    files: ['**/*.json'],
    languageOptions: {
      parser: jsonc,
    },
    rules: {
      '@nx/dependency-checks': 'error',
    },
  }
];

function merge(object, configs) {
  return configs.map(config => Object.assign({}, object, config))
}
