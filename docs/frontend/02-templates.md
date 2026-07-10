# Django Templates

## Overview

Promgen uses Django's template engine to render HTML pages. Templates are organized hierarchically with a base template providing the overall structure and individual page templates extending it.

## Directory Structure

```
promgen/templates/
├── base.html                        # Main base template
├── 404.html                         # Error pages
├── 500.html
├── admin/                           # Django admin customization
├── django/                          # Django framework templates
├── registration/                    # Auth templates
├── rest_framework/                  # DRF templates
├── vite/                           # Vite integration templates
└── promgen/                        # Application templates
    ├── navbar.html                 # Navigation bar
    ├── global_messages.html        # Flash messages
    ├── global_alerts.html          # Alert notifications
    ├── global_silences.html        # Silence notifications
    ├── home.html                   # Dashboard
    ├── service_list.html           # Service listing
    ├── service_detail.html         # Service details
    ├── project_detail.html         # Project details
    ├── rule_list.html              # Rules listing
    ├── alert_list.html             # Alert history
    ├── search.html                 # Search results
    ├── profile.html                # User profile
    └── vue/                        # Vue component templates
        ├── silence_create_or_update_modal.html
        ├── silence_list_modal.html
        ├── silence_row.html
        ├── exporter_test.html
        ├── exporter_result.html
        ├── bootstrap_panel.html
        └── data_source_usage.html
```

## Base Template

**File:** `promgen/templates/base.html`

The base template provides the HTML skeleton for all pages:

```django
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title v-pre>{% block title %}Promgen {{ VERSION }}{% endblock %}</title>
  
  <!-- CSS -->
  <link rel="stylesheet" href="{% static 'css/bootstrap.min.css' %}">
  <link rel="stylesheet" href="{% static 'css/bootstrap-theme.min.css' %}">
  <link rel="stylesheet" href="{% static 'css/bootstrap-switch.min.css' %}">
  <link rel="stylesheet" href="{% static 'css/promgen.css' %}">
  <link rel="stylesheet" href="{% static 'css/select2-4.1.0-rc.0.min.css' %}">
</head>

<body>
  <div id="vue">
    {% block navbar %}
    {% include "promgen/navbar.html" %}
    {% endblock %}
    
    <div class="container">
      {% include 'promgen/global_messages.html' %}
      
      <!-- Vue Modals (Global) -->
      <silence-create-or-update-modal></silence-create-or-update-modal>
      <silence-list-modal></silence-list-modal>
      
      {% include 'promgen/global_alerts.html' %}
      {% include 'promgen/global_silences.html' %}
      
      {% block content %}{% endblock %}
    </div>
  </div>
  
  <!-- JavaScript -->
  <script src="{% static 'js/jquery.min.js' %}"></script>
  <script src="{% static 'js/bootstrap.min.js' %}"></script>
  <script src="{% static 'js/vue-3.3.7/vue.global.prod.js' %}"></script>
  <!-- ... more scripts ... -->
  
  <!-- Vue Component Templates -->
  <script type="text/x-template" id="silence-create-or-update-modal-template">
    {% include 'promgen/vue/silence_create_or_update_modal.html' %}
  </script>
  
  <!-- Initialize Vue App -->
  <script>app.mount("#vue")</script>
</body>
</html>
```

**Key Features:**
- Single root element `#vue` for Vue.js mounting
- Bootstrap 3 for responsive layout
- Block system for customization
- Global Vue modals included
- JavaScript loaded at bottom for performance

## Template Blocks

Common blocks extended by child templates:

### `{% block title %}`
Page title displayed in browser tab:
```django
{% block title %}
Promgen / Service / {{ service.name }}
{% endblock %}
```

### `{% block content %}`
Main page content:
```django
{% block content %}
<div class="page-header">
  <h1>Services</h1>
</div>
<!-- page content -->
{% endblock %}
```

### `{% block javascript %}`
Page-specific JavaScript:
```django
{% block javascript %}
<script>
  // Custom page scripts
</script>
{% endblock %}
```

## Common Template Patterns

### 1. List Views

**Example:** `service_list.html`

