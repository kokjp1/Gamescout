import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        List: "readonly", 
        resetAnimations: "readonly", 
      }
    },
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^resetAnimations$" }]
    }
  },
  pluginJs.configs.recommended,
];

// ESLint config file laten schrijven door ChatGPT omdat ESLint een probleem heeft met ListJS