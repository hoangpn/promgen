# Modern Vue/Vite Setup

## Overview

Promgen is migrating to a modern frontend stack using Vite as the build tool and Vue 3 Single File Components (SFCs). This is an **in-progress migration** running parallel to the legacy system.

## Technology Stack

- **Vite** - Fast build tool and dev server
- **Vue 3** - Composition API and `<script setup>`
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **PrimeVue** - UI component library
- **Axios** - HTTP client
- **vue-i18n** - Internationalization

## Directory Structure

```
promgen/vite_assets/
├── app.js                    # Main entry point
├── App.vue                   # Root component
├── components/               # Reusable components
│   └── ServicesList.vue
├── views/                    # Page components
│   ├── Home.vue
│   └── Demo.vue
├── router/                   # Vue Router config
│   └── index.js
├── stores/                   # Pinia stores
│   └── (to be created)
├── locales/                  # i18n translations
│   ├── en.json
│   └── ja.json
└── styles/                   # CSS/SCSS files
    └── app.css.js
```

Built output:

```
promgen/vite_assets_dist/
├── assets/
│   ├── app-[hash].js
│   ├── css-[hash].css
│   └── ...
└── .vite/
    └── manifest.json
```

## Configuration

### package.json

```json
{
  "name": "promgen",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint promgen/vite_assets --ext .js,.vue",
    "format": "prettier --write promgen/vite_assets"
  },
  "dependencies": {
    "@primeuix/themes": "1.2.5",
    "axios": "^1.18.1",
    "pinia": "3.0.3",
    "primevue": "4.4.1",
    "vue": "3.5.22",
    "vue-router": "4.6.3"
  },
  "devDependencies": {
    "@intlify/unplugin-vue-i18n": "11.0.1",
    "@vitejs/plugin-vue": "6.0.1",
    "eslint": "9.38.0",
    "eslint-config-prettier": "10.1.8",
    "eslint-plugin-vue": "10.5.1",
    "prettier": "3.6.2",
    "vite": "^7.3.6"
  }
}
```

### vite.config.js

```javascript
import { defineConfig, loadEnv } from "vite";
import { resolve, join } from "path";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig((mode) => {
  const env = loadEnv(mode, process.cwd(), "");

  const INPUT_DIR = "./promgen/vite_assets";
  const OUTPUT_DIR = "./promgen/vite_assets_dist";

  return {
    plugins: [vue(), vueI18n()],
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
```

**Key Configuration:**
- **Root**: Vite's root is `promgen/vite_assets/`
- **Base**: Assets served from `/static/`
- **Alias**: `@` resolves to `promgen/vite_assets/`
- **Output**: Built files go to `promgen/vite_assets_dist/`
- **Manifest**: Generates manifest.json for Django integration

### eslint.config.js

```javascript
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  prettier,
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
```

## Application Entry Point

### app.js

```javascript
/******** vue ***************/
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

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

/******** vue-router ********/
import router from "./router";

app.use(router);

/******** pinia *************/
import { createPinia } from "pinia";

app.use(createPinia());

/******** primevue **********/
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// Mount the app
app.mount("#vue-app");
```

## Root Component

### App.vue

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Component setup
</script>

<style scoped>
/* Component styles */
</style>
```

## Routing

### router/index.js

```javascript
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Demo from "@/views/Demo.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/demo",
    name: "Demo",
    component: Demo,
  },
];

const router = createRouter({
  history: createWebHistory("/vite/"),
  routes,
});

