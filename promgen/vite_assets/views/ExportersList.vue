<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useExportersStore } from "../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import SearchBar from "../components/SearchBar.vue";

const router = useRouter();
const exportersStore = useExportersStore();

const searchQuery = ref("");
const first = ref(0);

onMounted(async () => {
  await exportersStore.fetchExporters();
});

const handleSearch = async () => {
  first.value = 0;
  exportersStore.setPage(1);
  await exportersStore.fetchExporters({ job: searchQuery.value });
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  exportersStore.setPage(newPage);
  await exportersStore.fetchExporters();
};
</script>

<template>
  <div class="exporters-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Exporters</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search exporters by job name..."
          :loading="exportersStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="exportersStore.exporters"
          :loading="exportersStore.loading"
          :paginator="true"
          :rows="exportersStore.pagination.pageSize"
          :total-records="exportersStore.pagination.total"
          :lazy="true"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          @page="onPage"
        >
          <Column field="job" header="Job" sortable></Column>
          <Column field="port" header="Port"></Column>
          <Column field="path" header="Path"></Column>
          <Column field="project_name" header="Project"></Column>
          <Column header="Actions" style="width: 150px">
            <template #body="slotProps">
              <div class="d-flex gap-2">
                <Button
                  v-tooltip.top="'Delete'"
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  text
                  @click="exportersStore.deleteExporter(slotProps.data.id)"
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
.exporters-list {
  max-width: 1400px;
  padding: 2rem;
}

.exporters-list .d-flex {
  margin-bottom: 1.5rem;
}

.exporters-list :deep(.p-card-body) {
  padding: 1.5rem;
}

.exporters-list :deep(.p-card-content) {
  padding: 0;
}

/* Add spacing between SearchBar and DataTable */
.exporters-list :deep(.p-card-content > *:not(:last-child)) {
  margin-bottom: 1.5rem;
}

/* Button spacing in actions column */
.exporters-list .d-flex.gap-2 {
  gap: 0.5rem !important;
  display: flex !important;
}

/* Ensure action buttons have proper spacing */
.exporters-list .d-flex.gap-2 > .p-button {
  margin-right: 0.5rem;
}

.exporters-list .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .exporters-list {
    padding: 1.5rem;
  }

  .exporters-list :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .exporters-list {
    padding: 1rem;
  }
}
</style>
