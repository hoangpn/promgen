# Promgen Frontend Documentation Index

## 📚 Complete Documentation Set

This directory contains **comprehensive frontend documentation** for the Promgen project, covering both the legacy and modern frontend architectures.

### 📊 Documentation Stats

- **Total Pages:** 6 documents
- **Total Lines:** 3,314+ lines
- **Total Size:** ~85 KB
- **Coverage:** Architecture, Templates, Vue.js, Vite, Patterns, and Guides

---

## 🗂️ Documentation Structure

### **1. [README.md](./README.md)** (90 lines)
**Start Here!** Overview and navigation guide.

- Quick start instructions
- Technology overview
- Common tasks
- Documentation roadmap

### **2. [01-architecture.md](./01-architecture.md)** (420 lines)
**Deep Dive:** System architecture and design patterns.

- Architecture layers (Django + Vue + Vite)
- Data flow patterns (SSR, AJAX, Reactive)
- State management (Stores and reactive state)
- Routing strategies (Server-side and client-side)
- Build process and optimization
- Performance and security considerations

### **3. [02-templates.md](./02-templates.md)** (683 lines)
**Reference:** Django template system.

- Directory structure
- Base template and blocks
- Common template patterns (List, Detail, Form views)
- Template includes and partials
- Custom template tags and filters
- Vue-Django integration
- Internationalization (i18n)
- Responsive design with Bootstrap
- Best practices and pitfalls

### **4. [03-vue-components.md](./03-vue-components.md)** (925 lines)
**Guide:** Legacy Vue.js implementation.

- Global Vue app structure
- Data stores (Global, Silence, Exporter stores)
- Component definitions (Silence, Alert, Exporter components)
- Utility functions
- Usage patterns in templates
- API integration
- Event handling
- Best practices

### **5. [04-vite-setup.md](./04-vite-setup.md)** (801 lines)
**Modern Stack:** Vite build system and Vue 3 SFCs.

- Technology stack overview
- Configuration (Vite, ESLint, package.json)
- Single File Components (SFCs)
- Vue Router setup
- Pinia state management
- PrimeVue components
- Internationalization with vue-i18n
- API integration with Axios
- Development workflow
- Django integration
- Migration strategy
- Best practices and troubleshooting

### **6. [SUMMARY.md](./SUMMARY.md)** (395 lines)
**Quick Reference:** Key concepts and commands.

- Technology stack summary
- Important files reference
- Common tasks quick guide
- Data flow examples
- Debugging tips
- Performance checklist
- Security checklist
- Accessibility checklist
- Command reference
- Getting help resources

---

## 🎯 Reading Paths

### **For New Developers**
1. Start with [README.md](./README.md)
2. Read [01-architecture.md](./01-architecture.md) for the big picture
3. Explore [02-templates.md](./02-templates.md) to understand templates
4. Check [SUMMARY.md](./SUMMARY.md) for quick reference

### **For Frontend Developers**
1. Review [README.md](./README.md) for context
2. Dive into [03-vue-components.md](./03-vue-components.md) for current implementation
3. Learn [04-vite-setup.md](./04-vite-setup.md) for modern development
4. Use [SUMMARY.md](./SUMMARY.md) as a cheat sheet

### **For Backend Developers**
1. Read [README.md](./README.md) for overview
2. Study [02-templates.md](./02-templates.md) for template-view relationship
3. Skim [01-architecture.md](./01-architecture.md) for data flow
4. Reference [SUMMARY.md](./SUMMARY.md) as needed

### **For Maintainers**
1. Understand [01-architecture.md](./01-architecture.md) completely
2. Master [03-vue-components.md](./03-vue-components.md) and [04-vite-setup.md](./04-vite-setup.md)
3. Know all patterns in [02-templates.md](./02-templates.md)
4. Keep [SUMMARY.md](./SUMMARY.md) handy for quick answers

---

## 🔑 Key Topics Index

