<script setup>
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectsStore, useRulesStore, useExportersStore, useUrlsStore, useFarmsStore, useNotifiersStore } from "../stores";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Card from "primevue/card";
import Button from "primevue/button";
import Message from "primevue/message";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const rulesStore = useRulesStore();
const exportersStore = useExportersStore();
const urlsStore = useUrlsStore();
const farmsStore = useFarmsStore();
const notifiersStore = useNotifiersStore();

const projectId = computed(() => route.params.id);

// Data for each tab
const exporters = ref([]);
const hosts = ref([]);
const rules = ref([]);
const urls = ref([]);
const notifiers = ref([]);
const members = ref([]);

// Loading states
const loadingExporters = ref(false);
const loadingHosts = ref(false);
const loadingRules = ref(false);
const loadingUrls = ref(false);
const loadingNotifiers = ref(false);
const loadingMembers = ref(false);

// Counts for tab labels
const exportersCount = ref(0);
const hostsCount = ref(0);
const rulesCount = ref(0);
const urlsCount = ref(0);
const notifiersCount = ref(0);
const membersCount = ref(0);

// Track if full data has been loaded
const exportersLoaded = ref(false);
const hostsLoaded = ref(false);
const rulesLoaded = ref(false);
const urlsLoaded = ref(false);
const notifiersLoaded = ref(false);
const membersLoaded = ref(false);

onMounted(async () => {
  await projectsStore.fetchProject(projectId.value);
  // Load counts only for all tabs (page_size=1 to get count efficiently)
  await Promise.all([
    loadExportersCount(),
    loadHostsCount(),
    loadRulesCount(),
    loadUrlsCount(),
    loadNotifiersCount(),
    loadMembersCount(),
  ]);
  // Load actual data for the first tab (Exporters)
  await loadExporters();
});

const project = computed(() => projectsStore.currentProject);

// Count loading functions (load with page_size=1 to get count efficiently)
const loadExportersCount = async () => {
  try {
    const response = await exportersStore.fetchExporters({
      project_id: projectId.value,
      page_size: 1,
    });
    exportersCount.value = response.count || (response.results ? response.results.length : 0);
  } catch (error) {
    console.error("Error loading exporters count:", error);
    exportersCount.value = 0;
  }
};

const loadHostsCount = async () => {
  try {
    // Get farm from project
    const farmId = project.value?.farm?.id;
    if (!farmId) {
      hostsCount.value = 0;
      return;
    }

    // Fetch hosts for the project's farm
    const hostsResponse = await farmsStore.fetchFarmHosts(farmId, { page_size: 1 });
    hostsCount.value = hostsResponse.count || (hostsResponse.results ? hostsResponse.results.length : 0);
  } catch (error) {
    console.error("Error loading hosts count:", error);
    hostsCount.value = 0;
  }
};

const loadRulesCount = async () => {
  try {
    const response = await rulesStore.fetchRules({
      object_id: projectId.value,
      content_type: "project",
      page_size: 1,
    });
    rulesCount.value = response.count || (response.results ? response.results.length : 0);
  } catch (error) {
    console.error("Error loading rules count:", error);
    rulesCount.value = 0;
  }
};

const loadUrlsCount = async () => {
  try {
    const projectName = project.value?.name;
    if (projectName) {
      const response = await urlsStore.fetchUrls({
        project: projectName,
        page_size: 1,
      });
      urlsCount.value = response.count || (response.results ? response.results.length : 0);
    } else {
      urlsCount.value = 0;
    }
  } catch (error) {
    console.error("Error loading URLs count:", error);
    urlsCount.value = 0;
  }
};

const loadNotifiersCount = async () => {
  try {
    const response = await notifiersStore.fetchNotifiers({
      object_id: projectId.value,
      content_type: "project",
      page_size: 1,
    });
    notifiersCount.value = response.count || (response.results ? response.results.length : 0);
  } catch (error) {
    console.error("Error loading notifiers count:", error);
    notifiersCount.value = 0;
  }
};

const loadMembersCount = async () => {
  try {
    const [usersResponse, groupsResponse] = await Promise.all([
      projectsStore.fetchProjectUsers(projectId.value, { page_size: 1 }),
      projectsStore.fetchProjectGroups(projectId.value, { page_size: 1 })
    ]);

    const usersCount = usersResponse.count || (usersResponse.results ? usersResponse.results.length : 0);
    const groupsCount = groupsResponse.count || (groupsResponse.results ? groupsResponse.results.length : 0);
    membersCount.value = usersCount + groupsCount;
  } catch (error) {
    console.error("Error loading members count:", error);
    membersCount.value = 0;
  }
};

