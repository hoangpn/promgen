<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useShardsStore } from "../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Card from "primevue/card";
import SearchBar from "../components/SearchBar.vue";

const router = useRouter();
const shardsStore = useShardsStore();

const searchQuery = ref("");
const first = ref(0);

onMounted(async () => {
  await shardsStore.fetchShards();
});

const handleSearch = async () => {
  first.value = 0;
  shardsStore.setPage(1);
  await shardsStore.fetchShards({ name: searchQuery.value });
};

const viewShard = (shard) => {
  router.push(`/shards/${shard.id}`);
};

const onPage = async (event) => {
  const newPage = Math.floor(event.first / event.rows) + 1;
  shardsStore.setPage(newPage);
  await shardsStore.fetchShards();
};
</script>

<template>
  <div class="shards-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Shards</h1>
    </div>

    <Card>
      <template #content>
        <SearchBar
          v-model="searchQuery"
          placeholder="Search shards by name..."
          :loading="shardsStore.loading"
          @search="handleSearch"
        />

        <DataTable
          v-model:first="first"
          :value="shardsStore.shards"
          :loading="shardsStore.loading"
          :paginator="true"
          :rows="shardsStore.pagination.pageSize"
          :total-records="shardsStore.pagination.total"
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
                @click.prevent="viewShard(slotProps.data)"
              >
                {{ slotProps.data.name }}
              </a>
            </template>
          </Column>
          <Column field="url" header="URL"></Column>
          <Column field="proxy" header="Proxy"></Column>
          <Column header="Actions" style="width: 150px">
            <template #body="slotProps">
              <div class="d-flex gap-2">
                <Button
                  v-tooltip.top="'View Details'"
                  icon="pi pi-eye"
                  size="small"
                  text
                  @click="viewShard(slotProps.data)"
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
.shards-list {
  max-width: 1400px;
}
</style>
