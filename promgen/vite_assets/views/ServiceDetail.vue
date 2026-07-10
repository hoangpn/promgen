<script setup>
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useServicesStore, useProjectsStore, useRulesStore, useNotifiersStore } from "../stores";
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
const servicesStore = useServicesStore();
const projectsStore = useProjectsStore();
const rulesStore = useRulesStore();
const notifiersStore = useNotifiersStore();

const serviceId = computed(() => route.params.id);

// Data for each tab
const projects = ref([]);
const rules = ref([]);
const notifiers = ref([]);
const members = ref([]);

// Loading states
const loadingProjects = ref(false);
const loadingRules = ref(false);
const loadingNotifiers = ref(false);
const loadingMembers = ref(false);

// Counts for tab labels
const projectsCount = ref(0);
const rulesCount = ref(0);
const notifiersCount = ref(0);
const membersCount = ref(0);

// Track if full data has been loaded
const projectsLoaded = ref(false);
const rulesLoaded = ref(false);
const notifiersLoaded = ref(false);
const membersLoaded = ref(false);

onMounted(async () => {
  await servicesStore.fetchService(serviceId.value);
  // Load counts only for all tabs (page_size=1 to get count efficiently)
  await Promise.all([
    loadProjectsCount(),
    loadRulesCount(),
    loadNotifiersCount(),
    loadMembersCount(),
  ]);
  // Load actual data for the first tab (Projects)
  await loadProjects();
});

const service = computed(() => servicesStore.currentService);

// Count loading functions (load with page_size=1 to get count efficiently)
const loadProjectsCount = async () => {
  try {
    const response = await projectsStore.fetchProjects({
      service_id: serviceId.value,
      page_size: 1,
    });
    projectsCount.value = response.count || (response.results ? response.results.length : 0);
  } catch (error) {
    console.error("Error loading projects count:", error);
    projectsCount.value = 0;
  }
};

const loadRulesCount = async () => {
  try {
    const response = await rulesStore.fetchRules({
      object_id: serviceId.value,
      content_type: "service",
      page_size: 1,
    });
    rulesCount.value = response.count || (response.results ? response.results.length : 0);
  } catch (error) {
    console.error("Error loading rules count:", error);
    rulesCount.value = 0;
  }
};

