<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRulesStore } from '../stores';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Message from 'primevue/message';

const route = useRoute();
const router = useRouter();
const rulesStore = useRulesStore();

const isEdit = computed(() => route.name === 'rule-edit');
const ruleId = computed(() => route.params.id);
const serviceId = computed(() => route.query.service_id);
const projectId = computed(() => route.query.project_id);
const contentType = computed(() => route.query.content_type || (projectId.value ? 'project' : 'service'));

const form = ref({
  name: '',
  clause: '',
  duration: '',
  description: '',
  enabled: true,
  labels: [{ key: '', value: '' }],
  annotations: [{ key: '', value: '' }],
});

const loading = ref(false);
const errors = ref({});

onMounted(async () => {
  if (isEdit.value) {
    await loadRule();
  }
});

const loadRule = async () => {
  try {
    loading.value = true;
    const rule = await rulesStore.fetchRule(ruleId.value);
    const labels = objectToKeyValueArray(rule.labels || {});
    const annotations = objectToKeyValueArray(rule.annotations || {});

    form.value = {
      name: rule.name || '',
      clause: rule.clause || '',
      duration: rule.duration || '',
      description: rule.description || '',
      enabled: rule.enabled !== undefined ? rule.enabled : true,
      labels: labels.length > 0 ? labels : [{ key: '', value: '' }],
      annotations: annotations.length > 0 ? annotations : [{ key: '', value: '' }],
    };
  } catch (error) {
    console.error('Error loading rule:', error);
    errors.value = { general: 'Failed to load rule' };
  } finally {
    loading.value = false;
  }
};

// Helper functions to convert between object and key-value array
const objectToKeyValueArray = (obj) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

const keyValueArrayToObject = (arr) => {
  const obj = {};
  arr.forEach(item => {
    if (item.key && item.key.trim()) {
      obj[item.key.trim()] = item.value;
    }
  });
  return obj;
};

// Add/remove functions for labels
const addLabel = () => {
  form.value.labels.push({ key: '', value: '' });
};

const removeLabel = (index) => {
  form.value.labels.splice(index, 1);
};

// Add/remove functions for annotations
const addAnnotation = () => {
  form.value.annotations.push({ key: '', value: '' });
};

const removeAnnotation = (index) => {
  form.value.annotations.splice(index, 1);
};

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};

  const data = {
    name: form.value.name,
    clause: form.value.clause,
    duration: form.value.duration,
    description: form.value.description,
    enabled: form.value.enabled,
    labels: keyValueArrayToObject(form.value.labels),
    annotations: keyValueArrayToObject(form.value.annotations),
  };

  try {
    if (isEdit.value) {
      await rulesStore.updateRule(ruleId.value, data);
      router.push(`/rules/${ruleId.value}`);
    } else {
      // Create new rule via service or project
      let newRule;
      if (projectId.value) {
        newRule = await rulesStore.createRuleForProject(projectId.value, data);
        router.push(`/rules/${newRule.id}`);
      } else if (serviceId.value) {
        newRule = await rulesStore.createRuleForService(serviceId.value, data);
        router.push(`/rules/${newRule.id}`);
      } else {
        errors.value = { general: 'Either service_id or project_id is required to create a rule' };
        loading.value = false;
        return;
      }
    }
  } catch (error) {
    console.error('Error saving rule:', error);
    errors.value = error.response?.data || { general: error.message };
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  if (isEdit.value) {
    router.push(`/rules/${ruleId.value}`);
  } else {
    router.back();
  }
};
</script>

