# Vue.js Components (Legacy)

## Overview

Promgen uses Vue.js 3 loaded from a CDN for client-side interactivity. This is a "legacy" approach (no build system) but remains functional and effective for the application's needs.

**File:** `promgen/static/js/promgen.vue.js`

## Architecture

### Global Vue App

The main Vue application is mounted on `<div id="vue">` which wraps all page content:

```javascript
const app = Vue.createApp({
    delimiters: ['[[', ']]'],  // Avoid conflict with Django {{ }}
    data() {
        return dataStore;
    },
    mixins: [mixins],
    methods: {
        // Global methods
    },
    computed: {
        // Global computed properties
    },
    mounted: function() {
        this.fetchAlerts();
        this.fetchSilences();
    },
});

// Mount the app
app.mount("#vue");
```

## Data Stores

### Global Store

```javascript
const globalStore = Vue.reactive({
    state: {
        messages: []  // Flash messages for modals
    },
    setMessages(messages) {
        this.state.messages = [...messages];
    }
});
```

### Data Store

Main application state:

```javascript
const dataStore = Vue.reactive({
    global: globalStore.state,
    components: {},           // Component visibility toggles
    selectedHosts: [],        // Selected hosts for bulk actions
    globalSilences: [],       // All silences from Alertmanager
    globalAlerts: []          // All alerts from Alertmanager
});
```

### Silence Store

Manages silence creation/editing:

```javascript
const silenceStore = Vue.reactive({
    state: {
        show: false,          // Modal visibility
        labels: {},           // Matchers {label: [value, operator]}
        silence: null,        // Current silence being edited
    },
    setLabels(labels) {
        // Normalize labels to [value, operator] format
        this.state.labels = { ...labels };
        for (const [key, value] of Object.entries(this.state.labels)) {
            if (!Array.isArray(value)) {
                if (value.includes("*")) {
                    this.state.labels[key] = [value, "=~"];
                } else {
                    this.state.labels[key] = [value, "="];
                }
            }
        }
    },
    addLabel(label, value) {
        // Add or update a matcher
        this.state.labels[label] = value;
    },
    setSilence(silence) {
        // Load existing silence for editing
        this.state.silence = silence;
        this.setLabels(silence.labels);
    },
    showModal() {
        this.state.show = true;
    },
    hideModal() {
        this.state.show = false;
    },
});
```

### Silence List Store

Manages the silence list modal with filtering:

```javascript
const silenceListStore = Vue.reactive({
    state: {
        show: false,
        labels: []  // Array of filter labels
    },
    addFilterLabel(label, value, operator) {
        if (!this.state.labels.some(item => 
            item.label === label && 
            item.value === value && 
            item.operator === operator
        )) {
            this.state.labels.push({label, value, operator});
        }
    },
    removeFilterLabel(label, value, operator) {
        const index = this.state.labels.findIndex(item =>
            item.label === label &&
            item.value === value &&
            item.operator === operator
        );
        if (index > -1) {
            this.state.labels.splice(index, 1);
        }
    },
    showModal(params, silences, target) {
        // Optional pre-filled matchers
        this.state.show = true;
    },
    hideModal() {
        this.state.show = false;
    },
});
```

### Exporter Test Result Store

Stores results from exporter tests:

```javascript
const exporterTestResultStore = Vue.reactive({
    results: {},
    addResult(url, statusCode) {
        this.results[url] = statusCode;
    },
    setResults(results) {
        this.results = { ...results };
    },
});
```

## Global Methods

### Alert & Silence Management

#### `fetchAlerts()`
Fetches active alerts from Alertmanager:

```javascript
fetchAlerts: function () {
    fetch('/proxy/v1/alerts')
        .then(response => response.json())
        .then(response => {
            this.globalAlerts = response.sort(alert => alert.startsAt);
        });
}
```

#### `fetchSilences()`
Fetches silences from Alertmanager:

```javascript
fetchSilences: function () {
    fetch('/proxy/v1/silences')
        .then(response => response.json())
        .then(response => {
            let silences = response.sort(silence => silence.startsAt);
            
            // Convert matchers to simplified labels map
            for (let silence of silences) {
                silence.labels = {};
                for (let matcher of silence.matchers) {
                    silence.labels[matcher.name] = matcher.value;
                }
            }
            
            this.globalSilences = silences;
        });
}
```

