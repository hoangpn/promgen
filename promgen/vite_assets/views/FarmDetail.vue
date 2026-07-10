<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFarmsStore } from "../stores";
import Card from "primevue/card";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const route = useRoute();
const router = useRouter();
const farmsStore = useFarmsStore();

const farmId = ref(route.params.id);

onMounted(async () => {
  try {
    await farmsStore.fetchFarm(farmId.value);
  } catch (error) {
    console.error("Error loading farm:", error);
  }
});

const goBack = () => {
  router.push("/farms");
};
</script>

<template>
  <div class="farm-detail">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Farm Detail</h1>
      <Button label="Back to Farms" icon="pi pi-arrow-left" @click="goBack" />
    </div>

    <ProgressSpinner v-if="farmsStore.loading" />

    <div v-else-if="farmsStore.currentFarm">
      <Card class="mb-3">
        <template #title>Farm Information</template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <strong>Name:</strong> {{ farmsStore.currentFarm.name }}
            </div>
            <div class="col-12 md:col-6">
              <strong>Source:</strong> {{ farmsStore.currentFarm.source }}
            </div>
            <div class="col-12 md:col-6">
              <strong>URL:</strong> {{ farmsStore.currentFarm.url }}
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="farmsStore.currentFarm.hosts?.length">
        <template #title>Hosts</template>
        <template #content>
          <DataTable
            :value="farmsStore.currentFarm.hosts"
            striped-rows
            show-gridlines
          >
            <Column field="name" header="Name"></Column>
            <Column field="port" header="Port"></Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <Card v-else-if="farmsStore.error">
      <template #content>
        <p class="text-danger">Error loading farm: {{ farmsStore.error }}</p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.farm-detail {
  max-width: 1200px;
  padding: 2rem;
}

.farm-detail .d-flex {
  margin-bottom: 1.5rem;
}

.farm-detail .d-flex.gap-2 {
  gap: 0.75rem;
}

.farm-detail :deep(.p-card) {
  margin-bottom: 1.5rem;
}

.farm-detail :deep(.p-card-body) {
  padding: 1.5rem;
}

.farm-detail :deep(.p-card-content) {
  padding: 0;
}

.farm-detail .grid > div {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.farm-detail .grid > div:last-child {
  border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .farm-detail {
    padding: 1.5rem;
  }

  .farm-detail :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .farm-detail {
    padding: 1rem;
  }
}
</style>
