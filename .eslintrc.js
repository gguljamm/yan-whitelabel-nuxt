module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'max-len': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'always', {
      'js': 'always',
      'vue': 'always'
    }],
    "template-curly-spacing" : "off",
    "indent" : "off",
    'no-alert': 'off',
  }
};
