<script setup>
import { useDemoStore } from "../stores/demo.js";
import DataView from "primevue/dataview";
import Message from "primevue/message";
import Select from "primevue/select";

const demoStore = useDemoStore();

import ServicesList from "../components/ServicesList.vue";
</script>

<template>
  <div class="layout-content">
    <div class="layout-card">
      <Select
        v-model="$i18n.locale"
        :options="$i18n.availableLocales"
        placeholder="Select a language"
      />
    </div>

    <div class="layout-card">
      <Message>{{ $t("msg") }}</Message>
    </div>

    <div class="layout-card">
      <DataView :value="demoStore.fruits">
        <template #list="slotProps">
          <div v-for="(item, index) in slotProps.items" :key="index">
            {{ $t(item) }}
          </div>
        </template>
      </DataView>
    </div>

    <ServicesList></ServicesList>
  </div>
</template>
