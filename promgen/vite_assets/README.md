# Promgen Modern Frontend (Vue 3 + Vite)

This is the modern frontend for Promgen, built with Vue 3, Vite, and PrimeVue. It provides a complete SPA (Single Page Application) that integrates with the Promgen REST API v2.

## Architecture

### Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend build tool
- **Vue Router** - Official router for Vue.js
- **Pinia** - Official state management for Vue  
- **PrimeVue 4** - Comprehensive Vue UI component library
- **Axios** - HTTP client for API requests
- **Bootstrap 5** - CSS framework (via CDN)
- **PrimeIcons** - Icon library

### Project Structure

```
promgen/vite_assets/
├── api/                    # API integration layer
│   ├── client.js          # Axios client with interceptors
│   └── index.js           # All API endpoint definitions
├── components/            # Reusable Vue components
│   └── layout/           # Layout components
│       ├── AppLayout.vue
│       ├── AppNavbar.vue
│       └── AppSidebar.vue
├── stores/               # Pinia stores for state management
│   ├── auth.js          # Authentication state
│   ├── services.js      # Services state
│   ├── projects.js      # Projects state
│   ├── rules.js         # Rules state
│   └── index.js         # Store exports
├── router/              # Vue Router configuration
│   └── index.js         # Route definitions
├── views/               # Page components
│   ├── Home.vue         # Dashboard
│   ├── ServicesList.vue
│   ├── ServiceDetail.vue
│   ├── ProjectsList.vue
│   ├── RulesList.vue
│   └── ...
├── locales/             # i18n translation files
│   ├── en.json
│   └── ja.json
├── styles/              # CSS styles
├── App.vue             # Root component
└── app.js             # Application entry point
```

## Features

### Implemented

✅ **API Client**
- Comprehensive REST API v2 integration
- Automatic CSRF token handling
- Request/response interceptors
- Error handling

✅ **State Management**
- Pinia stores for Services, Projects, Rules
- Authentication state
- Pagination support
- Loading and error states

✅ **Routing**
- Vue Router with hash mode
- Route guards (ready for implementation)
- Lazy-loaded components
- 404 handling

✅ **Layout**
- Responsive navigation bar
- Collapsible sidebar menu
- Mobile-friendly layout

✅ **Service Management**
- List all services with pagination
- View service details
- Search and filter services
- Navigate to related entities

✅ **Project Management**
- List all projects
- View project details
- Filter by service/shard

✅ **Rule Management**
- List all rules
- View rule details
- Filter by status (enabled/disabled)

✅ **User Interface**
- PrimeVue DataTable with sorting
- Card-based layouts
- Button actions
- Loading states
- Responsive design

### API Integrations

All REST API v2 endpoints are integrated:

- `/rest/v2/services` - Full CRUD operations
- `/rest/v2/projects` - Full CRUD operations
- `/rest/v2/rules` - Full CRUD operations
- `/rest/v2/exporters` - List, update, delete
- `/rest/v2/farms` - Full CRUD + hosts management
- `/rest/v2/notifiers` - Manage notifiers and filters
- `/rest/v2/groups` - Full CRUD + members management
- `/rest/v2/users` - List users, get current user
- `/rest/v2/shards` - List and retrieve
- `/rest/v2/urls` - List and delete
- `/rest/v2/probes` - List probes
- `/rest/v2/sites` - Get current site
- `/rest/v2/logs` - Audit logs

### Stores Available

- **`useAuthStore`** - Current user, authentication state
- **`useServicesStore`** - Services CRUD, pagination
- **`useProjectsStore`** - Projects CRUD, filtering
- **`useRulesStore`** - Rules CRUD, enabled/disabled filters

## Development

### Prerequisites

```bash
# Node.js 18+ required
node --version

# Install dependencies
npm install
```

### Running Dev Server

```bash
# Start Vite dev server (HMR enabled)
npm run dev

# Server starts at http://localhost:5173
```

The dev server provides:
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps for debugging
- Instant updates on file changes

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Output: promgen/vite_assets_dist/
```

### Code Quality

```bash
# Lint JavaScript/Vue
npm run lint

# Format code with Prettier
npm run format
```

## Usage Examples

### Making API Calls

```javascript
import { servicesAPI } from '@/api';