#### `expireSilence(id)`
Deletes/expires a silence:

```javascript
expireSilence(id) {
    fetch(`/proxy/v1/silences/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                return response.json();
            }
        })
        .then(result => {
            if (result) {
                globalStore.setMessages(result.messages);
            }
        });
}
```

### Silence Creation

#### `setSilenceLabels(labels)`
Opens silence modal with pre-filled labels:

```javascript
setSilenceLabels(labels) {
    silenceStore.setLabels(labels);
    silenceStore.showModal();
}
```

#### `addSilenceLabel(label, value, operator)`
Adds a label matcher:

```javascript
addSilenceLabel(label, value, operator) {
    silenceStore.addLabel(label, [value, operator]);
    silenceStore.showModal();
}
```

#### `silenceSelectedHosts(event)`
Creates silence for selected hosts:

```javascript
silenceSelectedHosts(event) {
    this.setSilenceLabels(event.target.dataset);
    this.addSilenceLabel('instance', this.selectedHosts.join('|'));
}
```

### UI Helpers

#### `toggleComponent(component)`
Toggles component visibility:

```javascript
toggleComponent: function (component) {
    let state = Boolean(this.components[component]);
    this.components[component] = !state;
}
```

#### `toggleCollapse(target)`
Toggles Bootstrap collapse:

```javascript
toggleCollapse: function (target) {
    let tgt = document.getElementById(target);
    tgt.classList.toggle('collapse');
}
```

## Computed Properties

### Alert Grouping

```javascript
computed: {
    // Group alerts by service label
    activeServiceAlerts: function () {
        return groupByLabel(this.activeAlerts, 'service');
    },
    
    // Group alerts by project label
    activeProjectAlerts: function () {
        return groupByLabel(this.activeAlerts, 'project');
    },
    
    // Group alerts by rule name
    activeRuleAlerts: function () {
        return groupByLabel(this.activeAlerts, 'alertname');
    },
    
    // Filter to only active alerts
    activeAlerts: function () {
        return this.globalAlerts.filter(
            alert => alert.status.state === 'active'
        );
    },
    
    // Filter to non-expired silences
    activeSilences: function () {
        return this.globalSilences.filter(
            silence => silence.status.state !== 'expired'
        );
    }
}
```

### Active Silence Filters

```javascript
getActiveSilencesForService: function (service) {
    return getActiveSilences(this.activeSilences, "service", service);
},

getActiveSilencesForProject: function (project, service) {
    const silencesMatchProject = getActiveSilences(
        this.activeSilences, "project", project
    );
    const silencesMatchService = getActiveSilences(
        this.activeSilences, "service", service
    );
    
    // Project silences that don't specify service, or match the service
    return silencesMatchProject.filter(silence =>
        !silence.matchers.some(matcher => matcher.name === "service") ||
        silencesMatchService.includes(silence)
    );
}
```

## Components

### Silence Row Component

**File:** `promgen/templates/promgen/vue/silence_row.html`

Displays a single silence:

```javascript
app.component("silence-row", {
    delimiters: ["[[", "]]"],
    template: "#silence-row-template",
    mixins: [mixins],
    emits: ["matcherClick"],
    props: {
        silence: {
            type: Object,
            required: true,
        },
        labelColor: {
            type: String,
            default: "info",
        },
    },
    methods: {
        getOperator(matcher) {
            if (matcher.isEqual) {
                return matcher.isRegex ? "=~" : "=";
            } else {
                return matcher.isRegex ? "!~" : "!=";
            }
        },
    },
});
```

**Template:**
```html
<div class="panel panel-default">
  <div class="panel-body">
    <div class="pull-right">
      <button @click="$emit('matcherClick')" class="btn btn-xs btn-default">
        Filter
      </button>
      <button @click="$root.editSilence(silence)" class="btn btn-xs btn-primary">
        Edit
      </button>
      <button @click="$root.expireSilence(silence.id)" class="btn btn-xs btn-danger">
        Expire
      </button>
    </div>
    
    <div>
      <strong>Matchers:</strong>
      <span v-for="matcher in silence.matchers" class="label label-info">
        [[ matcher.name ]] [[ getOperator(matcher) ]] [[ matcher.value ]]
      </span>
    </div>
    
    <div>
      <strong>Comment:</strong> [[ silence.comment ]]
    </div>
    
    <div>
      <strong>Created:</strong> [[ time(silence.createdAt) ]]
      <strong>By:</strong> [[ silence.createdBy ]]
    </div>
    
    <div>
      <strong>Starts:</strong> [[ time(silence.startsAt) ]]
      <strong>Ends:</strong> [[ time(silence.endsAt) ]]
    </div>
  </div>