```django
{% extends "base.html" %}

{% block content %}
<div class="page-header">
  <h1>Services</h1>
  <a href="{% url 'service-new' %}" class="btn btn-primary">
    Register Service
  </a>
</div>

{% for service in service_list %}
  {% include "promgen/service_block.html" %}
{% empty %}
  <p>No services found.</p>
{% endfor %}

<!-- Pagination -->
{% include "promgen/pagination_short.html" with page_obj=page_obj %}
{% endblock %}
```

**Pattern:**
- Header with title and action buttons
- Loop through queryset (provided by ListView)
- Include partial templates for reusable components
- Pagination component
- Empty state message

### 2. Detail Views

**Example:** `service_detail.html`

```django
{% extends "base.html" %}
{% load i18n %}
{% load promgen %}

{% block title %}
Promgen / Service / {{ service.name }}
{% endblock %}

{% block content %}
{% current_role service as role %}

<!-- Header -->
<div class="page-header promgen-flex-space-between-center">
  <div>
    <h1>Service: {{ service.name }}</h1>
  </div>
  {% include "promgen/service_action_button_group.html" %}
</div>

<!-- Breadcrumb -->
{% breadcrumb service %}

<!-- Description -->
{% if service.description %}
<div class="panel panel-default">
  <div v-pre class="panel-body">
    {{service.description|linebreaksbr|urlize}}
  </div>
</div>
{% endif %}

<!-- Active Alerts (Vue Component) -->
<div class="panel panel-danger" v-cloak v-if="activeServiceAlerts.has('{{service.name}}')">
  <div class="panel-heading">
    <a @click="toggleCollapse('alerts-service-{{service.name|slugify}}')"
       class="btn btn-danger btn-sm">
      Active alerts
    </a>
  </div>
  <table id="alerts-service-{{service.name|slugify}}" 
         class="table table-bordered collapse">
    <tr v-for="alert in activeServiceAlerts.get('{{service.name}}')">
      {% include 'promgen/alert_row.html' %}
    </tr>
  </table>
</div>

<!-- Tabs -->
<ul class="nav nav-tabs mb-5" role="tablist">
  <li role="presentation" class="active">
    <a href="#projects" data-toggle="tab">Projects</a>
  </li>
  <li role="presentation">
    <a href="#rules" data-toggle="tab">Rules</a>
  </li>
  <li role="presentation">
    <a href="#notifiers" data-toggle="tab">Notifiers</a>
  </li>
  <li role="presentation">
    <a href="#members" data-toggle="tab">Members</a>
  </li>
</ul>

<!-- Tab Content -->
<div class="well">
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="projects">
      {% include "promgen/service_detail_projects.html" %}
    </div>
    
    <div role="tabpanel" class="tab-pane" id="rules">
      {% if role == "ADMIN" or role == "EDIT" %}
      <div class="text-right mb-4">
        <a href="{% url 'rule-new' 'service' service.id %}" 
           class="btn btn-primary btn-sm">
          Register Rule
        </a>
      </div>
      {% endif %}
      {% include "promgen/service_block_panel_rules.inc.html" %}
    </div>
    
    <div role="tabpanel" class="tab-pane" id="notifiers">
      {% include "promgen/service_block_panel_notifiers.inc.html" %}
    </div>
    
    <div role="tabpanel" class="tab-pane" id="members">
      {% include "promgen/permission_block.html" with object=service %}
    </div>
  </div>
</div>

{% endblock %}
```

**Pattern:**
- Role-based rendering using custom template tag
- Breadcrumb navigation
- Conditional sections (alerts, description)
- Tabbed interface with Bootstrap
- Permission-based action buttons
- Partial templates for organization

### 3. Form Views

**Example:** `project_form.html`

```django
{% extends "base.html" %}
{% load i18n %}

{% block content %}
<div class="page-header">
  <h1>{% translate "Register Project" %}</h1>
</div>

{% breadcrumb service label="Register Project" %}

<form method="post" class="form-horizontal">
  {% csrf_token %}
  
  <div class="form-group">
    <label class="col-sm-2 control-label">{{ form.name.label }}</label>
    <div class="col-sm-10">
      {{ form.name }}
      {% if form.name.errors %}
        <span class="help-block">{{ form.name.errors }}</span>
      {% endif %}
    </div>
  </div>
  
  <div class="form-group">
    <label class="col-sm-2 control-label">{{ form.shard.label }}</label>
    <div class="col-sm-10">
      {{ form.shard }}
    </div>
  </div>
  
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-primary">
        {% translate "Submit" %}
      </button>
      <a href="{{ service.get_absolute_url }}" class="btn btn-default">
        {% translate "Cancel" %}
      </a>
    </div>
  </div>
</form>
{% endblock %}
```

