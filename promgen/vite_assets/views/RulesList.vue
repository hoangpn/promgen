<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRulesStore } from '../stores';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import SearchBar from '../components/SearchBar.vue';

const router = useRouter();
const rulesStore = useRulesStore();

const searchQuery = ref('');
const first = ref(0);

onMounted(async () => {
  await rulesStore.fetchRules();
});

const handleSearch = async () => {
  first.value = 0;
  rulesStore.setPage(1);
  await rulesStore.fetchRules({ name: searchQuery.value });
};

const viewRule = (rule) => {
  router.push(`/rules/${rule.id}`);
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  rulesStore.setPage(newPage);
  await rulesStore.fetchRules();
};
</script>

<template>
  <div class="rules-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Rules</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search rules by name..."
          :loading="rulesStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="rulesStore.rules"
          :loading="rulesStore.loading"
          :paginator="true"
          :rows="rulesStore.pagination.pageSize"
          :totalRecords="rulesStore.pagination.total"
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
                @click.prevent="viewRule(slotProps.data)"
                class="text-primary"
              >
                {{ slotProps.data.name }}
              </a>
            </template>
          </Column>
          <Column field="enabled" header="Enabled" style="width: 120px">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.enabled ? 'Enabled' : 'Disabled'"
                :severity="slotProps.data.enabled ? 'success' : 'danger'"
              />
            </template>
          </Column>
          <Column field="duration" header="Duration"></Column>
          <Column header="Actions" style="width: 150px">
            <template #body="slotProps">
              <div class="d-flex gap-2">
                <Button
                  icon="pi pi-eye"
                  size="small"
                  text
                  @click="viewRule(slotProps.data)"
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
.rules-list {
  max-width: 1400px;
  padding: 2rem;
}

.rules-list .d-flex {
  margin-bottom: 1.5rem;
}

.rules-list :deep(.p-card-body) {
  padding: 1.5rem;
}

.rules-list :deep(.p-card-content) {
  padding: 0;
}

/* Add spacing between SearchBar and DataTable */
.rules-list :deep(.p-card-content > *:not(:last-child)) {
  margin-bottom: 1.5rem;
}

/* Button spacing in actions column */
.rules-list .d-flex.gap-2 {
  gap: 0.5rem !important;
  display: flex !important;
}

/* Ensure action buttons have proper spacing */
.rules-list .d-flex.gap-2 > .p-button {
  margin-right: 0.5rem;
}

.rules-list .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .rules-list {
    padding: 1.5rem;
  }

  .rules-list :deep(.p-card-body) {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .rules-list {
    padding: 1rem;
  }
}
</style>

