<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useServicesStore } from '../stores';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import SearchBar from '../components/SearchBar.vue';
import { FilterMatchMode } from '@primevue/core/api';

const router = useRouter();
const servicesStore = useServicesStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const searchQuery = ref('');
const first = ref(0);

onMounted(async () => {
  await servicesStore.fetchServices();
});

const handleSearch = async () => {
  first.value = 0;
  servicesStore.setPage(1);
  await servicesStore.fetchServices({ name: searchQuery.value });
};

const viewService = (service) => {
  router.push(`/services/${service.id}`);
};

const createService = () => {
  router.push('/services/new');
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  servicesStore.setPage(newPage);
  await servicesStore.fetchServices();
};
</script>

<template>
  <div class="services-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Services</h1>
      <Button
        label="Register Service"
        icon="pi pi-plus"
        severity="success"
        @click="createService"
      />
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search services by name..."
          :loading="servicesStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="servicesStore.services"
          :loading="servicesStore.loading"
          :paginator="true"
          :rows="servicesStore.pagination.pageSize"
          :totalRecords="servicesStore.pagination.total"
          :lazy="true"
          @page="onPage"
          v-model:filters="filters"
          filterDisplay="row"
          :globalFilterFields="['name', 'description']"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable>
            <template #body="slotProps">
              <a
                href="#"
                @click.prevent="viewService(slotProps.data)"
                class="text-primary"
              >
                {{ slotProps.data.name }}
              </a>
            </template>
          </Column>
          <Column field="description" header="Description"></Column>
          <Column header="Actions" style="width: 150px">
            <template #body="slotProps">
              <div class="d-flex gap-2">
                <Button
                  icon="pi pi-eye"
                  size="small"
                  text
                  @click="viewService(slotProps.data)"
                  v-tooltip.top="'View Details'"
                />
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  severity="secondary"
                  text
                  @click="router.push(`/services/${slotProps.data.id}/edit`)"
                  v-tooltip.top="'Edit'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.services-list {
  max-width: 1400px;
  padding: 2rem;
}

.services-list .d-flex {
  margin-bottom: 1.5rem;
}

.services-list :deep(.p-card-body) {
  padding: 1.5rem;
}

.services-list :deep(.p-card-content) {
  padding: 0;
}

/* Add spacing between SearchBar and DataTable */
.services-list :deep(.p-card-content > *:not(:last-child)) {
  margin-bottom: 1.5rem;
}

/* Button spacing in actions column */
.services-list .d-flex.gap-2 {
  gap: 0.5rem !important;
  display: flex !important;
}

/* Ensure action buttons have proper spacing */
.services-list .d-flex.gap-2 > .p-button {
  margin-right: 0.5rem;
}

.services-list .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .services-list {
    padding: 1.5rem;
  }

  .services-list :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .services-list {
    padding: 1rem;
  }
}
</style>

