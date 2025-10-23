/******** vue ***************/
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
/****************************/

/******** vue-i18n **********/
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: "en",
  messages: {
    en,
    ja,
  },
});

app.use(i18n);
/****************************/

/******** vue-router ********/
import router from "./router";

app.use(router);
/****************************/

/******** pinia *************/
import { createPinia } from "pinia";

app.use(createPinia());
/****************************/

app.mount("#vue-app");