</div>
```

### Silence Create/Update Modal

Handles creating and editing silences:

```javascript
app.component('silence-create-or-update-modal', {
    template: '#silence-create-or-update-modal-template',
    delimiters: ['[[', ']]'],
    mixins: [mixins],
    data: () => ({
        state: silenceStore.state,
        form: {operator: "="}
    }),
    computed: {
        globalMessages() {
            return globalStore.state.messages;
        },
    },
    methods: {
        addLabel() {
            if (this.form.label && this.form.value && this.form.operator) {
                silenceStore.addLabel(
                    this.form.label, 
                    [this.form.value, this.form.operator]
                );
                this.form.label = '';
                this.form.value = '';
                this.form.operator = "=";
            }
        },
        
        removeLabel(label) {
            delete this.state.labels[label];
        },
        
        submit() {
            matchers = [];
            for (const [label, value] of Object.entries(this.state.labels)) {
                matchers.push({
                    name: label,
                    value: value[0],
                    isEqual: ["=", "=~"].includes(value[1]),
                    isRegex: ["=~", "!~"].includes(value[1]),
                });
            }
            
            const body = JSON.stringify({
                id: this.state.silence?.id,
                matchers: matchers,
                startsAt: this.form.startsAt 
                    ? new Date(this.form.startsAt).toISOString()
                    : undefined,
                endsAt: this.form.endsAt
                    ? new Date(this.form.endsAt).toISOString()
                    : undefined,
                duration: this.form.duration,
                createdBy: this.form.createdBy,
                comment: this.form.comment
            });
            
            const headers = {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value,
            };
            
            fetch('/proxy/v2/silences', {method: 'POST', headers, body})
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        return response.json();
                    }
                })
                .then(result => {
                    if (result) {
                        globalStore.setMessages(result.messages);
                    }
                });
        },
        
        hideModal() {
            const modal = $('#silenceCreateModal');
            if (modal.length) {
                globalStore.setMessages([]);
                this.form = {operator: "="};
                silenceStore.state.silence = null;
                this.state = silenceStore.state;
                modal.modal('hide');
            }
        },
        
        showModal() {
            if (this.state.silence) {
                // Pre-fill form for editing
                this.form.startsAt = this.time(
                    this.state.silence.startsAt, 
                    "yyyy-MM-dd'T'HH:mm"
                );
                this.form.endsAt = this.time(
                    this.state.silence.endsAt, 
                    "yyyy-MM-dd'T'HH:mm"
                );
                this.form.comment = this.state.silence.comment;
            }
            
            const modal = $('#silenceCreateModal');
            if (modal.length) {
                modal.on('hidden.bs.modal', function (e) {
                    silenceStore.hideModal();
                });
                modal.modal('show');
            }
        },
    },
    watch: {
        "state.show"(val) {
            if (val) {
                this.showModal();
            } else {
                this.hideModal();
            }
        },
    },
});
```

### Silence List Modal

Displays and filters silences:

```javascript
app.component('silence-list-modal', {
    template: '#silence-list-modal-template',
    delimiters: ['[[', ']]'],
    mixins: [mixins],
    data() {
        return {
            state: silenceListStore.state,
            form: {
                label: '',
                value: '',
                operator: "="
            },
            store: dataStore
        };
    },
    computed: {
        activeSilences() {
            const silences = this.$root.activeSilences || [];
            if (silences) {
                for (const silence of silences) {
                    silence.matchers.sort((a, b) => 
                        a.name.localeCompare(b.name)
                    );
                }
            }
            return silences;
        },
        
        filteredSilences() {
            if (!this.state.labels || this.state.labels.length === 0) {
                return this.activeSilences;
            }
            
            // Group matchers by label
            const groups = this.state.labels.reduce((map, item) => {
                if (item.label) {
                    if (!map.has(item.label)) {
                        map.set(item.label, []);
                    }
                    map.get(item.label).push(item);
                }
                return map;
            }, new Map());
            
            // Filter silences
            return this.activeSilences.filter(silence => {
                let doesSilenceMatch = false;
                for (const matcher of silence.matchers) {
                    const groupsForMatcher = groups.get(matcher.name);
                    if (groupsForMatcher) {
                        const matchFound = groupsForMatcher.some(group =>
                            matcher.name === group.label &&
                            matcher.value === group.value &&
                            (
                                (matcher.isEqual && ["=", "=~"].includes(group.operator)) ||
                                (!matcher.isEqual && ["!=", "!~"].includes(group.operator))
                            )
                        );
                        if (!matchFound) {
                            return false;
                        } else {
                            doesSilenceMatch = true;
                        }
                    }
                }
                return doesSilenceMatch;
            });
        },
        
        uniqueLabels() {
            // Get all unique label names from filtered silences
            const labels = new Set();
            this.filteredSilences.forEach(silence => {
                silence.matchers.forEach(matcher => {
                    labels.add(matcher.name);
                });
            });
            return Array.from(labels).sort();
        },
        
        filteredOperators() {
            // Get operators for selected label
            if (!this.form.label) return [];
            const operators = new Set();
            this.filteredSilences.forEach((silence) => {
                silence.matchers.forEach((matcher) => {
                    if (matcher.name === this.form.label) {
                        const op = matcher.isEqual ?
                            (matcher.isRegex ? "=~" : "=") : 
                            (matcher.isRegex ? "!~" : "!=");
                        operators.add(op);
                    }
                });
            });
            return ["=", "=~", "!=", "!~"].filter((op) => operators.has(op));
        },
        
        filteredValues() {
            // Get values for selected label and operator
            if (!this.form.label) return [];
            const values = new Set();
            this.filteredSilences.forEach(silence => {
                silence.matchers.forEach(matcher => {
                    if (
                        matcher.name === this.form.label &&
                        (
                            (matcher.isEqual === ["=", "=~"].includes(this.form.operator)) &&
                            (matcher.isRegex === ["=~", "!~"].includes(this.form.operator))
                        )
                    ) {
                        values.add(matcher.value);
                    }
                });
            });
            return Array.from(values).sort();
        }
    },
    methods: {
        addFilterLabel(label, value, operator) {
            // Add filter or use form values
            if (label && value && operator) {
                silenceListStore.addFilterLabel(label, value, operator);
            } else if (this.form.label && this.form.value && this.form.operator) {
                silenceListStore.addFilterLabel(
                    this.form.label,
                    this.form.value,
                    this.form.operator,
                );
            }
            this.form.label = '';
            this.form.value = '';
            this.form.operator = "=";
        },
        
        removeFilterLabel(label, value, operator) {
            silenceListStore.removeFilterLabel(label, value, operator);
        },
        
        // Modal management
        hideModal() { /* ... */ },
        showModal() { /* ... */ },
    },
    watch: {
        "state.show"(val) {
            if (val) {
                this.showModal();
            } else {
                this.hideModal();
            }
        }
    },
});
```

### Data Source Usage Component

Displays data source metric usage:

```javascript
app.component("data-source-usage", {
    delimiters: ['[[', ']]'],
    props: ["shard", "metric", "max"],
    data: function () {
        return {
            count: 0,
            ready: false,
        };
    },
    mixins: [mixins],
    computed: {
        load: function () {
            return this.count / this.maxAsInt;
        },
        classes: function () {
            if (this.load > 0.9) return "label label-danger";
            if (this.load > 0.7) return "label label-warning";
            if (this.load > 0.5) return "label label-info";
            if (this.count == 0) return "label label-default";
            return "label label-success";
        },
        maxAsInt() {
            return Number.parseInt(this.max);
        },
    },
    template: '#data-source-usage-template',
    mounted() {
        const params = new URLSearchParams({
            metric: this.metric,
        });
        fetch(`/rest/shard/${this.shard}/usages/?${params}`)
            .then(response => response.json())
            .then(result => 
                this.count = Number.parseInt(result.data.result[0].value[1])
            )
            .finally(() => this.ready = true);
    },
});
```

### Exporter Test Component

Tests exporter configurations:

```javascript
app.component('exporter-test', {
    delimiters: ['[[', ']]'],
    props: ['href'],
    template: '#exporter-test-template',
    methods: {
        onTestSubmit: function (event) {
            let form = new FormData(event.srcElement.closest('form'))
            fetch(this.href, { body: form, method: "post", })
                .then(result => result.json())
                .then((result) => {
                    exporterTestResultStore.setResults(result);
                    if (result.error) {
                        globalStore.setMessages([
                            {
                                class: "alert alert-danger",
                                message: result.error,
                            },
                        ]);
                    }
                })
                .catch(error => alert(error))
        }
    }
});
```

## Mixins

**File:** `promgen/static/js/mixins.vue.js`

Common functionality shared across components:

```javascript
const mixins = {
    methods: {
        // Time formatting using Luxon
        time(value, fmt = 'DATETIME_MED') {
            const dt = luxon.DateTime.fromISO(value);
            if (fmt.includes('\'')) {
                return dt.toFormat(fmt);
            }
            return dt.toLocaleString(luxon.DateTime[fmt]);
        }
    }
};
```

## Utility Functions

**File:** `promgen/static/js/promgen.js`

### groupByLabel

Groups items by a label:

```javascript
function groupByLabel(items, label) {
    const groups = new Map();
    
    for (const item of items) {
        const key = item.labels[label];
        if (!key) continue;
        
        const group = groups.get(key);
        if (group) {
            group.push(item);
        } else {
            groups.set(key, [item]);
        }
    }
    
    return groups;
}
```

### getActiveSilences

Filters silences by label matcher:

```javascript
function getActiveSilences(items, labelName, labelValue) {
    const activeSilences = [];
    for (const item of items) {
        const matches = item.matchers.some(matcher =>
            doesMatcherMatch(matcher, labelName, labelValue)
        );
        if (matches) {
            activeSilences.push(item);
        }
    }
    return activeSilences;
}
```

### doesMatcherMatch

Checks if a matcher matches a label:

```javascript
function doesMatcherMatch(matcher, labelName, labelValue) {
    if (matcher.name !== labelName) {
        return false;
    }
    
    if (matcher.isRegex) {
        const regex = new RegExp("^(?:" + matcher.value + ")$");
        const matches = regex.test(labelValue);
        return matcher.isEqual ? matches : !matches;
    } else {
        return matcher.isEqual ?
            (matcher.value === labelValue) :
            (matcher.value !== labelValue);
    }
}
```

## Usage Patterns

### Opening Silence Modal from Template

```html
<!-- From service detail page -->
<button @click="setSilenceLabels({service: '{{service.name}}'})"
        class="btn btn-warning">
  Silence Service
