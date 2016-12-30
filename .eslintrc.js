module.exports = {
  parser: 'babel-eslint',
  plugins: ['react'],
  // extends: 'eslint:recommended',
  extends: ['eslint:recommended', "plugin:react/recommended"],
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  globals: {
    "module": false,
    "require": false,
    "Promise": false
  },
  rules: {
    "require-jsdoc": 0,
    "comma-dangle": 0,
    "indent": [1, 2],
    "no-console": [1, { "allow": ["info"] }],
    "quotes": [1, "single"],
    "react/jsx-uses-vars": [2]
  }
};