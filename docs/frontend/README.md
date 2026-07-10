# Promgen Frontend Documentation

This directory contains comprehensive documentation for the frontend architecture of Promgen, a Django-based Prometheus configuration and alert rule management system.

## Overview

Promgen uses a hybrid frontend architecture that combines:
- **Django Templates** - Server-side rendering with Bootstrap 3
- **Vue.js 3** - Client-side interactivity (legacy inline approach)
- **Vite + Vue 3** - Modern SPA for new features (in development)

## Documentation Structure

1. [**Architecture Overview**](./01-architecture.md) - High-level frontend architecture
2. [**Django Templates**](./02-templates.md) - Template structure and patterns
3. [**Vue.js Components**](./03-vue-components.md) - Legacy Vue.js implementation
4. [**Modern Vue/Vite Setup**](./04-vite-setup.md) - New Vite-based development
5. [**Static Assets**](./05-static-assets.md) - CSS, JavaScript libraries, and images
6. [**Forms & User Input**](./06-forms.md) - Form handling and validation
7. [**UI/UX Patterns**](./07-ui-patterns.md) - Common UI patterns and components
8. [**Development Guide**](./08-development.md) - How to develop frontend features

## Quick Start

### For Template Development
```bash
# Templates are in promgen/templates/
# Edit .html files directly
# Changes are visible on page reload (in DEBUG mode)
```

### For Vue.js Development (Legacy)
```javascript
// Edit promgen/static/js/promgen.vue.js
// Components use inline templates from promgen/templates/promgen/vue/
// Refresh browser to see changes
```

### For Modern Vite Development
```bash
# Start Vite dev server
npm run dev

# Build for production
npm run build
```

## Key Technologies

- **Bootstrap 3** - CSS framework for layout and components
- **jQuery** - DOM manipulation and AJAX
- **Vue.js 3** - Reactive components
- **Select2** - Enhanced select dropdowns
- **Luxon** - Date/time formatting
- **Linkify.js** - Automatic link detection
- **Vite** - Modern build tool
- **PrimeVue** - Vue 3 UI component library (new)

## Common Tasks

### Adding a New Page
1. Create view in `promgen/views.py`
2. Create template in `promgen/templates/promgen/`
3. Add URL route in `promgen/urls.py`
4. Update navigation in `navbar.html` if needed

### Adding a Vue Component
1. Add component definition in `promgen/static/js/promgen.vue.js`
2. Create template in `promgen/templates/promgen/vue/`
3. Include template in `base.html`
4. Use component in Django templates with Vue syntax

### Styling Updates
- CSS is in `promgen/static/css/`
- Bootstrap variables can be customized
- Custom styles in `promgen.css`

## Browser Support

Promgen targets modern browsers:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

## Related Documentation

- [Main Promgen Documentation](../index.rst)
- [API Documentation](../modules/)
- [Plugin Development](../plugin/)

