import cheminfo from 'eslint-config-cheminfo-typescript';

export default [
  ...cheminfo,
  {
    languageOptions: {
      globals: {
        __dirname: 'readonly',
      },
    },
    rules: {
      'unicorn/no-object-as-default-parameter': 'off',
    },
  },
];
