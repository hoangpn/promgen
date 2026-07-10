<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useServicesStore } from "../stores";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const route = useRoute();
const router = useRouter();
const servicesStore = useServicesStore();

const isEdit = computed(() => route.name === "service-edit");
const serviceId = computed(() => route.params.id);

const form = ref({
  name: "",
  description: "",
});

const loading = ref(false);
const errors = ref({});

onMounted(async () => {
  if (isEdit.value) {
    await loadService();
  }
});

const loadService = async () => {
  try {
    const service = await servicesStore.fetchService(serviceId.value);
    form.value = {
      name: service.name || "",
      description: service.description || "",
    };
  } catch (error) {
    console.error("Error loading service:", error);
  }
};

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};

  try {
    if (isEdit.value) {
      await servicesStore.updateService(serviceId.value, form.value);
      router.push(`/services/${serviceId.value}`);
    } else {
      const newService = await servicesStore.createService(form.value);
      router.push(`/services/${newService.id}`);
    }
  } catch (error) {
    console.error("Error saving service:", error);
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
  <div class="service-form">
    <h1 class="page-title">
      {{ isEdit ? "Edit Service" : "Register Service" }}
    </h1>

    <Card class="form-card">
      <template #content>
        <form class="form-content" @submit.prevent="handleSubmit">
          <div class="form-field">
            <label for="name" class="form-label">Name *</label>
            <InputText
              id="name"
              v-model="form.name"
              class="w-100"
              :class="{ 'p-invalid': errors.name }"
              required
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="form-field">
            <label for="description" class="form-label">Description</label>
            <Textarea
              id="description"
              v-model="form.description"
              class="w-100"
              rows="3"
            />
          </div>

          <div v-if="errors.general" class="error-alert">
            {{ errors.general }}
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
.service-form {
  max-width: 800px;
  padding: 2rem;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 2rem;
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
  gap: 1.75rem;
}

.form-field {
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
.w-100 :deep(textarea) {
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

.error-alert {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  margin-top: 0.5rem;
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
  .service-form {
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

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .service-form {
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