const loadNotifiersCount = async () => {
  try {
    const response = await notifiersStore.fetchNotifiers({
      object_id: serviceId.value,
      content_type: "service",
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
      servicesStore.fetchServiceUsers(serviceId.value, { page_size: 1 }),
      servicesStore.fetchServiceGroups(serviceId.value, { page_size: 1 })
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
const loadProjects = async (forceReload = false) => {
  if (projectsLoaded.value && !forceReload) return; // Skip if already loaded

  loadingProjects.value = true;
  try {
    const response = await projectsStore.fetchProjects({ service_id: serviceId.value });
    projects.value = response.results || response;
    projectsLoaded.value = true;
  } catch (error) {
    console.error("Error loading projects:", error);
  } finally {
    loadingProjects.value = false;
  }
};

const loadRules = async (forceReload = false) => {
  if (rulesLoaded.value && !forceReload) return; // Skip if already loaded

  loadingRules.value = true;
  try {
    // Rules API uses object_id and content_type for filtering
    const response = await rulesStore.fetchRules({
      object_id: serviceId.value,
      content_type: "service"
    });
    rules.value = response.results || response;
    rulesLoaded.value = true;
  } catch (error) {
    console.error("Error loading rules:", error);
  } finally {
    loadingRules.value = false;
  }
};

const loadNotifiers = async (forceReload = false) => {
  if (notifiersLoaded.value && !forceReload) return; // Skip if already loaded

  loadingNotifiers.value = true;
  try {
    // Notifiers API uses object_id and content_type for filtering
    const response = await notifiersStore.fetchNotifiers({
      object_id: serviceId.value,
      content_type: "service"
    });
    notifiers.value = response.results || response;
    notifiersLoaded.value = true;
  } catch (error) {
    console.error("Error loading notifiers:", error);
  } finally {
    loadingNotifiers.value = false;
  }
};

const loadMembers = async (forceReload = false) => {
  if (membersLoaded.value && !forceReload) return; // Skip if already loaded

  loadingMembers.value = true;
  try {
    // Fetch both users and groups for this service
    const [usersResponse, groupsResponse] = await Promise.all([
      servicesStore.fetchServiceUsers(serviceId.value),
      servicesStore.fetchServiceGroups(serviceId.value)
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

const handleTabChange = (tabValue) => {
  console.log('[handleTabChange] Raw parameter:', tabValue);

  // Handle both direct value and event object
  const actualValue = typeof tabValue === 'object' && tabValue?.value !== undefined
    ? tabValue.value
    : tabValue;

  console.log('[handleTabChange] Actual tab value:', actualValue);

  // Always reload data when switching to a tab
  // Check both string and number versions
  if (actualValue === 0 || actualValue === "0") {
    console.log('[handleTabChange] Loading projects...');
    loadProjects(true);
  } else if (actualValue === 1 || actualValue === "1") {
    console.log('[handleTabChange] Loading rules...');
    loadRules(true);
  } else if (actualValue === 2 || actualValue === "2") {
    console.log('[handleTabChange] Loading notifiers...');
    loadNotifiers(true);
  } else if (actualValue === 3 || actualValue === "3") {
    console.log('[handleTabChange] Loading members...');
    loadMembers(true);
  }
};

const editService = () => {
  router.push(`/services/${serviceId.value}/edit`);
};

const deleteService = async () => {
  if (
    confirm(`Are you sure you want to delete service "${service.value?.name}"?`)
  ) {
    try {
      await servicesStore.deleteService(serviceId.value);
      router.push("/services");
    } catch (error) {
      alert("Error deleting service: " + error.message);
    }
  }
};

const viewProject = (project) => {
  router.push(`/projects/${project.id}`);
};

const viewRule = (rule) => {
  router.push(`/rules/${rule.id}`);
};

const registerProject = () => {
  router.push(`/projects/new?service_id=${serviceId.value}`);
};

const registerRule = () => {
  router.push(`/rules/new?service_id=${serviceId.value}&content_type=service`);
};

const registerNotifier = () => {
  router.push(`/notifiers/new?service_id=${serviceId.value}&context_type=service`);
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
  <div class="service-detail" v-if="service">
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1>{{ service.name }}</h1>
        <p class="text-muted" v-if="service.description">{{ service.description }}</p>
      </div>
      <div class="d-flex gap-2">
        <Button
          label="Edit"
          icon="pi pi-pencil"
          severity="info"
          @click="editService"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          @click="deleteService"
        />
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-6">
        <Card>
          <template #title>Service Information</template>
          <template #content>
            <div class="info-grid">
              <div class="info-item">
                <strong>Owner:</strong>
                <span>{{ service.owner || 'N/A' }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Tabs value="0" @update:value="handleTabChange">
      <TabList>
        <Tab value="0">Projects ({{ projectsCount }})</Tab>
        <Tab value="1">Rules ({{ rulesCount }})</Tab>
        <Tab value="2">Notifiers ({{ notifiersCount }})</Tab>
        <Tab value="3">Members ({{ membersCount }})</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <Button
              label="Register Project"
              icon="pi pi-plus"
              severity="success"
              size="small"
              @click="registerProject"
            />
          </div>
          <div v-if="loadingProjects" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading projects...</p>
          </div>
          <div v-else-if="projects.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-folder" style="font-size: 1.5rem"></i>
              <p class="mt-2">No projects found for this service.</p>
            </Message>
          </div>
          <DataTable v-else :value="projects" striped-rows>
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
            <Column field="description" header="Description"></Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="1">
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
              <p class="mt-2">No rules configured for this service.</p>
            </Message>
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

        <TabPanel value="2">
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
              <p class="mt-2">No notifiers configured for this service.</p>
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

        <TabPanel value="3">
          <div v-if="loadingMembers" class="text-center p-4">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading members...</p>
          </div>
          <div v-else-if="members.length === 0" class="empty-state">
            <Message severity="info" :closable="false">
              <i class="pi pi-users" style="font-size: 1.5rem"></i>
              <p class="mt-2">No members assigned to this service yet.</p>
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

  <div v-else-if="servicesStore.loading" class="text-center p-5">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    <p>Loading service...</p>
  </div>

  <div v-else class="alert alert-warning">
    Service not found.
  </div>
</template>

<style scoped>
.service-detail {
  max-width: 1200px;
  padding: 2rem;
}

.service-detail .d-flex.gap-2 {
  gap: 0.75rem !important;
  display: flex !important;
}

/* Ensure buttons have proper spacing */
.service-detail .d-flex.gap-2 > .p-button {
  margin-right: 0.75rem;
}

.service-detail .d-flex.gap-2 > .p-button:last-child {
  margin-right: 0;
}

.service-detail :deep(.p-card) {
  margin-bottom: 1.5rem;
}

.service-detail :deep(.p-card-body) {
  padding: 1.5rem;
}

.service-detail :deep(.p-card-content) {
  padding: 0;
}

/* Tab panels padding */
.service-detail :deep(.p-tabpanels) {
  padding: 1.5rem 0;
}

.service-detail :deep(.p-tabpanel) {
  padding: 0;
}

/* Spacing for buttons in tab panels */
.service-detail .d-flex.justify-content-between {
  margin-bottom: 1.25rem;
}

/* DataTable spacing */
.service-detail :deep(.p-datatable) {
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
  .service-detail {
    padding: 1.5rem;
  }

  .service-detail :deep(.p-card-body) {
    padding: 1rem;
  }

  .service-detail :deep(.p-tabpanels) {
    padding: 1rem 0;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .service-detail {
    padding: 1rem;
  }

  .service-detail .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem;
  }

  .service-detail .d-flex.gap-2 .p-button {
    width: 100%;
  }
}
</style>
