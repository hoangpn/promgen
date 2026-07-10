<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useGroupsStore } from "../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import SearchBar from "../components/SearchBar.vue";

const router = useRouter();
const groupsStore = useGroupsStore();

const searchQuery = ref("");
const first = ref(0);

onMounted(async () => {
  await groupsStore.fetchGroups();
});

const handleSearch = async () => {
  first.value = 0;
  groupsStore.setPage(1);
  await groupsStore.fetchGroups({ name: searchQuery.value });
};

const viewGroup = (group) => {
  router.push(`/groups/${group.id}`);
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  groupsStore.setPage(newPage);
  await groupsStore.fetchGroups();
};
</script>

<template>
  <div class="groups-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Groups</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search groups by name..."
          :loading="groupsStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="groupsStore.groups"
          :loading="groupsStore.loading"
          :paginator="true"
          :rows="groupsStore.pagination.pageSize"
          :total-records="groupsStore.pagination.total"
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
                @click.prevent="viewGroup(slotProps.data)"
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
                  v-tooltip.top="'View Details'"
                  icon="pi pi-eye"
                  size="small"
                  text
                  @click="viewGroup(slotProps.data)"
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
.groups-list {
  max-width: 1400px;
  padding: 2rem;
}

.groups-list .d-flex {
  margin-bottom: 1.5rem;
}

.groups-list :deep(.p-card-body) {
  padding: 1.5rem;
}

.groups-list :deep(.p-card-content) {
  padding: 0;
}

/* Add spacing between SearchBar and DataTable */
.groups-list :deep(.p-card-content > *:not(:last-child)) {
  margin-bottom: 1.5rem;
}

/* Button spacing in actions column */
.groups-list .d-flex.gap-2 {
  gap: 0.5rem !important;
  display: flex !important;
}

/* Ensure action buttons have proper spacing */
.groups-list .d-flex.gap-2 > .p-button {
  margin-right: 0.5rem;
}

.groups-list .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .groups-list {
    padding: 1.5rem;
  }

  .groups-list :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .groups-list {
    padding: 1rem;
  }
}
</style>
