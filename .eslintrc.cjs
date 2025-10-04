module.exports = {
  env: { browser: true, es2022: true },
  extends: ['eslint:recommended','plugin:react/recommended','plugin:react-hooks/recommended','prettier'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  rules: { 'react/prop-types': 'off','react/react-in-jsx-scope': 'off','no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] }
};