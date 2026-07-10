<script setup>
import { onMounted, ref } from "vue";
import { useLogsStore } from "../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Tag from "primevue/tag";

const logsStore = useLogsStore();

const searchQuery = ref("");
const first = ref(0);

onMounted(async () => {
  await logsStore.fetchLogs();
});

const handleSearch = async () => {
  first.value = 0;
  logsStore.setPage(1);
  await logsStore.fetchLogs({ search: searchQuery.value });
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  logsStore.setPage(newPage);
  await logsStore.fetchLogs();
};

const getActionSeverity = (action) => {
  const actionLower = action?.toLowerCase() || "";
  if (actionLower.includes("create")) return "success";
  if (actionLower.includes("update")) return "info";
  if (actionLower.includes("delete")) return "danger";
  return "secondary";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<template>
  <div class="audit-logs">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Audit Logs</h1>
    </div>

    <Card>
      <template #content>
        <div class="mb-3">
          <div class="p-inputgroup">
            <InputText
              v-model="searchQuery"
              placeholder="Search logs..."
              @keyup.enter="handleSearch"
            />
            <Button icon="pi pi-search" @click="handleSearch" />
          </div>
        </div>

        <DataTable
          v-model:first="first"
          :value="logsStore.logs"
          :loading="logsStore.loading"
          :paginator="true"
          :rows="logsStore.pagination.pageSize"
          :total-records="logsStore.pagination.total"
          :lazy="true"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          @page="onPage"
        >
          <Column field="timestamp" header="Timestamp" sortable>
            <template #body="slotProps">
              {{ formatDate(slotProps.data.timestamp) }}
            </template>
          </Column>
          <Column field="user" header="User"></Column>
          <Column field="action" header="Action">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.action"
                :severity="getActionSeverity(slotProps.data.action)"
              />
            </template>
          </Column>
          <Column field="object_type" header="Object Type"></Column>
          <Column field="message" header="Message"></Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.audit-logs {
  max-width: 1400px;
}
</style>