<template>
  <div class="rule-form">
    <h1>{{ isEdit ? 'Edit Rule' : 'Register Rule' }}</h1>

    <Card>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div v-if="errors.general" class="mb-3">
            <Message severity="error" :closable="false">{{ errors.general }}</Message>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">Rule Name *</label>
            <InputText
              id="name"
              v-model="form.name"
              class="w-100"
              :class="{ 'p-invalid': errors.name }"
              placeholder="e.g., HighCPUUsage"
              required
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
            <small class="form-text">Unique name for the alert rule</small>
          </div>

          <div class="mb-3">
            <label for="clause" class="form-label">Query Clause *</label>
            <Textarea
              id="clause"
              v-model="form.clause"
              class="w-100"
              :class="{ 'p-invalid': errors.clause }"
              rows="5"
              placeholder="e.g., up{job='prometheus'} == 0"
              required
            />
            <small v-if="errors.clause" class="p-error">{{ errors.clause }}</small>
            <small class="form-text">Prometheus query expression</small>
          </div>

          <div class="mb-3">
            <label for="duration" class="form-label">Duration *</label>
            <InputText
              id="duration"
              v-model="form.duration"
              class="w-100"
              :class="{ 'p-invalid': errors.duration }"
              placeholder="e.g., 5m, 30s, 1h"
              required
            />
            <small v-if="errors.duration" class="p-error">{{ errors.duration }}</small>
            <small class="form-text">How long the condition must be true (e.g., 5m, 30s, 1h)</small>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <Textarea
              id="description"
              v-model="form.description"
              class="w-100"
              rows="3"
              placeholder="Optional description of what this rule does"
            />
          </div>

          <div class="mb-3">
            <label for="enabled" class="form-label d-flex align-items-center gap-2">
              <InputSwitch v-model="form.enabled" input-id="enabled" />
              <span>Enabled</span>
            </label>
            <small class="form-text">Whether this rule is active</small>
          </div>

          <div class="mb-3">
            <label class="form-label">Labels</label>
            <div class="key-value-section">
              <div
                v-for="(label, index) in form.labels"
                :key="'label-' + index"
                class="key-value-row"
              >
                <InputText
                  v-model="label.key"
                  placeholder="Key (e.g., severity)"
                  class="key-input"
                />
                <InputText
                  v-model="label.value"
                  placeholder="Value (e.g., warning)"
                  class="value-input"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  text
                  @click="removeLabel(index)"
                  aria-label="Remove label"
                />
              </div>
              <Button
                label="Add Label"
                icon="pi pi-plus"
                size="small"
                outlined
                @click="addLabel"
              />
            </div>
            <small class="form-text">Labels to attach to the alert (e.g., severity, team, service)</small>
          </div>

          <div class="mb-3">
            <label class="form-label">Annotations</label>
            <div class="key-value-section">
              <div
                v-for="(annotation, index) in form.annotations"
                :key="'annotation-' + index"
                class="key-value-row"
              >
                <InputText
                  v-model="annotation.key"
                  placeholder="Key (e.g., summary)"
                  class="key-input"
                />
                <Textarea
                  v-model="annotation.value"
                  placeholder="Value (can include URLs or long text)"
                  class="value-input"
                  rows="2"
                  auto-resize
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  text
                  @click="removeAnnotation(index)"
                  aria-label="Remove annotation"
                />
              </div>
              <Button
                label="Add Annotation"
                icon="pi pi-plus"
                size="small"
                outlined
                @click="addAnnotation"
              />
            </div>
            <small class="form-text">Annotations with additional information (e.g., summary, description, runbook URLs)</small>
          </div>

          <div class="form-actions">
            <Button
              type="submit"
              label="Save"
              icon="pi pi-check"
              :loading="loading"
              class="action-button"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              class="action-button"
              @click="handleCancel"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.rule-form {
  max-width: 900px;
  padding: 2rem;
}

.page-title {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
}

.form-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.form-card :deep(.p-card-body) {
  padding: 2rem;
}

.form-card :deep(.p-card-content) {
  padding: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-message-wrapper {
  margin-bottom: 0.5rem;
}

.w-100 {
  width: 100%;
}

.w-100 :deep(input),
.w-100 :deep(textarea) {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.form-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.p-error {
  color: #dc2626;
  font-size: 0.875rem;
}

.monospace {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.align-items-center {
  align-items: center;
}

/* Key-Value Section Styles */
.key-value-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.key-value-row {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.key-value-row:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.key-input {
  min-width: 150px;
}

.value-input {
  flex: 1;
}

.key-value-section:empty + small {
  margin-top: 0.5rem;
}

/* Empty state for key-value sections */
.key-value-section:has(.key-value-row:first-child) {
  background: #f9fafb;
}

.key-value-section:not(:has(.key-value-row)) {
  padding: 2rem;
  text-align: center;
  background: #fafafa;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

/* Ensure form action buttons have proper spacing */
.form-actions > .p-button {
  margin-right: 0.75rem;
}

.form-actions > .p-button:last-child {
  margin-right: 0;
}

.action-button {
  padding: 0.625rem 1.5rem;
  font-weight: 500;
}

.action-button :deep(.p-button-label) {
  padding: 0 0.5rem;
}

.action-button :deep(.p-button-icon) {
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .rule-form {
    padding: 1.5rem;
  }

  .form-card :deep(.p-card-body) {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-content {
    gap: 1.5rem;
  }

  .key-value-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .key-input {
    min-width: auto;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .rule-form {
    padding: 1rem;
  }

  .form-card :deep(.p-card-body) {
    padding: 1.25rem;
  }

  .page-title {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .form-content {
    gap: 1.25rem;
  }

  .form-actions {
    padding-top: 0.75rem;
  }
}
</style>

