module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-async-promise-executor': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true,
      },
    ],
    '@typescript-eslint/no-namespace': [
      'error',
      {
        allowDeclarations: true,
      },
    ],
    'import/order': 'off',
    'import/first': 'off',
    'comma-dangle': 'off',
    indent: 'off',
    arraysInObjects: 0,
    'require-jsdoc': 0,
    'object-curly-spacing': 0,
    'max-len': 0,
    'linebreak-style': ['error', 'windows'],
    'import/extensions': 'off',
    'lines-between-class-members': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'consistent-return': 'off',
    'no-continue': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-else-return': 'off',
    'no-unneeded-ternary': 'off',
    'no-nested-ternary': 'off',
    'import/prefer-default-export': 'off',
  },

  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.ts'],
        paths: ['node_modules/', 'node_modules/@types'],
      },
    },
  },
};
