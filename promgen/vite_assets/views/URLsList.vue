<script setup>
import { onMounted, ref } from "vue";
import { useUrlsStore } from "../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import SearchBar from "../components/SearchBar.vue";

const urlsStore = useUrlsStore();

const searchQuery = ref("");
const first = ref(0);

onMounted(async () => {
  await urlsStore.fetchUrls();
});

const handleSearch = async () => {
  first.value = 0;
  urlsStore.setPage(1);
  await urlsStore.fetchUrls({ url: searchQuery.value });
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  urlsStore.setPage(newPage);
  await urlsStore.fetchUrls();
};

const handleDelete = async (id) => {
  if (confirm("Are you sure you want to delete this URL?")) {
    await urlsStore.deleteUrl(id);
    await urlsStore.fetchUrls();
  }
};
</script>

<template>
  <div class="urls-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>URLs</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search URLs..."
          :loading="urlsStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="urlsStore.urls"
          :loading="urlsStore.loading"
          :paginator="true"
          :rows="urlsStore.pagination.pageSize"
          :total-records="urlsStore.pagination.total"
          :lazy="true"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          @page="onPage"
        >
          <Column field="url" header="URL" sortable></Column>
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
                  @click="handleDelete(slotProps.data.id)"
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
.urls-list {
  max-width: 1400px;
}
</style>