### Architecture & Design
- [Hybrid Architecture](./01-architecture.md#overview)
- [Component Layers](./01-architecture.md#architecture-layers)
- [Data Flow Patterns](./01-architecture.md#data-flow-patterns)
- [State Management](./01-architecture.md#state-management)
- [Routing Strategies](./01-architecture.md#routing)

### Django Templates
- [Template Structure](./02-templates.md#directory-structure)
- [Base Template](./02-templates.md#base-template)
- [Template Patterns](./02-templates.md#common-template-patterns)
- [Custom Template Tags](./02-templates.md#template-tags-and-filters)
- [Vue Integration](./02-templates.md#vue-integration-in-templates)

### Vue.js (Legacy)
- [Global App Setup](./03-vue-components.md#global-vue-app)
- [Reactive Stores](./03-vue-components.md#data-stores)
- [Component Library](./03-vue-components.md#components)
- [Silence Management](./03-vue-components.md#silence-createupdate-modal)
- [Alert Display](./03-vue-components.md#global-methods)

### Modern Development
- [Vite Configuration](./04-vite-setup.md#configuration)
- [Vue 3 Components](./04-vite-setup.md#components)
- [Vue Router](./04-vite-setup.md#routing)
- [Pinia Stores](./04-vite-setup.md#state-management)
- [PrimeVue UI](./04-vite-setup.md#using-primevue-components)
- [i18n Setup](./04-vite-setup.md#internationalization)

### Practical Guides
- [Adding Pages](./SUMMARY.md#add-a-new-page)
- [Creating Components](./SUMMARY.md#add-vue-component-legacy)
- [Styling Guide](./SUMMARY.md#add-css-styles)
- [Debugging Tips](./SUMMARY.md#debugging-tips)
- [Performance](./SUMMARY.md#performance-checklist)

---

## 🛠️ Quick Links by Task

### Development Setup
- [Starting Dev Server](./04-vite-setup.md#starting-dev-server)
- [Development Workflow](./04-vite-setup.md#development-workflow)
- [Command Reference](./SUMMARY.md#quick-command-reference)

### Adding Features
- [New Page](./SUMMARY.md#add-a-new-page)
- [Vue Component (Legacy)](./SUMMARY.md#add-vue-component-legacy)
- [Vue Component (Modern)](./SUMMARY.md#add-modern-vue-component)
- [Template Tag](./SUMMARY.md#add-custom-template-tag)

### Troubleshooting
- [Django Template Issues](./SUMMARY.md#django-template-issues)
- [JavaScript Issues](./SUMMARY.md#javascript-issues)
- [Vue Component Issues](./SUMMARY.md#vue-component-issues)
- [Build Problems](./04-vite-setup.md#troubleshooting)

### Best Practices
- [Template Best Practices](./02-templates.md#best-practices)
- [Vue Best Practices](./03-vue-components.md#best-practices)
- [Modern Development](./04-vite-setup.md#best-practices)
- [Security Checklist](./SUMMARY.md#security-checklist)

---

## 📦 Key Files Reference

### Backend Files
```
promgen/
├── views.py              # View logic (2,317 lines)
├── forms.py              # Form definitions (386 lines)
├── urls.py               # URL routing
├── context_processors.py # Global context (15 lines)
└── templatetags/
    └── promgen.py        # Custom tags (323 lines)
```

### Template Files
```
promgen/templates/
├── base.html             # Main template (99 lines)
└── promgen/
    ├── navbar.html       # Navigation (84 lines)
    ├── home.html         # Dashboard
    ├── service_*.html    # Service pages
    ├── project_*.html    # Project pages
    └── vue/              # Vue templates
        ├── silence_create_or_update_modal.html
        ├── silence_list_modal.html
        └── ...
```

### JavaScript Files (Legacy)
```
promgen/static/js/
├── promgen.js            # Utils & jQuery (218 lines)
├── promgen.vue.js        # Vue app (729 lines)
└── mixins.vue.js         # Vue mixins
```

### JavaScript Files (Modern)
```
promgen/vite_assets/
├── app.js                # Entry point (50 lines)
├── App.vue               # Root component
├── components/           # Vue components
├── views/                # Page components
├── router/               # Vue Router
└── stores/               # Pinia stores
```

### Configuration Files
```
./
├── vite.config.js        # Vite config (39 lines)
├── package.json          # NPM deps (33 lines)
└── eslint.config.js      # Linting rules
```

---

## 🎓 Learning Resources

### Internal Resources
- [Main Documentation](../index.rst)
- [API Modules](../modules/)
- [Plugin Development](../plugin/)
- [User Guide](../user/)

### External Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Vue.js Guide](https://vuejs.org/guide/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Bootstrap 3 Docs](https://getbootstrap.com/docs/3.3/)
- [PrimeVue](https://primevue.org/)

### Code Examples
All documentation includes practical code examples:
- ✅ Django view patterns
- ✅ Template snippets
- ✅ Vue component examples
- ✅ API integration
- ✅ State management

---

## 📝 Documentation Coverage

### ✅ Fully Documented
- Architecture overview
- Template system
- Vue.js components (legacy)
- Vite/Vue 3 setup
- Common patterns
- Quick reference

### 🚧 Partially Documented
- Static asset organization (mentioned but not detailed)
- Form handling (covered in templates)
- UI/UX patterns (scattered across docs)

### 📋 Future Additions
- Detailed static assets guide
- Comprehensive forms documentation
- UI/UX patterns catalog
- Development workflow guide
- Testing strategies

---

## 🤝 Contributing to Documentation

### How to Update

1. **Edit Markdown Files**
   - Files are in `docs/frontend/`
   - Use standard Markdown syntax
   - Include code examples

2. **Keep Examples Current**
   - Match actual code in project
   - Test code snippets
   - Update line numbers if changed

3. **Update This Index**
   - Add new documents
   - Update line counts
   - Maintain links

4. **Submit Pull Request**
   - Describe changes
   - Link to related issues
   - Request review

### Documentation Style

- **Clear headings** - Use descriptive titles
- **Code examples** - Show, don't just tell
- **Practical** - Focus on real-world usage
- **Organized** - Logical flow and structure
- **Updated** - Keep in sync with code

---

## 📊 Documentation Metrics

```
Total Documentation Size
├── README.md           :    90 lines (  2.7%)
├── 01-architecture.md  :   420 lines ( 12.7%)
├── 02-templates.md     :   683 lines ( 20.6%)
├── 03-vue-components.md:   925 lines ( 27.9%)
├── 04-vite-setup.md    :   801 lines ( 24.2%)
└── SUMMARY.md          :   395 lines ( 11.9%)
                         ─────────────────────
                           3,314 lines (100.0%)
```

### Coverage by Topic
- **Architecture:** 420 lines (12.7%)
- **Templates:** 683 lines (20.6%)
- **Vue (Legacy):** 925 lines (27.9%)
- **Modern (Vite):** 801 lines (24.2%)
- **Reference:** 485 lines (14.6%)

---

## 🎉 Get Started!

Ready to dive in? Here's your reading order:

1. **[README.md](./README.md)** - 5 minutes
2. **[01-architecture.md](./01-architecture.md)** - 20 minutes
3. **[02-templates.md](./02-templates.md)** - 30 minutes
4. **[03-vue-components.md](./03-vue-components.md)** - 45 minutes
5. **[04-vite-setup.md](./04-vite-setup.md)** - 40 minutes
6. **[SUMMARY.md](./SUMMARY.md)** - Reference (keep handy!)

**Total Reading Time:** ~2.5 hours for complete understanding

---

## 📧 Feedback

Found an error? Have a suggestion? Want to contribute?

- **Issues:** [GitHub Issues](https://github.com/line/promgen/issues)
- **Pull Requests:** [Contribute](https://github.com/line/promgen/pulls)
- **Discussions:** [GitHub Discussions](https://github.com/line/promgen/discussions)

---

**Last Updated:** 2026-07-09  
**Documentation Version:** 1.0  
**Maintained by:** Promgen Contributors

