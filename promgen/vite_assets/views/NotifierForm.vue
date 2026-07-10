<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotifiersStore, useServicesStore, useProjectsStore } from "../stores";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Checkbox from "primevue/checkbox";
import Message from "primevue/message";

const route = useRoute();
const router = useRouter();
const notifiersStore = useNotifiersStore();
const servicesStore = useServicesStore();
const projectsStore = useProjectsStore();

// Form state
const formData = ref({
  sender: "",
  value: "",
  alias: "",
  enabled: true,
  filters: [],
});

const availableTypes = ref([]);
const loading = ref(false);
const error = ref(null);
const contextType = ref("");
const contextId = ref(null);
const contextName = ref("");

// Check if this is edit mode
const isEditMode = computed(() => !!route.params.id);

// Get context from query params
const getContext = () => {
  const queryContextType = route.query.context_type;
  const queryContextId = route.query.context_id;

  if (queryContextType && queryContextId) {
    contextType.value = queryContextType;
    contextId.value = queryContextId;
  } else if (route.query.service_id) {
    contextType.value = "service";
    contextId.value = route.query.service_id;
  } else if (route.query.project_id) {
    contextType.value = "project";
    contextId.value = route.query.project_id;
  } else {
    contextType.value = "user";
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    // Hardcoded available notifier types
    availableTypes.value = [
      { label: "Alertmanager", value: "promgen.notification.alertmanager" },
      { label: "Email", value: "promgen.notification.email" },
      { label: "LINE Notify", value: "promgen.notification.linenotify" },
      { label: "PagerDuty", value: "promgen.notification.pagerduty" },
      { label: "Slack", value: "promgen.notification.slack" },
      { label: "User", value: "promgen.notification.user" },
      { label: "Webhook", value: "promgen.notification.webhook" },
    ];

    if (isEditMode.value) {
      // Load existing notifier
      const notifier = await notifiersStore.fetchNotifier(route.params.id);
      formData.value = {
        sender: notifier.sender,
        value: notifier.value || "",
        alias: notifier.alias || "",
        enabled: notifier.enabled,
        filters: notifier.filters || [],
      };
      contextType.value = notifier.content_type;
      contextId.value = notifier.object_id;
      contextName.value = notifier.content_name || "";
    } else {
      // Get context for new notifier
      getContext();

      // Load context name
      if (contextType.value === "service" && contextId.value) {
        const service = await servicesStore.fetchService(contextId.value);
        contextName.value = service.name;
      } else if (contextType.value === "project" && contextId.value) {
        const project = await projectsStore.fetchProject(contextId.value);
        contextName.value = project.name;
      } else if (contextType.value === "user") {
        contextName.value = "Your Profile";
      }
    }
  } catch (err) {
    error.value = err.response?.data?.detail || err.message;
    console.error("Error loading notifier form:", err);
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (isEditMode.value) {
      // Update existing notifier
      await notifiersStore.updateNotifier(route.params.id, {
        enabled: formData.value.enabled,
      });
    } else {
      // Create new notifier
      await notifiersStore.createNotifier(
        contextType.value,
        contextId.value,
        formData.value
      );
    }

    // Navigate back to the appropriate detail page
    if (contextType.value === "service") {
      router.push(`/services/${contextId.value}`);
    } else if (contextType.value === "project") {
      router.push(`/projects/${contextId.value}`);
    } else if (contextType.value === "user") {
      router.push("/profile");
    }
  } catch (err) {
    error.value = err.response?.data?.detail || err.message;
    console.error("Error saving notifier:", err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  if (contextType.value === "service") {
    router.push(`/services/${contextId.value}`);
  } else if (contextType.value === "project") {
    router.push(`/projects/${contextId.value}`);
  } else if (contextType.value === "user") {
    router.push("/profile");
  } else {
    router.push("/");
  }
};

const addFilter = () => {
  formData.value.filters.push({ name: "", value: "" });
};

const removeFilter = (index) => {
  formData.value.filters.splice(index, 1);
};
</script>

<template>
  <div class="notifier-form">
    <Card>
      <template #title>
        <h2>{{ isEditMode ? 'Edit Notifier' : 'Register Notifier' }}</h2>
        <p class="text-muted" v-if="contextName">
          Context: {{ contextType }} - {{ contextName }}
        </p>
      </template>

      <template #content>
        <Message v-if="error" severity="error" :closable="true" @close="error = null">
          {{ error }}
        </Message>

        <form @submit.prevent="handleSubmit" class="notifier-form-content">
          <!-- Notifier Type -->
          <div class="form-group mb-4">
            <label for="sender" class="form-label required">Notifier Type</label>
            <Select
              v-model="formData.sender"
              :options="availableTypes"
              option-label="label"
              option-value="value"
              placeholder="Select notifier type"
              :disabled="isEditMode || loading"
              class="w-100"
              input-id="sender"
            />
          </div>

          <!-- Value -->
          <div class="form-group mb-4">
            <label for="value" class="form-label required">Value</label>
            <InputText
              id="value"
              v-model="formData.value"
              placeholder="Enter notifier value (e.g., webhook URL, email, etc.)"
              :disabled="isEditMode || loading"
              class="w-100"
            />
            <small class="form-text text-muted">
              The target for this notifier (e.g., webhook URL, email address, Slack channel)
            </small>
          </div>

          <!-- Alias -->
          <div class="form-group mb-4">
            <label for="alias" class="form-label">Alias (Optional)</label>
            <InputText
              id="alias"
              v-model="formData.alias"
              placeholder="Enter an alias to hide the actual value"
              :disabled="isEditMode || loading"
              class="w-100"
            />
            <small class="form-text text-muted">
              Use an alias to hide sensitive information in the UI
            </small>
          </div>

          <!-- Enabled -->
          <div class="form-group mb-4">
            <div class="flex align-items-center">
              <Checkbox
                v-model="formData.enabled"
                :binary="true"
                input-id="enabled"
                :disabled="loading"
              />
              <label for="enabled" class="ml-2">Enabled</label>
            </div>
          </div>

          <!-- Filters (only for new notifiers) -->
          <div v-if="!isEditMode" class="form-group mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label mb-0">Filters (Optional)</label>
              <Button
                type="button"
                label="Add Filter"
                icon="pi pi-plus"
                severity="info"
                size="small"
                @click="addFilter"
                :disabled="loading"
              />
            </div>

            <div
              v-for="(filter, index) in formData.filters"
              :key="index"
              class="filter-row mb-2"
            >
              <div class="d-flex gap-2 align-items-center">
                <InputText
                  v-model="filter.name"
                  placeholder="Name"
                  :disabled="loading"
                  class="flex-1"
                />
                <InputText
                  v-model="filter.value"
                  placeholder="Value"
                  :disabled="loading"
                  class="flex-1"
                />
                <Button
                  type="button"
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  @click="removeFilter(index)"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex gap-2 justify-content-end">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              @click="handleCancel"
              :disabled="loading"
            />
            <Button
              type="submit"
              :label="isEditMode ? 'Update' : 'Register'"
              severity="primary"
              :loading="loading"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.notifier-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.notifier-form-content {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-label.required::after {
  content: " *";
  color: #ef4444;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.filter-row {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
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

.justify-content-between {
  justify-content: space-between;
}

.justify-content-end {
  justify-content: flex-end;
}

.flex-1 {
  flex: 1;
}

.w-100 {
  width: 100%;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-muted {
  color: #6c757d;
}

@media (max-width: 768px) {
  .notifier-form {
    padding: 0 0.5rem;
  }

  .filter-row .d-flex {
    flex-direction: column;
  }

  .filter-row .flex-1 {
    width: 100%;
  }
}
</style>

