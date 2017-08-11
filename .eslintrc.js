module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    es6: true,
    jasmine: true
  },
  extends: 'airbnb-base',
  plugins: ['jasmine'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'arrow-body-style': 'off',
    indent: 'warn',
    'consistent-return': 'off',
    'no-else-return': 'off',
    'global-require': 'off',
    'no-param-reassign': ['error', { props: false }],
    'new-cap': 'off',
    'arrow-parens': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
