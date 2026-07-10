<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useServicesStore, useProjectsStore, useRulesStore } from "../stores";

const route = useRoute();
const router = useRouter();

const servicesStore = useServicesStore();
const projectsStore = useProjectsStore();
const rulesStore = useRulesStore();

const searchQuery = ref(route.query.q || "");
const loading = ref(false);

const searchResults = ref({
  services: [],
  projects: [],
  rules: [],
});

onMounted(() => {
  if (searchQuery.value) {
    handleSearch();
  }
});

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;

  loading.value = true;
  router.push({ query: { q: searchQuery.value } });

  try {
    const [servicesRes, projectsRes, rulesRes] = await Promise.all([
      servicesStore.fetchServices({ name: searchQuery.value }),
      projectsStore.fetchProjects({ name: searchQuery.value }),
      rulesStore.fetchRules({ name: searchQuery.value }),
    ]);

    searchResults.value = {
      services: servicesRes.results || servicesRes,
      projects: projectsRes.results || projectsRes,
      rules: rulesRes.results || rulesRes,
    };
  } catch (error) {
    console.error("Error searching:", error);
  } finally {
    loading.value = false;
  }
};

const viewService = (service) => {
  router.push(`/services/${service.id}`);
};

const viewProject = (project) => {
  router.push(`/projects/${project.id}`);
};

const viewRule = (rule) => {
  router.push(`/rules/${rule.id}`);
};
</script>

<template>
  <div class="search-page">
    <h1>Search</h1>

    <Card class="mb-4">
      <template #content>
        <div class="p-inputgroup">
          <InputText
            v-model="searchQuery"
            placeholder="Search services, projects, rules..."
            @keyup.enter="handleSearch"
          />
          <Button
            icon="pi pi-search"
            label="Search"
            :loading="loading"
            @click="handleSearch"
          />
        </div>
      </template>
    </Card>

    <Card v-if="searchQuery && !loading">
      <template #title> Search Results for "{{ searchQuery }}" </template>
      <template #content>
        <Tabs value="0">
          <TabList>
            <Tab value="0">Services ({{ searchResults.services.length }})</Tab>
            <Tab value="1">Projects ({{ searchResults.projects.length }})</Tab>
            <Tab value="2">Rules ({{ searchResults.rules.length }})</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <DataTable
                v-if="searchResults.services.length"
                :value="searchResults.services"
                striped-rows
                show-gridlines
              >
                <Column field="name" header="Name">
                  <template #body="slotProps">
                    <a
                      href="#"
                      class="text-primary"
                      @click.prevent="viewService(slotProps.data)"
                    >
                      {{ slotProps.data.name }}
                    </a>
                  </template>
                </Column>
                <Column field="description" header="Description"></Column>
              </DataTable>
              <p v-else>No services found</p>
            </TabPanel>

            <TabPanel value="1">
              <DataTable
                v-if="searchResults.projects.length"
                :value="searchResults.projects"
                striped-rows
                show-gridlines
              >
                <Column field="name" header="Name">
                  <template #body="slotProps">
                    <a
                      href="#"
                      class="text-primary"
                      @click.prevent="viewProject(slotProps.data)"
                    >
                      {{ slotProps.data.name }}
                    </a>
                  </template>
                </Column>
                <Column field="service_name" header="Service"></Column>
              </DataTable>
              <p v-else>No projects found</p>
            </TabPanel>

            <TabPanel value="2">
              <DataTable
                v-if="searchResults.rules.length"
                :value="searchResults.rules"
                striped-rows
                show-gridlines
              >
                <Column field="name" header="Name">
                  <template #body="slotProps">
                    <a
                      href="#"
                      class="text-primary"
                      @click.prevent="viewRule(slotProps.data)"
                    >
                      {{ slotProps.data.name }}
                    </a>
                  </template>
                </Column>
                <Column field="duration" header="Duration"></Column>
              </DataTable>
              <p v-else>No rules found</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.search-page {
  max-width: 1400px;
}
</style>
