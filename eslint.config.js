import gitignore from "eslint-config-flat-gitignore";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";


export default [
  gitignore(),
  ...pluginVue.configs["flat/recommended"],
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
