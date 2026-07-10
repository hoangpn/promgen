# Modern Frontend Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install Dependencies

```bash
cd /path/to/promgen
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The Vite dev server will start at `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to the Django application (e.g., `http://localhost:8000`), then navigate to the modern frontend route (typically `/vite/` or whatever route is configured in Django).

## Project Overview

### What's Built

- ✅ **Complete API Client** - All REST API v2 endpoints integrated
- ✅ **4 Pinia Stores** - Auth, Services, Projects, Rules
- ✅ **20+ Routes** - Full application routing
- ✅ **Layout Components** - Navbar, Sidebar, Main layout
- ✅ **Page Components** - Dashboard, Services, Projects, Rules
- ✅ **Responsive UI** - Mobile-friendly with PrimeVue

### Technology Stack

- Vue 3.5.22
- Vite 7.3.6
- PrimeVue 4.4.1
- Pinia 3.0.3
- Vue Router 4.6.3
- Axios 1.18.1

## Directory Structure

```
promgen/vite_assets/
├── api/              # API client and endpoints
├── components/       # Reusable components
├── stores/          # Pinia state management
├── router/          # Vue Router configuration
├── views/           # Page components
├── locales/         # i18n translations
├── App.vue          # Root component
└── app.js          # Entry point
```

## Common Tasks

### View a Page

Navigate to any route in the browser:
- `/` - Dashboard
- `/services` - Services list
- `/services/1` - Service detail
- `/projects` - Projects list
- `/rules` - Rules list

### Make an API Call

```javascript
import { servicesAPI } from '@/api';

// List services
const services = await servicesAPI.list();

// Get service by ID
const service = await servicesAPI.get(123);

// Create service
const newService = await servicesAPI.create({
  name: 'My Service',
  description: 'Description',
});
```

### Use a Store

```javascript
import { useServicesStore } from '@/stores';

const servicesStore = useServicesStore();

// Fetch data
await servicesStore.fetchServices();

// Access state
console.log(servicesStore.services);
console.log(servicesStore.loading);
console.log(servicesStore.error);
```

### Add a New Route

1. Create component in `views/`:
```vue
<!-- views/MyPage.vue -->
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

3. Add navigation link in `AppSidebar.vue`:
```javascript
{
  label: 'My Page',
  icon: 'pi-home',
  route: '/my-page',
}
```

## Development Workflow

### 1. Start Dev Server
```bash
npm run dev
```
- Hot Module Replacement enabled
- Changes reflect instantly
- Source maps for debugging

### 2. Make Changes
- Edit files in `promgen/vite_assets/`
- Browser updates automatically on save
- Check console for errors

### 3. Test
- Manual testing in browser
- Check all routes work
- Verify API calls
- Test responsive layout

### 4. Lint & Format
```bash
npm run lint
npm run format
```

### 5. Build for Production
```bash
npm run build
```
Output: `promgen/vite_assets_dist/`

## Key Features

### API Integration

All endpoints from `Promgen API.yaml` are integrated:

```javascript
import { promgenAPI } from '@/api';

// Services
await promgenAPI.services.list();
await promgenAPI.services.get(id);
await promgenAPI.services.create(data);
await promgenAPI.services.update(id, data);
await promgenAPI.services.delete(id);

// Projects
await promgenAPI.projects.list();
await promgenAPI.projects.get(id);
// ... etc

// Rules, Exporters, Farms, Groups, etc.
```

### State Management

```javascript
import { useAuthStore, useServicesStore } from '@/stores';

// Auth
const authStore = useAuthStore();
await authStore.fetchCurrentUser();
console.log(authStore.user);
console.log(authStore.isAuthenticated);

// Services
const servicesStore = useServicesStore();
await servicesStore.fetchServices();
console.log(servicesStore.services);
```

### Routing

```javascript
import { useRouter } from 'vue-router';

const router = useRouter();

// Navigate programmatically
router.push('/services');
router.push({ name: 'service-detail', params: { id: 123 } });
router.back();
```

## Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### API Calls Failing

- Check Django backend is running
- Verify API endpoint URLs
- Check CSRF token in browser DevTools
- Check user is authenticated

### Components Not Rendering

- Check browser console for errors
- Verify import paths
- Check component is properly registered
- Ensure PrimeVue components are imported

### Styles Not Working

- Verify PrimeVue theme is applied
- Check Bootstrap CSS is loaded (via Django)
- Clear browser cache

## Next Steps

### For Frontend Developers

1. **Learn the API** - Review `api/index.js`
2. **Understand Stores** - Check `stores/` folder
3. **Review Components** - Look at `views/` and `components/`
4. **Add Features** - Create new pages, forms, or components

### For Backend Developers

1. **API Endpoints** - The frontend uses `/rest/v2/*`
2. **Authentication** - Session-based auth with CSRF
3. **Permissions** - Not yet enforced in frontend
4. **Data Format** - Expecting JSON responses

### Recommended Development Order

1. ✅ **Complete** - API client, stores, routing, layout
2. **Next** - Forms for creating/editing entities
3. **Then** - Complete detail pages with all tabs
4. **After** - Permission checks and role-based UI
5. **Finally** - Advanced features, testing, optimization

## Resources

- **Full Documentation**: `promgen/vite_assets/README.md`
- **API Spec**: `Promgen API.yaml`
- **Frontend Docs**: `docs/frontend/`
- **Vue 3 Docs**: https://vuejs.org/
- **PrimeVue Docs**: https://primevue.org/

## Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
npm run format       # Format code

# Package Management
npm install          # Install dependencies
npm update           # Update dependencies
npm outdated         # Check for updates
```

## Summary

You now have a **fully functional modern frontend** for Promgen that:

✅ Communicates with all Promgen APIs
✅ Has state management with Pinia
✅ Has routing with Vue Router
✅ Has a responsive UI with PrimeVue
✅ Is ready for further development

**Happy coding! 🚀**