**Pattern:**
- CSRF token required for POST forms
- Bootstrap horizontal form layout
- Field errors displayed inline
- Submit and cancel buttons
- Translation support with `{% translate %}`

## Template Includes

Promgen uses template includes for reusable components:

### Navigation Components

**navbar.html**
```django
<header class="navbar navbar-inverse navbar-static-top">
  <nav class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="/">
        <img alt="Promgen" src="{% static 'images/promgen_logo_color.png' %}">
      </a>
    </div>
    
    <div class="collapse navbar-collapse">
      {% if user.is_authenticated %}
      <ul class="nav navbar-nav">
        <li><a href="{% url 'service-list' %}">Services</a></li>
        <li><a href="{% url 'rules-list' %}">Rules</a></li>
        <!-- ... more menu items -->
      </ul>
      
      <form class="navbar-form navbar-left" action="{% url 'search' %}">
        <input name="search" type="text" class="form-control" placeholder="Search">
        <button type="submit" class="btn btn-default">Search</button>
      </form>
      
      <!-- Vue Reactive Buttons -->
      <a @click="toggleComponent('global-alerts')" 
         class="btn btn-danger navbar-btn">
        Alerts
        <span v-text="activeAlerts.length" class="badge"></span>
      </a>
      
      <a @click="openSilenceListModal" 
         class="btn btn-warning navbar-btn">
        Silences
        <span v-text="activeSilences.length" class="badge"></span>
      </a>
      {% endif %}
    </div>
  </nav>
</header>
```

### Partial Components

Common includes:

- **permission_block.html** - Display and manage permissions
- **rule_block.html** - Display rule with toggle/delete
- **notifier_block.html** - Display notifier configuration
- **host_block.html** - Display host information
- **pagination_short.html** - Pagination controls

## Template Tags and Filters

### Custom Template Tags

Located in `promgen/templatetags/promgen.py`:

#### `{% breadcrumb object %}`
Generates breadcrumb navigation:
```django
{% breadcrumb service %}
<!-- Outputs: Home > Services > MyService -->

{% breadcrumb project %}
<!-- Outputs: Home > Services > MyService > MyProject -->
```

#### `{% current_role object as var %}`
Gets user's role for permission checks:
```django
{% current_role service as role %}
{% if role == "ADMIN" or role == "EDIT" %}
  <a href="{% url 'service-update' service.id %}">Edit</a>
{% endif %}
```

Possible roles: `ADMIN`, `EDIT`, `VIEW`, `NONE`

#### `{% urlqs 'view-name' param=value %}`
Generate URL with query string:
```django
<a href="{% urlqs 'alert-list' noSent=1 %}">Unsent Alerts</a>
<!-- /alerts/?noSent=1 -->
```

#### `{% qs_replace 'page' page_obj.next_page_number %}`
Replace query string parameter (for pagination):
```django
<a href="?{% qs_replace 'page' page_obj.next_page_number %}">Next</a>
```

### Custom Filters

#### `|rulemacro`
Expand rule exclusion macros:
```django
{{ rule|rulemacro }}
<!-- Replaces <exclude> with actual exclusion labels -->
```

#### `|pretty_json`
Format JSON for display:
```django
<pre>{{ data|pretty_json }}</pre>
```

#### `|strftime`
Format timestamps:
```django
{{ alert.startsAt|strftime:"%Y-%m-%d %H:%M:%S" }}
```

#### `|klass`
Get class name:
```django
{{ object|klass }}
<!-- Outputs: Service, Project, etc. -->
```

## Vue Integration in Templates

### Vue Directives

Templates mix Django and Vue syntax:

```django
<!-- v-cloak: Hide until Vue is ready -->
<div v-cloak v-if="activeAlerts.length > 0">
  Active Alerts
</div>

<!-- v-for: Loop through data -->
<div v-for="alert in activeAlerts">
  [[ alert.labels.alertname ]]
</div>

<!-- v-text: Bind text content -->
<span v-text="activeSilences.length"></span>

<!-- @click: Event handler -->
<button @click="setSilenceLabels({service: '{{service.name}}'})">
  Silence
</button>

<!-- v-pre: Skip Vue compilation -->
<div v-pre>
  {{ django.variable }}  <!-- Django renders this -->
</div>
```