</button>

<!-- From project detail page -->
<button @click="setSilenceLabels({
                    service: '{{project.service.name}}',
                    project: '{{project.name}}'
                 })"
        class="btn btn-warning">
  Silence Project
</button>
```

### Displaying Active Alerts

```html
<div v-cloak v-if="activeServiceAlerts.has('{{service.name}}')">
  <table>
    <tr v-for="alert in activeServiceAlerts.get('{{service.name}}')">
      <td>[[ alert.labels.alertname ]]</td>
      <td>[[ alert.labels.severity ]]</td>
      <td>[[ time(alert.startsAt) ]]</td>
    </tr>
  </table>
</div>
```

### Component Communication

```html
<!-- Parent emits to child -->
<silence-row :silence="silence" 
             @matcherClick="addFilterLabel(...)">
</silence-row>

<!-- Child emits event -->
<button @click="$emit('matcherClick')">Filter</button>
```

## Best Practices

1. **Use delimiters `[[ ]]`** for Vue to avoid Django conflicts
2. **Keep state in reactive stores** for shared data
3. **Use v-cloak** to hide unrendered Vue until ready
4. **Use v-pre** for Django-only content
5. **Emit events** for child-to-parent communication
6. **Use computed properties** for derived state
7. **Fetch data in mounted()** hook
8. **Handle errors** with try/catch or .catch()
9. **Show loading states** while fetching
10. **Clean up** on component unmount if needed

