<script setup>
import { useServicesStore } from "../stores/services.js";

const servicesStore = useServicesStore();

import DataTable from "primevue/datatable";
import Column from "primevue/column";

const columns = [
  { field: "name", header: "Name" },
  { field: "owner", header: "Owner" },
  { field: "html", header: "URL" },
  { field: "description", header: "Description" },
];
</script>

<template>
  <div class="card">
    <DataTable
      :value="servicesStore.services"
      :loading="!servicesStore.initialized"
    >
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      ></Column>
    </DataTable>
  </div>
</template>
