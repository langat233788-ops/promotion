import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "backend/node_modules",
  ]),

  // ===========================
  // React Frontend
  // ===========================

  {
    files: ["src/**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // ===========================
  // Node Backend
  // ===========================

  {
    files: ["backend/**/*.js"],

    extends: [js.configs.recommended],

    languageOptions: {
      globals: globals.node,

      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
]);