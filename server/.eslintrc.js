module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
  },
};