// Full data loading functions
const loadExporters = async (forceReload = false) => {
  if (exportersLoaded.value && !forceReload) return; // Skip if already loaded

  loadingExporters.value = true;
  try {
    const response = await exportersStore.fetchExporters({
      project_id: projectId.value,
    });
    exporters.value = response.results || response;
    exportersLoaded.value = true;
  } catch (error) {
    console.error("Error loading exporters:", error);
  } finally {
    loadingExporters.value = false;
  }
};

const loadHosts = async (forceReload = false) => {
  if (hostsLoaded.value && !forceReload) return; // Skip if already loaded

  loadingHosts.value = true;
  try {
    // Get farm from project
    const farmId = project.value?.farm?.id;
    const farmName = project.value?.farm?.name;

    if (!farmId) {
      hosts.value = [];
      hostsLoaded.value = true;
      return;
    }

    // Fetch hosts for the project's farm using the API endpoint /rest/v2/farms/{id}/hosts
    const hostsResponse = await farmsStore.fetchFarmHosts(farmId);
    const farmHosts = hostsResponse.results || hostsResponse;

    // Add farm information to each host
    hosts.value = farmHosts.map((host) => ({
      ...host,
      farm_id: farmId,
      farm_name: farmName,
    }));

    hostsLoaded.value = true;
  } catch (error) {
    console.error("Error loading hosts:", error);
    hosts.value = [];
  } finally {
    loadingHosts.value = false;
  }
};

const loadRules = async (forceReload = false) => {
  console.log('[loadRules] Called, rulesLoaded:', rulesLoaded.value, 'forceReload:', forceReload);
  if (rulesLoaded.value && !forceReload) return; // Skip if already loaded

  loadingRules.value = true;
  try {
    // Rules API uses object_id and content_type for filtering
    console.log('[loadRules] Fetching rules for project:', projectId.value);
    const response = await rulesStore.fetchRules({
      object_id: projectId.value,
      content_type: "project",
    });
    console.log('[loadRules] Response:', response);
    rules.value = response.results || response;
    console.log('[loadRules] Rules loaded:', rules.value.length);
    rulesLoaded.value = true;
  } catch (error) {
    console.error("Error loading rules:", error);
  } finally {
    loadingRules.value = false;
  }
};

const loadUrls = async (forceReload = false) => {
  if (urlsLoaded.value && !forceReload) return; // Skip if already loaded

  loadingUrls.value = true;
  try {
    // URLs API uses project name, not ID - get from current project
    const projectName = project.value?.name;
    if (projectName) {
      const response = await urlsStore.fetchUrls({
        project: projectName,
      });
      urls.value = response.results || response;
      urlsLoaded.value = true;
    } else {
      urls.value = [];
    }
  } catch (error) {
    console.error("Error loading URLs:", error);
  } finally {
    loadingUrls.value = false;
  }
};

const loadNotifiers = async (forceReload = false) => {
  if (notifiersLoaded.value && !forceReload) return; // Skip if already loaded

  loadingNotifiers.value = true;
  try {
    // Notifiers API uses object_id and content_type for filtering
    const response = await notifiersStore.fetchNotifiers({
      object_id: projectId.value,
      content_type: "project",
    });
    notifiers.value = response.results || response;
    notifiersLoaded.value = true;
  } catch (error) {
    console.error("Error loading notifiers:", error);
    notifiers.value = [];
  } finally {
    loadingNotifiers.value = false;
  }
};

const loadMembers = async (forceReload = false) => {
  if (membersLoaded.value && !forceReload) return; // Skip if already loaded

  loadingMembers.value = true;
  try {
    // Fetch both users and groups for this project
    const [usersResponse, groupsResponse] = await Promise.all([
      projectsStore.fetchProjectUsers(projectId.value),
      projectsStore.fetchProjectGroups(projectId.value)
    ]);

    const users = usersResponse.results || usersResponse || [];
    const groups = groupsResponse.results || groupsResponse || [];

    // Combine them into a single members list
    members.value = [
      ...users.map(u => ({ ...u, type: 'user' })),
      ...groups.map(g => ({ ...g, type: 'group' }))
    ];
    membersLoaded.value = true;
  } catch (error) {
    console.error("Error loading members:", error);
    members.value = [];
  } finally {
    loadingMembers.value = false;
  }
};


const editProject = () => {
  router.push(`/projects/${projectId.value}/edit`);
};