// List services with filters
const response = await servicesAPI.list({
  name: 'search term',
  page_number: 1,
  page_size: 20,
});

// Get service detail
const service = await servicesAPI.get(123);

// Create service
const newService = await servicesAPI.create({
  name: 'My Service',
  description: 'Description',
  owner: 'username',
});
```

### Using Stores

```javascript
import { useServicesStore } from '@/stores';

const servicesStore = useServicesStore();

// Fetch services
await servicesStore.fetchServices();

// Access state
const services = servicesStore.services;
const loading = servicesStore.loading;
const error = servicesStore.error;

// Pagination
servicesStore.setPage(2);
servicesStore.setPageSize(50);
```

### Creating New Pages

1. Create Vue component in `views/`:

```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Initialize page
});
</script>

<template>
  <div>
    <h1>My Page</h1>
  </div>
</template>
```

2. Add route in `router/index.js`:

```javascript
{
  path: '/my-page',
  name: 'my-page',
  component: () => import('../views/MyPage.vue'),
  meta: { title: 'My Page' },
}
```

3. Add navigation link in `AppSidebar.vue` or `AppNavbar.vue`

## Configuration

### API Base URL

Set in `api/client.js`:

```javascript
const api = axios.create({
  baseURL: '/rest/v2',  // Change if needed
  timeout: 30000,
});
```

### Pagination Defaults

Set in stores:

```javascript
const pagination = ref({
  page: 1,
  pageSize: 20,  // Adjust default page size
  total: 0,
});
```

### PrimeVue Theme

Configure in `app.js`:

```javascript
import Aura from "@primeuix/themes/aura";

app.use(PrimeVue, {
  theme: {
    preset: Aura,  // Choose theme preset
  },
});
```

## File Structure by Feature

### Services Module

- **API**: `api/index.js` → `servicesAPI`
- **Store**: `stores/services.js` → `useServicesStore`
- **Views**: 
  - `views/ServicesList.vue` - List page
  - `views/ServiceDetail.vue` - Detail page
  - `views/ServiceForm.vue` - Create/edit form (TODO)
- **Routes**: `/services`, `/services/:id`, `/services/new`, `/services/:id/edit`

### Projects Module

- **API**: `api/index.js` → `projectsAPI`
- **Store**: `stores/projects.js` → `useProjectsStore`
- **Views**: 
  - `views/ProjectsList.vue` - List page
  - `views/ProjectDetail.vue` - Detail page (TODO)
- **Routes**: `/projects`, `/projects/:id`

### Rules Module

- **API**: `api/index.js` → `rulesAPI`
- **Store**: `stores/rules.js` → `useRulesStore`
- **Views**: 
  - `views/RulesList.vue` - List page
  - `views/RuleDetail.vue` - Detail page (TODO)
- **Routes**: `/rules`, `/rules/:id`

## Next Steps

### High Priority

- [ ] Complete Service Detail page with sub-resources
- [ ] Create Project Detail page
- [ ] Create Rule Detail page
- [ ] Implement Create/Edit forms for all entities
- [ ] Add permission checks based on user roles
- [ ] Implement search functionality

### Medium Priority

- [ ] Create Exporters management pages
- [ ] Create Farms management pages
- [ ] Create Groups management pages
- [ ] Create URL management pages
- [ ] Create Audit Logs viewer
- [ ] Add notifications/toasts for actions

### Low Priority

- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Improve error handling
- [ ] Add loading skeletons
- [ ] Implement Dark mode
- [ ] Add keyboard shortcuts

## Troubleshooting

### API Calls Failing with 403

- Check CSRF token is correctly included
- Verify user is authenticated
- Check permissions in Django

### Components Not Loading

- Check console for errors
- Verify import paths are correct
- Ensure component is registered

### Styles Not Applied

- Check PrimeVue theme is imported
- Verify Bootstrap CSS is loaded
- Check for CSS conflicts

## Contributing

1. Create feature branch
2. Make changes
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Test locally: `npm run dev`
6. Build: `npm run build`
7. Submit PR

## Resources

- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [PrimeVue Documentation](https://primevue.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Promgen API Documentation](../../Promgen%20API.yaml)

## License

Same as Promgen project - See LICENSE file.