**Note:** Vue uses `[[` and `]]` delimiters to avoid conflicts with Django's `{{` and `}}`.

### Passing Data from Django to Vue

#### Method 1: Data Attributes
```django
<button @click="setSilenceDataset($event)"
        data-service="{{service.name}}"
        data-project="{{project.name}}">
  Silence
</button>
```

JavaScript:
```javascript
setSilenceDataset(event) {
    this.setSilenceLabels(event.target.dataset);
}
```

#### Method 2: Template Variables
```django
<div v-if="activeServiceAlerts.has('{{service.name}}')">
  <!-- ... -->
</div>
```

Vue interpolates the Django variable as a string literal.

#### Method 3: JSON in Script Tag
```django
<script>
window.INITIAL_DATA = {{ data|tojson }};
</script>
```

## Internationalization (i18n)

Promgen supports multiple languages:

### Loading Translation Tags
```django
{% load i18n %}
```

### Translating Strings
```django
{% translate "Register Service" %}
{% blocktranslate %}Welcome, {{ user.username }}{% endblocktranslate %}
```

### Available Languages
- English (en)
- Japanese (ja)

### Translation Files
Located in `promgen/locale/`

## Responsive Design

All templates use Bootstrap 3's responsive grid:

```django
<div class="row">
  <div class="col-sm-6 col-md-4">
    <!-- Content -->
  </div>
  <div class="col-sm-6 col-md-8">
    <!-- Content -->
  </div>
</div>
```

**Breakpoints:**
- `xs` - Extra small (<768px)
- `sm` - Small (≥768px)
- `md` - Medium (≥992px)
- `lg` - Large (≥1200px)

## Accessibility

### Semantic HTML
```django
<nav role="navigation">
  <ul>
    <li><a href="...">Link</a></li>
  </ul>
</nav>
```

### ARIA Labels
```django
<button aria-label="Delete rule">
  <span class="glyphicon glyphicon-trash"></span>
</button>
```

### Form Labels
```django
<label for="id_name">Service Name</label>
<input type="text" id="id_name" name="name">
```

## Performance Optimization

### Template Fragment Caching
Not extensively used, but available:
```django
{% load cache %}
{% cache 500 sidebar %}
  <!-- Expensive query results -->
{% endcache %}
```

### Prefetching in Views
Reduces N+1 queries:
```python
# In views.py
queryset = Service.objects.prefetch_related(
    'project_set',
    'project_set__rule_set',
    'notifiers',
)
```

Templates can then iterate without additional queries:
```django
{% for project in service.project_set.all %}
  {% for rule in project.rule_set.all %}
    {{ rule.name }}
  {% endfor %}
{% endfor %}
```

## Common Pitfalls

### 1. Forgetting CSRF Token
```django
<!-- BAD -->
<form method="post">
  <!-- fields -->
</form>

<!-- GOOD -->
<form method="post">
  {% csrf_token %}
  <!-- fields -->
</form>
```

### 2. Vue Delimiters Conflict
```django
<!-- BAD: Django tries to render {{ alert.name }} -->
<div>[[ alert.name ]]</div>  

<!-- GOOD: Use v-text or proper delimiters -->
<div v-text="alert.name"></div>
```

### 3. Missing v-pre for Django Variables
```django
<!-- BAD: Vue processes {{ service.name }} -->
<div>{{ service.name }}</div>

<!-- GOOD: Tell Vue to skip -->
<div v-pre>{{ service.name }}</div>
```

### 4. URL Reversing Errors
```django
<!-- BAD: Hardcoded URL -->
<a href="/service/123">Service</a>

<!-- GOOD: Using url tag -->
<a href="{% url 'service-detail' service.id %}">Service</a>
```

## Best Practices

1. **Keep templates simple** - Move complex logic to views or template tags
2. **Use includes** - Break large templates into reusable components
3. **Avoid business logic** - Templates should only display data
4. **Use meaningful variable names** - `service_list` not `objects`
5. **Add comments** - Explain complex sections
6. **Follow conventions** - Use Django's naming patterns
7. **Test without JavaScript** - Ensure basic functionality works
8. **Validate HTML** - Use valid, semantic markup

