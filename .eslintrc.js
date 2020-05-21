module.exports = {
  env: {
    browser: true
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    project: "./tsconfig.eslint.json"
  },
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["class"] }],
    "react/jsx-key": "off",
    "@typescript-eslint/interface-name-prefix": "off"
  },
  settings: {
    react: {
      pragma: "h",
      version: "detect"
    }
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ]
};
