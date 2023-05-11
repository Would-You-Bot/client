module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'google'],
  rules: {
    quotes: ['error', 'double'],
    arraysInObjects: 0,
    'require-jsdoc': 0,
    'object-curly-spacing': 0,
    'max-len': 0,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
