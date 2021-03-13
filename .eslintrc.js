module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "import/prefer-default-export": "off",
    "import/extensions": [0, { js: "always" }],
    "max-len": ["error", { ignoreComments: true }],
    "no-console": "off",
    "no-alert": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "prefer-arrow-callback": "off",
    "func-names": "off",
  },
  plugins: ["jest"],
};