const handleTabChange = (tabValue) => {
  console.log('[handleTabChange] Raw parameter:', tabValue);
  console.log('[handleTabChange] Type:', typeof tabValue);

  // Handle both direct value and event object
  const actualValue = typeof tabValue === 'object' && tabValue?.value !== undefined
    ? tabValue.value
    : tabValue;

  console.log('[handleTabChange] Actual tab value:', actualValue);

  // Always reload data when switching to a tab
  // Check both string and number versions
  if (actualValue === 0 || actualValue === "0") {
    console.log('[handleTabChange] Loading exporters...');
    loadExporters(true);
  } else if (actualValue === 1 || actualValue === "1") {
    console.log('[handleTabChange] Loading hosts...');
    loadHosts(true);
  } else if (actualValue === 2 || actualValue === "2") {
    console.log('[handleTabChange] Loading rules...');
    loadRules(true);
  } else if (actualValue === 3 || actualValue === "3") {
    console.log('[handleTabChange] Loading URLs...');
    loadUrls(true);
  } else if (actualValue === 4 || actualValue === "4") {
    console.log('[handleTabChange] Loading notifiers...');
    loadNotifiers(true);
  } else if (actualValue === 5 || actualValue === "5") {
    console.log('[handleTabChange] Loading members...');
    loadMembers(true);
  }
};

const deleteProject = async () => {
  if (confirm(`Are you sure you want to delete project "${project.value?.name}"?`)) {
    try {
      const serviceId = project.value?.service?.id;
      await projectsStore.deleteProject(projectId.value);
      if (serviceId) {
        router.push(`/services/${serviceId}`);
      } else {
        router.push('/services');
      }
    } catch (error) {
      alert('Error deleting project: ' + error.message);
    }
  }
};

const viewExporter = (exporter) => {
  router.push(`/exporters/${exporter.id}`);
};

const viewRule = (rule) => {
  router.push(`/rules/${rule.id}`);
};

const registerRule = () => {
  router.push(`/rules/new?project_id=${projectId.value}&content_type=project`);
};

const registerNotifier = () => {
  router.push(`/notifiers/new?project_id=${projectId.value}&context_type=project`);
};

const editNotifier = (notifier) => {
  router.push(`/notifiers/${notifier.id}/edit`);
};

const deleteNotifier = async (notifier) => {
  if (confirm(`Are you sure you want to delete this notifier?`)) {
    try {
      await notifiersStore.deleteNotifier(notifier.id);
      await loadNotifiers(true);
      await loadNotifiersCount();
    } catch (error) {
      alert('Error deleting notifier: ' + error.message);
    }
  }
};
</script>

