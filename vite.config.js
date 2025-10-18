import { defineConfig, loadEnv } from "vite";
import { resolve, join } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd(), "");

  const INPUT_DIR = "./promgen/vite_assets";
  const OUTPUT_DIR = "./promgen/vite_assets_dist";

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(INPUT_DIR),
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },
    root: resolve(INPUT_DIR),
    base: "/static/",
    server: {
      host: env.DJANGO_VITE_DEV_SERVER_HOST,
      port: env.DJANGO_VITE_DEV_SERVER_PORT,
    },
    build: {
      manifest: true,
      emptyOutDir: true,
      outDir: resolve(OUTPUT_DIR),
      rollupOptions: {
        input: {
          app: join(INPUT_DIR, "/app.js"),
          css: join(INPUT_DIR, "/styles/app.css.js"),
        },
      },
    },
  };
});
