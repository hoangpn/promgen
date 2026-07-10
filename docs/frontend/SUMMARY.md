# Frontend Documentation Summary

Thank you for reading the Promgen frontend documentation! This summary provides a quick reference to the key concepts and files.

## Documentation Files

1. **[README.md](./README.md)** - Entry point and overview
2. **[Architecture](./01-architecture.md)** - System architecture and data flow
3. **[Templates](./02-templates.md)** - Django template system
4. **[Vue Components](./03-vue-components.md)** - Legacy Vue.js implementation
5. **[Vite Setup](./04-vite-setup.md)** - Modern build system

## Key Takeaways

### Technology Stack

**Current (Stable):**
- Django Templates
- Bootstrap 3
- jQuery
- Vue.js 3 (CDN)
- Static files

**Future (In Development):**
- Vite
- Vue 3 SFCs
- Vue Router
- Pinia
- PrimeVue

### Architecture Patterns

1. **Server-Side Rendering** - Django renders initial HTML
2. **Progressive Enhancement** - JavaScript adds interactivity
3. **Component-Based** - Vue components for reusable UI
4. **Reactive State** - Vue stores manage global state
5. **API-Driven** - Fetch data from Django REST API

### Important Files

#### Backend
- `promgen/views.py` - View logic
- `promgen/forms.py` - Form definitions
- `promgen/urls.py` - URL routing
- `promgen/templatetags/promgen.py` - Custom template tags
- `promgen/context_processors.py` - Global template context

#### Frontend Templates
- `promgen/templates/base.html` - Base template
- `promgen/templates/promgen/navbar.html` - Navigation
- `promgen/templates/promgen/service_*.html` - Service pages
- `promgen/templates/promgen/project_*.html` - Project pages
- `promgen/templates/promgen/vue/*.html` - Vue component templates

#### JavaScript (Legacy)
- `promgen/static/js/promgen.js` - Utility functions, jQuery code
- `promgen/static/js/promgen.vue.js` - Vue app and components
- `promgen/static/js/mixins.vue.js` - Vue mixins

#### JavaScript (Modern)
- `promgen/vite_assets/app.js` - Vite entry point
- `promgen/vite_assets/App.vue` - Root component
- `promgen/vite_assets/router/` - Vue Router
- `promgen/vite_assets/components/` - Vue components
- `promgen/vite_assets/stores/` - Pinia stores

#### CSS
- `promgen/static/css/bootstrap.min.css` - Bootstrap framework
- `promgen/static/css/promgen.css` - Custom styles

#### Configuration
- `vite.config.js` - Vite build configuration
- `package.json` - NPM dependencies
- `eslint.config.js` - ESLint rules

### Common Tasks Quick Reference

#### Add a New Page

1. Create view in `promgen/views.py`:
```python
class MyNewView(LoginRequiredMixin, ListView):
    template_name = "promgen/my_page.html"
    model = models.MyModel
```

2. Create template in `promgen/templates/promgen/my_page.html`:
```django
{% extends "base.html" %}
{% block content %}
  <h1>My New Page</h1>
{% endblock %}
```

3. Add URL in `promgen/urls.py`:
```python
path('my-page/', MyNewView.as_view(), name='my-page'),
```

#### Add Vue Component (Legacy)

1. Define component in `promgen/static/js/promgen.vue.js`:
```javascript
app.component('my-component', {
    template: '#my-component-template',
    props: ['data'],
    // ...
});
```

2. Create template in `promgen/templates/promgen/vue/my_component.html`

3. Include in `base.html`:
```django
<script type="text/x-template" id="my-component-template">
  {% include 'promgen/vue/my_component.html' %}
</script>
```

4. Use in Django templates:
```django
<my-component :data="someData"></my-component>
```

#### Add Modern Vue Component

1. Create SFC in `promgen/vite_assets/components/MyComponent.vue`:
```vue
<template>
  <div>Component content</div>
</template>

<script setup>
// Component logic
</script>

<style scoped>
/* Component styles */
</style>
```

2. Import and use:
```javascript
import MyComponent from '@/components/MyComponent.vue';
```

#### Add Custom Template Tag

1. Add to `promgen/templatetags/promgen.py`:
```python
@register.simple_tag
def my_tag(arg):
    return f"Processed: {arg}"
```

2. Use in template:
```django
{% load promgen %}
{% my_tag "value" %}
```

#### Add CSS Styles

Add to `promgen/static/css/promgen.css`:
```css
.my-custom-class {
    /* styles */
}
```

### Data Flow Examples

#### Page Load
```
User → Django View → Database Query → Template Render → HTML → Browser
```

#### AJAX Action
```
User Click → JavaScript → POST to Django → Database Update → JSON Response → Update UI
```