<template>
  <div class="project-detail" v-if="project">
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1>{{ project.name }}</h1>
        <p class="text-muted" v-if="project.description">{{ project.description }}</p>
      </div>
      <div class="d-flex gap-2">
        <Button
          label="Edit"
          icon="pi pi-pencil"
          severity="info"
          @click="editProject"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="deleteProject"
        />
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-6">
        <Card>
          <template #title>Project Information</template>
          <template #content>
            <div class="info-grid">
              <div class="info-item">
                <strong>Service:</strong>
                <span>{{ project.service.name || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <strong>Shard:</strong>
                <span>{{ project.shard.name || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <strong>Owner:</strong>
                <span>{{ project.owner || 'N/A' }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Tabs value="0" @update:value="handleTabChange">
      <TabList>
        <Tab value="0">Exporters ({{ exportersCount }})</Tab>
        <Tab value="1">Hosts ({{ hostsCount }})</Tab>
        <Tab value="2">Rules ({{ rulesCount }})</Tab>
        <Tab value="3">URLs ({{ urlsCount }})</Tab>
        <Tab value="4">Notifiers ({{ notifiersCount }})</Tab>
        <Tab value="5">Members ({{ membersCount }})</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div v-if="loadingExporters" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading exporters...</p>
          </div>
          <div v-else-if="exporters.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-download" style="font-size: 1.5rem"></i>
              <p class="mt-2">No exporters configured for this project.</p>
            </Message>
          </div>
          <DataTable v-else :value="exporters" striped-rows>
            <Column field="job_name" header="Job Name">
              <template #body="slotProps">
                <a
                  href="#"
                  class="text-primary"
                  @click.prevent="viewExporter(slotProps.data)"
                >
                  {{ slotProps.data.job }}
                </a>
              </template>
            </Column>
            <Column field="port" header="Port">
              <template #body="slotProps">
                {{ slotProps.data.scheme }}:{{ slotProps.data.port }}
              </template>
            </Column>
            <Column field="path" header="Path">
              <template #body="slotProps">
                {{ slotProps.data.path || '/metrics' }}
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="1">
          <div v-if="loadingHosts" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading hosts...</p>
          </div>
          <div v-else-if="hosts.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-server" style="font-size: 1.5rem"></i>
              <p class="mt-2">No hosts added to this project.</p>
            </Message>
          </div>
          <DataTable v-else :value="hosts" striped-rows>
            <Column field="name" header="Host Name"></Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="2">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <Button
              label="Register Rule"
              icon="pi pi-plus"
              severity="success"
              size="small"
              @click="registerRule"
            />
          </div>
          <div v-if="loadingRules" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading rules...</p>
          </div>
          <div v-else-if="rules.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-list" style="font-size: 1.5rem"></i>
              <p class="mt-2">No rules configured for this project.</p>
            </Message>
            <Button
              label="Register Rule"
              icon="pi pi-plus"
              severity="success"
              size="small"
              class="mt-3"
              @click="registerRule"
            />
          </div>
          <DataTable v-else :value="rules" striped-rows>
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
            <Column field="clause" header="Clause"></Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="3">
          <div v-if="loadingUrls" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading URLs...</p>
          </div>
          <div v-else-if="urls.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-link" style="font-size: 1.5rem"></i>
              <p class="mt-2">No URLs configured for this project.</p>
            </Message>
          </div>
          <DataTable v-else :value="urls" striped-rows>
            <Column field="url" header="URL">
              <template #body="slotProps">
                <a :href="slotProps.data.url" target="_blank" rel="noopener">
                  {{ slotProps.data.url }}
                </a>
              </template>
            </Column>
            <Column field="probe" header="Probe"></Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <Button
              label="Register Notifier"
              icon="pi pi-plus"
              severity="success"
              size="small"
              @click="registerNotifier"
            />
          </div>
          <div v-if="loadingNotifiers" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading notifiers...</p>
          </div>
          <div v-else-if="notifiers.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-bell" style="font-size: 1.5rem"></i>
              <p class="mt-2">No notifiers configured for this project.</p>
            </Message>
          </div>
          <DataTable v-else :value="notifiers" striped-rows>
            <Column field="sender" header="Type"></Column>
            <Column field="value" header="Value">
              <template #body="slotProps">
                {{ slotProps.data.alias || slotProps.data.value }}
              </template>
            </Column>
            <Column field="enabled" header="Status" style="width: 120px">
              <template #body="slotProps">
                <span :class="slotProps.data.enabled ? 'badge bg-success' : 'badge bg-danger'">
                  {{ slotProps.data.enabled ? 'Enabled' : 'Disabled' }}
                </span>
              </template>
            </Column>
            <Column header="Actions" style="width: 150px">
              <template #body="slotProps">
                <div class="d-flex gap-1">
                  <Button
                    icon="pi pi-pencil"
                    size="small"
                    severity="info"
                    @click="editNotifier(slotProps.data)"
                    title="Edit"
                  />
                  <Button
                    icon="pi pi-trash"
                    size="small"
                    severity="danger"
                    @click="deleteNotifier(slotProps.data)"
                    title="Delete"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="5">
          <div v-if="loadingMembers" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading members...</p>
          </div>
          <div v-else-if="members.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-users" style="font-size: 1.5rem"></i>
              <p class="mt-2">No members assigned to this project yet.</p>
            </Message>
          </div>
          <DataTable v-else :value="members" striped-rows>
            <Column field="type" header="Type" style="width: 100px">
              <template #body="slotProps">
                <span class="badge" :class="slotProps.data.type === 'user' ? 'bg-primary' : 'bg-success'">
                  {{ slotProps.data.type }}
                </span>
              </template>
            </Column>
            <Column field="username" header="Username">
              <template #body="slotProps">
                {{ slotProps.data.username || slotProps.data.name }}
              </template>
            </Column>
            <Column field="email" header="Email">
              <template #body="slotProps">
                {{ slotProps.data.email || 'N/A' }}
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <div v-else-if="projectsStore.loading" class="text-center p-5">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    <p>Loading project...</p>
  </div>

  <div v-else class="alert alert-warning">
    Project not found.
  </div>
</template>

<style scoped>
.project-detail {
  max-width: 1200px;
  padding: 2rem;
}

.project-detail .d-flex.gap-2 {
  gap: 0.75rem !important;
  display: flex !important;
}

/* Ensure buttons have proper spacing */
.project-detail .d-flex.gap-2 > .p-button {
  margin-right: 0.75rem;
}

.project-detail .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

.project-detail :deep(.p-card) {
  margin-bottom: 1.5rem;
}

.project-detail :deep(.p-card-body) {
  padding: 1.5rem;
}

.project-detail :deep(.p-card-content) {
  padding: 0;
}

/* Tab panels padding */
.project-detail :deep(.p-tabpanels) {
  padding: 1.5rem 0;
}

.project-detail :deep(.p-tabpanel) {
  padding: 0;
}

/* Spacing for buttons in tab panels */
.project-detail .d-flex.justify-content-between {
  margin-bottom: 1.25rem;
}

/* DataTable spacing */
.project-detail :deep(.p-datatable) {
  margin-top: 1rem;
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state .p-message {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .project-detail {
    padding: 1.5rem;
  }

  .project-detail :deep(.p-card-body) {
    padding: 1rem;
  }

  .project-detail :deep(.p-tabpanels) {
    padding: 1rem 0;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .project-detail {
    padding: 1rem;
  }

  .project-detail .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem;
  }

  .project-detail .d-flex.gap-2 .p-button {
    width: 100%;
  }
}
</style>
