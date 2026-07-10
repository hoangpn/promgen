<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGroupsStore } from "../stores";
import Card from "primevue/card";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const route = useRoute();
const router = useRouter();
const groupsStore = useGroupsStore();

const groupId = ref(route.params.id);
const members = ref([]);
const resources = ref([]);

onMounted(async () => {
  try {
    await groupsStore.fetchGroup(groupId.value);
    // TODO: Fetch members and resources when API is ready
  } catch (error) {
    console.error("Error loading group:", error);
  }
});

const goBack = () => {
  router.push("/groups");
};
</script>

<template>
  <div class="group-detail">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Group Detail</h1>
      <Button label="Back to Groups" icon="pi pi-arrow-left" @click="goBack" />
    </div>

    <ProgressSpinner v-if="groupsStore.loading" />

    <div v-else-if="groupsStore.currentGroup">
      <Card class="mb-3">
        <template #title>Group Information</template>
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <strong>Name:</strong> {{ groupsStore.currentGroup.name }}
            </div>
            <div class="col-12">
              <strong>Description:</strong>
              {{ groupsStore.currentGroup.description || "N/A" }}
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="members.length" class="mb-3">
        <template #title>Members</template>
        <template #content>
          <DataTable :value="members" striped-rows show-gridlines>
            <Column field="username" header="Username"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="role" header="Role"></Column>
          </DataTable>
        </template>
      </Card>

      <Card v-if="resources.length">
        <template #title>Resources</template>
        <template #content>
          <DataTable :value="resources" striped-rows show-gridlines>
            <Column field="type" header="Type"></Column>
            <Column field="name" header="Name"></Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <Card v-else-if="groupsStore.error">
      <template #content>
        <p class="text-danger">Error loading group: {{ groupsStore.error }}</p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.group-detail {
  max-width: 1200px;
}
</style>
