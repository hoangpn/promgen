import gitignore from "eslint-config-flat-gitignore";
import pluginVue from "eslint-plugin-vue";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";


export default [
  gitignore(),
  ...pluginVue.configs["flat/recommended"],
  pluginPrettier,
  {
    rules: {
      "vue/max-attributes-per-line": "off",
      "vue/multi-word-component-names": "off",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
];
