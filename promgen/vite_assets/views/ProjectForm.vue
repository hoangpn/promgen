<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectsStore, useShardsStore } from "../stores";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Message from "primevue/message";

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const shardsStore = useShardsStore();

const isEdit = computed(() => route.name === "project-edit");
const projectId = computed(() => route.params.id);

const form = ref({
  name: "",
  description: "",
  shard: null,
});

const loading = ref(false);
const errors = ref({});
const shards = ref([]);

onMounted(async () => {
  // Load shards
  await loadShards();

  if (isEdit.value) {
    await loadProject();
  }
});


const loadShards = async () => {
  try {
    const response = await shardsStore.fetchShards({ page_size: 1000 });
    shards.value = (response.results || response).map((s) => ({
      label: s.name,
      value: s.id,
    }));
  } catch (error) {
    console.error("Error loading shards:", error);
  }
};

const loadProject = async () => {
  try {
    const project = await projectsStore.fetchProject(projectId.value);
    form.value = {
      name: project.name || "",
      description: project.description || "",
      shard: project.shard?.id || null,
    };
  } catch (error) {
    console.error("Error loading project:", error);
    errors.value = { general: "Failed to load project" };
  }
};

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};

  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      shard: form.value.shard,
    };

    if (isEdit.value) {
      await projectsStore.updateProject(projectId.value, payload);
      router.push(`/projects/${projectId.value}`);
    } else {
      // For creation, service_id must come from query parameter
      const serviceId = route.query.service_id;
      if (!serviceId) {
        errors.value = { general: "Service ID is required. Please register project from a service page." };
        return;
      }
      const newProject = await projectsStore.createProject(
        serviceId,
        payload,
      );
      router.push(`/projects/${newProject.id}`);
    }
  } catch (error) {
    console.error("Error saving project:", error);
    errors.value = error.response?.data || { general: error.message };
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.back();
};
</script>

<template>
  <div class="project-form">
    <h1>{{ isEdit ? "Edit Project" : "Register Project" }}</h1>

    <Card>
      <template #content>
        <form @submit.prevent="handleSubmit">

          <div class="mb-3">
            <label for="name" class="form-label">Name *</label>
            <InputText
              id="name"
              v-model="form.name"
              class="w-100"
              :class="{ 'p-invalid': errors.name }"
              placeholder="Enter project name"
              required
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <Textarea
              id="description"
              v-model="form.description"
              class="w-100"
              rows="3"
              placeholder="Enter project description"
            />
            <small v-if="errors.description" class="p-error">{{
              errors.description
            }}</small>
          </div>

          <div class="mb-3">
            <label for="shard" class="form-label">Shard *</label>
            <Dropdown
              id="shard"
              v-model="form.shard"
              :options="shards"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a shard"
              class="w-100"
              :class="{ 'p-invalid': errors.shard }"
              :loading="shardsStore.loading"
              required
            />
            <small v-if="errors.shard" class="p-error">{{ errors.shard }}</small>
          </div>

          <Message
            v-if="errors.general"
            severity="error"
            :closable="false"
            class="mb-3"
          >
            {{ errors.general }}
          </Message>

          <div class="d-flex gap-2">
            <Button
              type="submit"
              label="Save"
              icon="pi pi-check"
              :loading="loading"
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              @click="handleCancel"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.project-form {
  max-width: 800px;
  padding: 2rem;
  margin: 0 auto;
}

.project-form h1 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
}

.project-form :deep(.p-card) {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.project-form :deep(.p-card-body) {
  padding: 2rem;
}

.project-form :deep(.p-card-content) {
  padding: 0;
}

.project-form form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.project-form .mb-3 {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.w-100 {
  width: 100%;
}

.w-100 :deep(input),
.w-100 :deep(textarea),
.w-100 :deep(.p-dropdown) {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.p-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.375rem;
  display: block;
}

.project-form :deep(.p-message) {
  margin-bottom: 1rem;
}

.project-form .d-flex.gap-2 {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

/* Ensure form action buttons have proper spacing */
.project-form .d-flex.gap-2 > .p-button {
  margin-right: 0.75rem;
}

.project-form .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

.project-form .d-flex.gap-2 .p-button {
  padding: 0.625rem 1.5rem;
  font-weight: 500;
}

.project-form .d-flex.gap-2 .p-button :deep(.p-button-label) {
  padding: 0 0.5rem;
}

.project-form .d-flex.gap-2 .p-button :deep(.p-button-icon) {
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .project-form {
    padding: 1.5rem;
  }

  .project-form :deep(.p-card-body) {
    padding: 1.5rem;
  }

  .project-form h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .project-form form {
    gap: 1.5rem;
  }

  .project-form .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.75rem;
  }

  .project-form .d-flex.gap-2 .p-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .project-form {
    padding: 1rem;
  }

  .project-form :deep(.p-card-body) {
    padding: 1.25rem;
  }

  .project-form h1 {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .project-form form {
    gap: 1.25rem;
  }

  .project-form .d-flex.gap-2 {
    padding-top: 0.75rem;
  }
}
</style>