export default router;
```

**Note:** Base path is `/vite/` to avoid conflicts with Django routes.

## Components

### Single File Component Example

```vue
<!-- components/ServicesList.vue -->
<template>
  <div class="services-list">
    <h2>{{ $t('services.title') }}</h2>
    
    <div v-if="loading" class="loading">
      Loading services...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <ul v-else>
      <li v-for="service in services" :key="service.id">
        <router-link :to="`/services/${service.id}`">
          {{ service.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive state
const services = ref([]);
const loading = ref(true);
const error = ref(null);

// Lifecycle hook
onMounted(async () => {
  try {
    const response = await axios.get('/api/v2/services/');
    services.value = response.data.results;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.services-list {
  padding: 20px;
}

.loading, .error {
  color: #666;
  font-style: italic;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
```

### Using PrimeVue Components

```vue
<template>
  <div>
    <DataTable :value="services" :paginator="true" :rows="10">
      <Column field="name" header="Service Name"></Column>
      <Column field="description" header="Description"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button 
            label="View" 
            @click="viewService(slotProps.data)" 
            severity="info"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const services = ref([]);

function viewService(service) {
  // Handle view action
}
</script>
```

## State Management

### Pinia Store Example

```javascript
// stores/services.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [],
    currentService: null,
    loading: false,
    error: null,
  }),
  
  getters: {
    serviceById: (state) => (id) => {
      return state.services.find(s => s.id === id);
    },
    
    serviceCount: (state) => state.services.length,
  },
  
  actions: {
    async fetchServices() {
      this.loading = true;
      try {
        const response = await axios.get('/api/v2/services/');
        this.services = response.data.results;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchService(id) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/v2/services/${id}/`);
        this.currentService = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async createService(data) {
      try {
        const response = await axios.post('/api/v2/services/', data);
        this.services.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
```

### Using Store in Component

```vue
<script setup>
import { onMounted } from 'vue';
import { useServicesStore } from '@/stores/services';

const servicesStore = useServicesStore();

onMounted(() => {
  servicesStore.fetchServices();
});
</script>

<template>
  <div>
    <h2>Services ({{ servicesStore.serviceCount }})</h2>
    
    <div v-if="servicesStore.loading">Loading...</div>
    <div v-else-if="servicesStore.error">{{ servicesStore.error }}</div>
    
    <ul v-else>
      <li v-for="service in servicesStore.services" :key="service.id">
        {{ service.name }}
      </li>
    </ul>
  </div>
</template>
```

## Internationalization

### Translation Files

**locales/en.json:**
```json
{
  "services": {
    "title": "Services",
    "create": "Create Service",
    "edit": "Edit Service",
    "delete": "Delete Service"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  }
}
```

**locales/ja.json:**
```json
{
  "services": {
    "title": "サービス",
    "create": "サービスを作成",
    "edit": "サービスを編集",
    "delete": "サービスを削除"
  },
  "common": {
    "save": "保存",
    "cancel": "キャンセル",
    "loading": "読み込み中..."
  }
}
```

### Using Translations

```vue
<template>
  <div>
    <h1>{{ $t('services.title') }}</h1>
    <button>{{ $t('services.create') }}</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Change language
function changeLanguage(lang) {
  locale.value = lang;
}
</script>
```

## API Integration

### Axios Configuration

```javascript
// utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for CSRF token
instance.interceptors.request.use(
  (config) => {
    const csrfToken = document.querySelector('[name=csrf_token]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login/';
    }
    return Promise.reject(error);
  }
);

export default instance;
```

### Using in Components

```vue
<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios';

const data = ref(null);

async function fetchData() {
  try {
    const response = await axios.get('/services/');
    data.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>
```

## Development Workflow

### Starting Dev Server

```bash
npm run dev
```

This starts Vite dev server with:
- Hot Module Replacement (HMR)
- Instant updates on file changes
- Source maps for debugging
- Fast refresh for Vue components

**Default URL:** `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This:
- Bundles all assets
- Minifies JavaScript and CSS
- Generates source maps
- Creates manifest.json
- Optimizes assets for production

### Linting and Formatting

```bash
# Lint
npm run lint

# Format
npm run format
```

## Django Integration

### Template Setup

```django
<!-- In base template or specific page -->
{% load static %}

<div id="vue-app"></div>

{% if debug %}
<!-- Development: Load from Vite dev server -->
<script type="module" src="http://localhost:5173/@vite/client"></script>
<script type="module" src="http://localhost:5173/app.js"></script>
{% else %}
<!-- Production: Load built assets -->
<script type="module" src="{% static 'vite_assets_dist/assets/app.[hash].js' %}"></script>
<link rel="stylesheet" href="{% static 'vite_assets_dist/assets/app.[hash].css' %}">
{% endif %}
```

### Manifest-based Loading

For production with proper cache-busting:

```python
# utils/vite.py
import json
from django.conf import settings
from django.templatetags.static import static

def vite_asset(name):
    """Get asset path from Vite manifest"""
    manifest_path = settings.BASE_DIR / 'promgen/vite_assets_dist/.vite/manifest.json'
    
    with open(manifest_path) as f:
        manifest = json.load(f)
    
    return static('vite_assets_dist/' + manifest[name]['file'])
```

Template tag:

```python
# templatetags/vite_tags.py
from django import template
from utils.vite import vite_asset

register = template.Library()

@register.simple_tag
def vite_asset_url(name):
    return vite_asset(name)
```

Usage:

```django
{% load vite_tags %}

<script type="module" src="{% vite_asset_url 'app.js' %}"></script>
```

## Migration Strategy

### Current Approach

1. **Parallel Development**
   - Legacy system continues to work
   - New features can be built with Vite/Vue
   - No breaking changes to existing code

2. **Incremental Adoption**
   - Start with new pages/features
   - Gradually migrate existing pages
   - Maintain backward compatibility

3. **URL Namespacing**
   - Legacy routes: `/services/`, `/projects/`
   - New routes: `/vite/services/`, `/vite/projects/`
   - Eventually replace legacy routes

### Migration Checklist

For migrating a page:

- [ ] Create Vue component
- [ ] Set up routing
- [ ] Create Pinia store if needed
- [ ] Implement API calls
- [ ] Add translations
- [ ] Test functionality
- [ ] Update navigation
- [ ] Remove legacy code (optional)

## Best Practices

### Component Design

1. **Single Responsibility** - One component, one purpose
2. **Composition over Inheritance** - Use composables
3. **Props Down, Events Up** - Unidirectional data flow
4. **Scoped Styles** - Keep styles component-specific
5. **Use TypeScript** (Future) - For type safety

### State Management

1. **Use Pinia** for global state
2. **Local state** for component-specific data
3. **Computed properties** for derived state
4. **Actions** for async operations
5. **Getters** for complex queries

### Performance

1. **Lazy load routes** - Use dynamic imports
2. **Code splitting** - Separate vendor bundles
3. **Tree shaking** - Remove unused code
4. **Asset optimization** - Compress images, fonts
5. **Cache busting** - Use hashed filenames

### Code Quality

1. **ESLint** - Enforce code standards
2. **Prettier** - Consistent formatting
3. **Vue DevTools** - Debug in browser
4. **Unit tests** (Future) - Test components
5. **E2E tests** (Future) - Test user flows

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall deps
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Build Fails

Check:
- Node version (should be 18+)
- Vite version compatibility
- Plugin versions
- Build errors in console

### HMR Not Working

- Check WebSocket connection
- Verify dev server is running
- Clear browser cache
- Restart dev server

### Assets Not Loading

- Check manifest.json exists
- Verify paths in Django settings
- Check static files configuration
- Run `collectstatic` if needed

## Future Enhancements

- [ ] TypeScript support
- [ ] Component library (PrimeVue fully integrated)
- [ ] Unit testing (Vitest)
- [ ] E2E testing (Playwright/Cypress)
- [ ] Storybook for component documentation
- [ ] PWA capabilities
- [ ] Server-side rendering (SSR)
- [ ] Better Django-Vue bridge

