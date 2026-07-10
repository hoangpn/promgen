# Frontend Architecture

## Overview

Promgen uses a **hybrid frontend architecture** that combines traditional server-side rendering with modern client-side interactivity. This approach provides a balance between simplicity, progressive enhancement, and dynamic user experiences.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
├─────────────────────────────────────────────────────────────┤
│  Vue.js 3 App                                               │
│  ├── Global Store (reactive state)                          │
│  ├── Components (alerts, silences, exporters)               │
│  └── Event Handlers                                          │
├─────────────────────────────────────────────────────────────┤
│  jQuery & Utilities                                          │
│  ├── Bootstrap JavaScript (modals, tabs, tooltips)          │
│  ├── Select2 (enhanced dropdowns)                           │
│  ├── Luxon (date/time)                                       │
│  └── Custom JavaScript (promgen.js)                          │
├─────────────────────────────────────────────────────────────┤
│  CSS Framework                                               │
│  ├── Bootstrap 3                                             │
│  ├── Bootstrap Switch                                        │
│  └── Custom Styles (promgen.css)                            │
├─────────────────────────────────────────────────────────────┤
│  Django Templates (Server-Rendered HTML)                     │
│  ├── Base Template (base.html)                              │
│  ├── Page Templates (service_detail.html, etc.)             │
│  ├── Partial Templates (includes)                           │
│  └── Vue Component Templates (vue/*.html)                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Django Backend (Server)                     │
├─────────────────────────────────────────────────────────────┤
│  Views (promgen/views.py)                                    │
│  ├── Class-based views (ListView, DetailView, etc.)         │
│  ├── Form handling                                           │
│  └── Context data preparation                                │
├─────────────────────────────────────────────────────────────┤
│  Forms (promgen/forms.py)                                    │
│  ├── ModelForms                                              │
│  ├── Validation logic                                        │
│  └── Custom widgets                                          │
├─────────────────────────────────────────────────────────────┤
│  Template Tags (promgen/templatetags/promgen.py)            │
│  ├── Breadcrumb generation                                   │
│  ├── Permission helpers                                      │
│  └── Data formatting                                         │
├─────────────────────────────────────────────────────────────┤
│  Context Processors (promgen/context_processors.py)         │
│  ├── Global settings                                         │
│  └── Version information                                     │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Server-Side Rendering (Primary)

**Technology:** Django Templates + Bootstrap 3

**Purpose:** 
- Render initial page content
- Provide SEO-friendly HTML
- Ensure functionality without JavaScript
- Generate forms with CSRF protection

**Used For:**
- All page layouts
- Navigation bars
- Lists and tables
- Forms
- Static content

**Example Flow:**
```
User Request → Django View → Template Rendering → HTML Response → Browser Display
```

### 2. Client-Side Interactivity (Vue.js)

**Technology:** Vue.js 3 (Global CDN)

**Purpose:**
- Add dynamic features without page reloads
- Manage reactive state (alerts, silences)
- Handle real-time updates
- Provide rich interactions

**Key Features:**
- Global reactive store (`dataStore`, `silenceStore`)
- Component-based architecture
- Template syntax mixed with Django templates
- Event-driven communication

**Example Flow:**
```
Page Load → Vue App Mounts → Fetch API Data → Update Reactive State → Re-render Components
```

### 3. Modern Development (Vite + Vue 3)

**Technology:** Vite, Vue 3, PrimeVue

**Purpose:**
- New features development
- SPA-like experiences
- Better developer experience
- Code splitting and optimization

**Status:** In development (parallel to legacy system)

**Location:** `promgen/vite_assets/`

## Data Flow Patterns

### Pattern 1: Server-Rendered Pages

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  Django  │───▶│ Template │───▶│ Browser  │
│ Request  │    │   View   │    │  Render  │    │  Display │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Example:** Service list page
1. User navigates to `/services/`
2. `ServiceList` view fetches services from database
3. Django renders `service_list.html` with context
4. Browser displays HTML with CSS/Bootstrap styling

### Pattern 2: AJAX Updates

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   User   │───▶│  jQuery  │───▶│  Django  │───▶│ Database │
│  Action  │    │   AJAX   │    │   API    │    │  Update  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
      ▲                                                │
      │                                                ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Browser  │◀───│   JSON   │◀───│ Response │◀───│ Success  │
│  Update  │    │ Response │    │ Handling │    │ Message  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Example:** Toggle rule enabled/disabled
1. User clicks toggle switch
2. jQuery/Bootstrap Switch fires event
3. JavaScript posts to `/rule/{id}/toggle/`
4. Django updates database
5. Returns JSON with redirect URL
6. Browser redirects to show updated state

### Pattern 3: Vue Reactive Updates

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Page     │───▶│   Vue    │───▶│  Fetch   │───▶│ Promgen  │
│  Load    │    │  Mount   │    │   API    │    │ Proxy API│
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                                                       ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Component │◀───│ Reactive │◀───│  Store   │◀───│ Alertmgr │
│Re-render │    │  State   │    │  Update  │    │   Data   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**Example:** Global alerts display
1. Page loads, Vue app mounts
2. Vue calls `fetchAlerts()` in mounted hook
3. Fetch from `/proxy/v1/alerts` (Alertmanager proxy)
4. Update `globalAlerts` in store
5. Components automatically re-render
6. Alerts displayed in navbar and detail pages

## State Management

### Global State (Vue Reactive)

Located in `promgen/static/js/promgen.vue.js`:

```javascript
const dataStore = Vue.reactive({
    global: globalStore.state,
    components: {},
    selectedHosts: [],
    globalSilences: [],    // All silences from Alertmanager
    globalAlerts: []       // All alerts from Alertmanager
});

const silenceStore = Vue.reactive({
    state: {
        show: false,       // Modal visibility
        labels: {},        // Silence labels/matchers
        silence: null,     // Current silence being edited
    },
    // Methods for managing silences
});
```

**Access Pattern:**
- Vue components access via `this.$root.globalAlerts`
- Computed properties filter/group data
- Methods update state reactively

### Session State (Browser)

- **LocalStorage:** Not currently used
- **SessionStorage:** Not currently used
- **Cookies:** Django session + CSRF token
- **URL Parameters:** Filtering, pagination, tab selection

## Routing

### Server-Side Routes

Defined in `promgen/urls.py`:

```python
urlpatterns = [
    path('', HomeList.as_view(), name='home'),
    path('services/', ServiceList.as_view(), name='service-list'),
    path('service/<int:pk>', ServiceDetail.as_view(), name='service-detail'),
    # ... many more
]
```

**Characteristics:**
- Full page loads
- Traditional HTTP navigation
- Django handles routing
- SEO-friendly URLs

### Client-Side Navigation

**Hash-based Tabs:**
```
/service/123#rules      → Shows rules tab
/project/456#exporters  → Shows exporters tab
```

Handled by JavaScript:
```javascript
// Activate tab based on URL hash
function activateTabFromHash() {
    const hash = window.location.hash;
    if (hash && $(hash).length) {
        $('.nav-tabs a[href="' + hash + '"]').tab('show');
    }
}
```

**Future (Vite App):**
- Vue Router for SPA navigation
- Defined in `promgen/vite_assets/router/`

## Build Process

### Legacy Assets

**No build step required:**
- Static files served directly from `promgen/static/`
- Django's `collectstatic` for deployment
- Files loaded via `{% static %}` template tag

### Modern Assets (Vite)

**Development:**
```bash
npm run dev
# Starts Vite dev server on port 5173
# Hot module replacement
# Instant updates
```

**Production:**
```bash
npm run build
# Builds to promgen/vite_assets_dist/
# Generates manifest.json
# Optimizes and minifies
```

**Configuration:** `vite.config.js`

## Performance Considerations

### Optimization Strategies

1. **Server-Side Rendering First**
   - Fast initial page load
   - No JavaScript required for basic functionality
   - Search engine friendly

2. **Progressive Enhancement**
   - Vue.js adds interactivity on top
   - Core features work without JavaScript
   - Graceful degradation

3. **Prefetching**
   - Database queries optimized with `prefetch_related()`
   - Reduces N+1 queries
   - Example from views.py:
   ```python
   queryset = models.Service.objects.prefetch_related(
       "rule_set",
       "notifiers",
       "project_set__shard",
   )
   ```

4. **Pagination**
   - Large lists paginated (20-50 items per page)
   - Reduces payload size
   - Implemented in views with `paginate_by`

5. **Caching**
   - Not extensively used currently
   - Opportunity for improvement
   - Could cache Prometheus/Alertmanager API calls

## Security Considerations

### CSRF Protection

All forms include CSRF token:
```html
<form method="post">
    {% csrf_token %}
    <!-- form fields -->
</form>
```

JavaScript posts also include CSRF:
```javascript
const headers = {
    'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value,
};
```

### XSS Prevention

- Django auto-escapes template variables
- Use `|safe` filter only when necessary
- Vue's `v-text` and `v-html` directives used appropriately
- `v-pre` directive prevents Vue processing of user content

### Authentication

- Django's built-in authentication
- `@login_required` decorator on views
- Template conditionals: `{% if user.is_authenticated %}`
- AJAX requests respect session authentication

## Browser Compatibility

**Target Browsers:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

**Polyfills:**
- Not currently used
- Vue 3 requires modern browsers
- ES6+ features assumed

## Development vs Production

### Development Mode

```python
# settings.py
DEBUG = True
```

- Uses unminified Vue.js
- Template changes reload automatically
- Detailed error pages
- Django debug toolbar available

### Production Mode

```python
# settings.py
DEBUG = False
```

- Uses minified/production Vue.js
- Static files collected and served efficiently
- Error pages user-friendly
- Logging to files/services

## Migration Strategy

The project is gradually migrating to modern tooling:

### Current (Stable)
- Django templates + Bootstrap 3
- Vue.js 3 via CDN
- jQuery for utilities
- Static files

### Future (In Progress)
- Vite build system
- Vue 3 SFC (Single File Components)
- PrimeVue components
- Modern ES modules

### Approach
- **Parallel Development:** New features can use Vite/modern stack
- **Gradual Migration:** Legacy code remains functional
- **No Breaking Changes:** Both systems coexist
- **Long-term Goal:** Full migration to modern stack

