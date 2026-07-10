<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '../stores';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import SearchBar from '../components/SearchBar.vue';

const router = useRouter();
const projectsStore = useProjectsStore();

const searchQuery = ref('');
const first = ref(0);

onMounted(async () => {
  await projectsStore.fetchProjects();
});

const handleSearch = async () => {
  first.value = 0;
  projectsStore.setPage(1);
  await projectsStore.fetchProjects({ name: searchQuery.value });
};

const viewProject = (project) => {
  router.push(`/projects/${project.id}`);
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  projectsStore.setPage(newPage);
  await projectsStore.fetchProjects();
};
</script>

<template>
  <div class="projects-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Projects</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search projects by name..."
          :loading="projectsStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="projectsStore.projects"
          :loading="projectsStore.loading"
          :paginator="true"
          :rows="projectsStore.pagination.pageSize"
          :totalRecords="projectsStore.pagination.total"
          :lazy="true"
          @page="onPage"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable>
            <template #body="slotProps">
              <a
                href="#"
                @click.prevent="viewProject(slotProps.data)"
                class="text-primary"
              >
                {{ slotProps.data.name }}
              </a>
            </template>
          </Column>
          <Column field="service_name" header="Service"></Column>
          <Column field="shard_name" header="Shard"></Column>
          <Column field="description" header="Description"></Column>
          <Column header="Actions" style="width: 150px">
            <template #body="slotProps">
              <div class="d-flex gap-2">
                <Button
                  icon="pi pi-eye"
                  size="small"
                  text
                  @click="viewProject(slotProps.data)"
                  v-tooltip.top="'View Details'"
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
.projects-list {
  max-width: 1400px;
  padding: 2rem;
}

.projects-list .d-flex {
  margin-bottom: 1.5rem;
}

.projects-list :deep(.p-card-body) {
  padding: 1.5rem;
}

.projects-list :deep(.p-card-content) {
  padding: 0;
}

/* Add spacing between SearchBar and DataTable */
.projects-list :deep(.p-card-content > *:not(:last-child)) {
  margin-bottom: 1.5rem;
}

/* Button spacing in actions column */
.projects-list .d-flex.gap-2 {
  gap: 0.5rem !important;
  display: flex !important;
}

/* Ensure action buttons have proper spacing */
.projects-list .d-flex.gap-2 > .p-button {
  margin-right: 0.5rem;
}

.projects-list .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .projects-list {
    padding: 1.5rem;
  }

  .projects-list :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .projects-list {
    padding: 1rem;
  }
}
</style>

