<script setup>
import { onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRulesStore, useProjectsStore, useServicesStore } from '../stores';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

const route = useRoute();
const router = useRouter();
const rulesStore = useRulesStore();
const projectsStore = useProjectsStore();
const servicesStore = useServicesStore();

const ruleId = computed(() => route.params.id);

// Load rule and parent data
const loadRuleData = async (id) => {
  await rulesStore.fetchRule(id);

  // Load parent object for breadcrumb
  const rule = rulesStore.currentRule;
  if (rule?.content_type === 'project' && rule?.object_id) {
    // Fetch project to get service info for breadcrumb
    try {
      await projectsStore.fetchProject(rule.object_id);
    } catch (error) {
      console.error('Error loading parent project:', error);
    }
  } else if (rule?.content_type === 'service' && rule?.object_id) {
    // Fetch service for breadcrumb
    try {
      await servicesStore.fetchService(rule.object_id);
    } catch (error) {
      console.error('Error loading parent service:', error);
    }
  }
};

onMounted(async () => {
  await loadRuleData(ruleId.value);
});

// Watch for route parameter changes to reload data
watch(ruleId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await loadRuleData(newId);
  }
});

const rule = computed(() => rulesStore.currentRule);

// Helper function to check if a value is a URL
const isURL = (str) => {
  if (!str || typeof str !== 'string') return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Navigation handler
const navigateToParentRule = (parentId) => {
  if (parentId) {
    router.push(`/rules/${parentId}`);
  }
};

const editRule = () => {
  router.push(`/rules/${ruleId.value}/edit`);
};

const deleteRule = async () => {
  if (confirm(`Are you sure you want to delete rule "${rule.value?.name}"?`)) {
    try {
      await rulesStore.deleteRule(ruleId.value);
      router.push('/rules');
    } catch (error) {
      alert('Error deleting rule: ' + error.message);
    }
  }
};
</script>

<template>
  <div class="rule-detail" v-if="rule">
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1>{{ rule.name }}</h1>
      </div>
      <div class="d-flex gap-2">
        <Button label="Edit" icon="pi pi-pencil" severity="info" @click="editRule" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteRule" />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <Card>
          <template #title>Basic Information</template>
          <template #content>
            <div class="info-grid">
              <div v-if="rule.content_type && rule.content_name" class="info-item">
                <strong>Parent {{ rule.content_type === 'service' ? 'Service' : rule.content_type === 'project' ? 'Project' : 'Object' }}:</strong>
                <router-link
                  :to="rule.content_type === 'service' ? `/services/${rule.object_id}` : rule.content_type === 'project' ? `/projects/${rule.object_id}` : '#'"
                  class="text-primary"
                >
                  {{ rule.content_name }}
                </router-link>
              </div>
              <div class="info-item">
                <strong>Duration:</strong>
                <span class="badge bg-info">{{ rule.duration || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <strong>Status:</strong>
                <Tag
                  :value="rule.enabled ? 'Enabled' : 'Disabled'"
                  :severity="rule.enabled ? 'success' : 'danger'"
                />
              </div>
              <div v-if="rule.parent" class="info-item">
                <strong>Parent Rule:</strong>
                <a
                  href="#"
                  class="text-primary"
                  @click.prevent="navigateToParentRule(rule.parent)"
                >
                  Rule #{{ rule.parent }}
                </a>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-md-6 mb-4">
        <Card>
          <template #title>Description</template>
          <template #content>
            <p v-if="rule.description" class="mb-0">{{ rule.description }}</p>
            <p v-else class="text-muted mb-0 fst-italic">No description provided</p>
          </template>
        </Card>
      </div>
    </div>

    <Card class="mb-4">
      <template #title>Query Clause</template>
      <template #content>
        <pre class="query-clause">{{ rule.clause || 'N/A' }}</pre>
      </template>
    </Card>

    <div class="row">
      <div class="col-md-6 mb-4">
        <Card>
          <template #title>
            Labels
            <span v-if="rule.labels && Object.keys(rule.labels).length > 0" class="badge bg-secondary ms-2">
              {{ Object.keys(rule.labels).length }}
            </span>
          </template>
          <template #content>
            <div v-if="rule.labels && Object.keys(rule.labels).length > 0" class="labels-grid">
              <div v-for="(value, key) in rule.labels" :key="key" class="label-item">
                <span class="label-key">{{ key }}:</span>
                <span class="label-value">{{ value }}</span>
              </div>
            </div>
            <p v-else class="text-muted mb-0 fst-italic">No labels defined</p>
          </template>
        </Card>
      </div>

      <div class="col-md-6 mb-4">
        <Card>
          <template #title>
            Annotations
            <span v-if="rule.annotations && Object.keys(rule.annotations).length > 0" class="badge bg-secondary ms-2">
              {{ Object.keys(rule.annotations).length }}
            </span>
          </template>
          <template #content>
            <div v-if="rule.annotations && Object.keys(rule.annotations).length > 0" class="annotations-grid">
              <div v-for="(value, key) in rule.annotations" :key="key" class="annotation-item">
                <strong class="annotation-key">{{ key }}:</strong>
                <div class="annotation-value">
                  <a v-if="isURL(value)" :href="value" target="_blank" rel="noopener noreferrer" class="text-primary">
                    {{ value }}
                    <i class="pi pi-external-link ms-1"></i>
                  </a>
                  <span v-else>{{ value }}</span>
                </div>
              </div>
            </div>
            <p v-else class="text-muted mb-0 fst-italic">No annotations defined</p>
          </template>
        </Card>
      </div>
    </div>
  </div>

  <div v-else-if="rulesStore.loading" class="text-center p-5">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    <p>Loading rule...</p>
  </div>

  <div v-else class="alert alert-warning">
    Rule not found.
  </div>
</template>

<style scoped>
.rule-detail {
  max-width: 1200px;
  padding: 2rem;
}

.rule-detail .d-flex.gap-2 {
  gap: 0.75rem !important;
  display: flex !important;
}

/* Ensure buttons have proper spacing */
.rule-detail .d-flex.gap-2 > .p-button {
  margin-right: 0.75rem;
}

.rule-detail .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

.rule-detail :deep(.p-card) {
  margin-bottom: 1.5rem;
}

.rule-detail :deep(.p-card-body) {
  padding: 1.5rem;
}

.rule-detail :deep(.p-card-content) {
  padding: 0;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item a {
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.info-item a:hover {
  text-decoration: underline;
}

.query-clause {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  margin: 0;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #2c3e50;
}

.labels-grid,
.annotations-grid {
  display: grid;
  gap: 0.75rem;
}

.label-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.label-key {
  font-weight: 600;
  color: #495057;
  min-width: 120px;
}

.label-value {
  color: #212529;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
}

.annotation-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

.annotation-key {
  color: #495057;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.annotation-value {
  color: #212529;
  word-break: break-word;
  line-height: 1.5;
}

.annotation-value a {
  text-decoration: none;
  transition: all 0.2s ease;
}

.annotation-value a:hover {
  text-decoration: underline;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
  font-weight: 600;
}

.fst-italic {
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .rule-detail {
    padding: 1.5rem;
  }

  .rule-detail :deep(.p-card-body) {
    padding: 1rem;
  }

  .label-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .label-key {
    min-width: auto;
  }

  .query-clause {
    font-size: 0.8rem;
    padding: 0.75rem;
  }

  .rule-detail .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem;
  }

  .rule-detail .d-flex.gap-2 .p-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .rule-detail {
    padding: 1rem;
  }
}
</style>

