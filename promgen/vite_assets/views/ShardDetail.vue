<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useShardsStore } from "../stores";
import Card from "primevue/card";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

const route = useRoute();
const router = useRouter();
const shardsStore = useShardsStore();

const shardId = ref(route.params.id);

onMounted(async () => {
  try {
    await shardsStore.fetchShard(shardId.value);
  } catch (error) {
    console.error("Error loading shard:", error);
  }
});

const goBack = () => {
  router.push("/shards");
};
</script>

<template>
  <div class="shard-detail">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Shard Detail</h1>
      <Button label="Back to Shards" icon="pi pi-arrow-left" @click="goBack" />
    </div>

    <ProgressSpinner v-if="shardsStore.loading" />

    <Card v-else-if="shardsStore.currentShard">
      <template #title>Shard Information</template>
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-6">
            <strong>Name:</strong> {{ shardsStore.currentShard.name }}
          </div>
          <div class="col-12">
            <strong>URL:</strong> {{ shardsStore.currentShard.url }}
          </div>
          <div class="col-12" v-if="shardsStore.currentShard.proxy">
            <strong>Proxy:</strong> {{ shardsStore.currentShard.proxy }}
          </div>
        </div>
      </template>
    </Card>

    <Card v-else-if="shardsStore.error">
      <template #content>
        <p class="text-danger">Error loading shard: {{ shardsStore.error }}</p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.shard-detail {
  max-width: 1200px;
}
</style>
