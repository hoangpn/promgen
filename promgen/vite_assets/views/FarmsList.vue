<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useFarmsStore } from "../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import SearchBar from "../components/SearchBar.vue";

const router = useRouter();
const farmsStore = useFarmsStore();

const searchQuery = ref("");
const first = ref(0);

onMounted(async () => {
  await farmsStore.fetchFarms();
});

const handleSearch = async () => {
  first.value = 0;
  farmsStore.setPage(1);
  await farmsStore.fetchFarms({ name: searchQuery.value });
};

const viewFarm = (farm) => {
  router.push(`/farms/${farm.id}`);
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  farmsStore.setPage(newPage);
  await farmsStore.fetchFarms();
};
</script>

<template>
  <div class="farms-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Farms</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search farms by name..."
          :loading="farmsStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="farmsStore.farms"
          :loading="farmsStore.loading"
          :paginator="true"
          :rows="farmsStore.pagination.pageSize"
          :total-records="farmsStore.pagination.total"
          :lazy="true"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          @page="onPage"
        >
          <Column field="name" header="Name" sortable>
            <template #body="slotProps">
              <a
                href="#"
                class="text-primary"
                @click.prevent="viewFarm(slotProps.data)"
              >
                {{ slotProps.data.name }}
              </a>
            </template>
          </Column>
          <Column field="source" header="Source"></Column>
          <Column field="url" header="URL"></Column>
          <Column header="Actions" style="width: 150px">
            <template #body="slotProps">
              <div class="d-flex gap-2">
                <Button
                  v-tooltip.top="'View Details'"
                  icon="pi pi-eye"
                  size="small"
                  text
                  @click="viewFarm(slotProps.data)"
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
.farms-list {
  max-width: 1400px;
  padding: 2rem;
}

.farms-list .d-flex {
  margin-bottom: 1.5rem;
}

.farms-list :deep(.p-card-body) {
  padding: 1.5rem;
}

.farms-list :deep(.p-card-content) {
  padding: 0;
}

/* Add spacing between SearchBar and DataTable */
.farms-list :deep(.p-card-content > *:not(:last-child)) {
  margin-bottom: 1.5rem;
}

/* Button spacing in actions column */
.farms-list .d-flex.gap-2 {
  gap: 0.5rem !important;
  display: flex !important;
}

/* Ensure action buttons have proper spacing */
.farms-list .d-flex.gap-2 > .p-button {
  margin-right: 0.5rem;
}

.farms-list .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .farms-list {
    padding: 1.5rem;
  }

  .farms-list :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .farms-list {
    padding: 1rem;
  }
}
</style>