#### Vue Reactive Update
```
Page Load → Vue Mount → Fetch API → Update Store → Components Re-render
```

### Debugging Tips

#### Django Template Issues
- Check `DEBUG = True` in settings
- Look at template error page
- Verify context data in view
- Use `{% debug %}` tag

#### JavaScript Issues
- Open browser console (F12)
- Check Network tab for failed requests
- Use Vue DevTools browser extension
- Add `console.log()` statements
- Check for CSRF token issues

#### Vue Component Issues
- Install Vue DevTools
- Check component hierarchy
- Verify props/emits
- Check reactive state
- Look for delimiter conflicts (`[[` vs `{{`)

#### CSS Issues
- Use browser inspector
- Check specificity conflicts
- Verify Bootstrap classes
- Look for z-index issues
- Check responsive breakpoints

### Performance Checklist

- [ ] Use `prefetch_related()` in views
- [ ] Paginate large lists
- [ ] Minimize database queries
- [ ] Load JavaScript at page bottom
- [ ] Use CDN for libraries
- [ ] Compress images
- [ ] Enable gzip compression
- [ ] Use browser caching
- [ ] Minimize DOM manipulation
- [ ] Use Vue computed properties

### Security Checklist

- [ ] Include CSRF token in forms
- [ ] Use `LoginRequiredMixin` on views
- [ ] Escape user input in templates
- [ ] Use `v-pre` for user content in Vue
- [ ] Validate forms on backend
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Sanitize API responses
- [ ] Use Content Security Policy

### Accessibility Checklist

- [ ] Use semantic HTML
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Provide text alternatives for images
- [ ] Use sufficient color contrast
- [ ] Label form inputs
- [ ] Provide focus indicators
- [ ] Test with screen reader
- [ ] Support browser zoom
- [ ] Avoid flashing content

## Quick Command Reference

### Development

```bash
# Start Django development server
python manage.py runserver

# Start Vite dev server
npm run dev

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic
```

### Build & Deploy

```bash
# Build Vite assets
npm run build

# Lint JavaScript
npm run lint

# Format code
npm run format

# Run tests
python manage.py test
```

### Database

```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create migration for specific app
python manage.py makemigrations promgen

# Show migrations
python manage.py showmigrations
```

## Getting Help

### Resources

- **Django Docs:** https://docs.djangoproject.com/
- **Vue.js Docs:** https://vuejs.org/guide/
- **Bootstrap 3 Docs:** https://getbootstrap.com/docs/3.3/
- **PrimeVue Docs:** https://primevue.org/
- **Vite Docs:** https://vitejs.dev/

### Project-Specific

- Main documentation: `docs/index.rst`
- API docs: `docs/modules/`
- Plugin development: `docs/plugin/`
- Contributing guide: `CONTRIBUTING.md`

### Community

- GitHub Issues: Report bugs and feature requests
- Pull Requests: Contribute code improvements
- Discussions: Ask questions and share ideas

## Next Steps

### For New Developers

1. Read [Architecture Overview](./01-architecture.md)
2. Set up development environment
3. Explore existing templates
4. Try making a small change
5. Read the Django views to understand data flow

### For Frontend Developers

1. Understand the [Vue Components](./03-vue-components.md)
2. Learn the [Vite Setup](./04-vite-setup.md) for modern development
3. Review component patterns
4. Start with small enhancements
5. Consider modernization opportunities

### For Backend Developers

1. Review [Template System](./02-templates.md)
2. Understand view-template relationship
3. Learn custom template tags
4. See how forms render
5. Understand API endpoints

## Contributing

When contributing frontend changes:

1. **Follow existing patterns** - Keep consistency
2. **Test in multiple browsers** - Chrome, Firefox, Safari
3. **Check mobile responsiveness** - Use Bootstrap grid
4. **Validate HTML** - Use W3C validator
5. **Lint JavaScript** - Run `npm run lint`
6. **Format code** - Run `npm run format`
7. **Update documentation** - Keep docs current
8. **Add comments** - Explain complex logic
9. **Write tests** - For critical functionality
10. **Get code review** - Before merging

## Conclusion

Promgen's frontend is a hybrid system that balances:
- **Simplicity** - Easy to understand and maintain
- **Power** - Rich interactivity with Vue.js
- **Future-ready** - Migrating to modern tooling
- **Practical** - Focused on user needs

The documentation you've read covers:
- ✅ Architecture and design patterns
- ✅ Django template system
- ✅ Vue.js components (legacy)
- ✅ Modern Vite/Vue setup
- ✅ Common tasks and workflows

Thank you for taking the time to learn about Promgen's frontend. We hope this documentation helps you contribute effectively to the project!

---

**Last Updated:** 2026-07-09  
**Documentation Version:** 1.0  
**Promgen Version:** See `promgen/__init__.py`

