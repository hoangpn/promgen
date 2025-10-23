import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Demo from "../views/Demo.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Home, name: "home" },
    { path: "/demo", component: Demo, name: "demo" },
  ],
});

export default router;
