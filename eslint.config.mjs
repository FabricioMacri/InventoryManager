import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: { 
        ...globals.browser, 
        ...globals.node 
      }
    }
  },
  pluginJs.configs.recommended,
  {
    files: ["src/test/**/*.js"], // Asegúrate de que esta configuración solo aplique a los archivos de test
    env: {
      mocha: true
    },
    plugins: ["mocha"],
    rules: {
      "mocha/no-exclusive-tests": "error"
    }
  },
];
