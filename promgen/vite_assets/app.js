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

/******** primevue **********/
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Tooltip from 'primevue/tooltip';

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// Register PrimeVue directives
app.directive('tooltip', Tooltip);
/****************************/

/******** styles ************/
// Import Bootstrap CSS (via CDN in index.html, or import here if using npm)
// Bootstrap is loaded via Django static files
// PrimeVue theme is applied via PrimeVue config
/****************************/

app.mount("#vue-app");
