<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useServicesStore,
  useProjectsStore,
  useRulesStore,
  useFarmsStore,
  useGroupsStore,
  useShardsStore,
} from "../stores";

const route = useRoute();
const router = useRouter();
const servicesStore = useServicesStore();
const projectsStore = useProjectsStore();
const rulesStore = useRulesStore();
const farmsStore = useFarmsStore();
const groupsStore = useGroupsStore();
const shardsStore = useShardsStore();

const breadcrumbItems = computed(() => {
  const items = [];

  const routeName = route.name;
  const params = route.params;

  // Don't show breadcrumb on home page
  if (routeName === "home") {
    return items;
  }

  // Always add home as first item (except for home page)
  items.push({
    label: "Home",
    icon: "pi pi-home",
    to: "/",
  });

  // Services
  if (routeName === "services") {
    items.push({ label: "Services" });
  } else if (routeName === "service-detail") {
    items.push({ label: "Services", to: "/services" });
    const service = servicesStore.currentService;
    items.push({ label: service?.name || `Service #${params.id}` });
  } else if (routeName === "service-create") {
    items.push({ label: "Services", to: "/services" });
    items.push({ label: "Register Service" });
  } else if (routeName === "service-edit") {
    items.push({ label: "Services", to: "/services" });
    const service = servicesStore.currentService;
    items.push({
      label: service?.name || `Service #${params.id}`,
      to: `/services/${params.id}`,
    });
    items.push({ label: "Edit" });
  }
  // Projects - Always shown under their service
  else if (routeName === "project-detail") {
    const project = projectsStore.currentProject;
    if (project?.service) {
      items.push({ label: "Services", to: "/services" });
      items.push({
        label: project.service.name || `Service #${project.service.id}`,
        to: `/services/${project.service.id}`,
      });
      items.push({ label: project.name || `Project #${params.id}` });
    } else {
      // Fallback if service not loaded yet
      items.push({ label: "Services", to: "/services" });
      items.push({ label: `Project #${params.id}` });
    }
  } else if (routeName === "project-create") {
    const serviceId = route.query.service_id;
    if (serviceId) {
      items.push({ label: "Services", to: "/services" });
      const service = servicesStore.currentService;
      items.push({
        label: service?.name || `Service #${serviceId}`,
        to: `/services/${serviceId}`,
      });
      items.push({ label: "Register Project" });
    } else {
      items.push({ label: "Register Project" });
    }
  } else if (routeName === "project-edit") {
    const project = projectsStore.currentProject;
    if (project?.service) {
      items.push({ label: "Services", to: "/services" });
      items.push({
        label: project.service.name || `Service #${project.service.id}`,
        to: `/services/${project.service.id}`,
      });
      items.push({
        label: project.name || `Project #${params.id}`,
        to: `/projects/${params.id}`,
      });
      items.push({ label: "Edit" });
    } else {
      // Fallback if service not loaded yet
      items.push({ label: "Services", to: "/services" });
      items.push({
        label: `Project #${params.id}`,
        to: `/projects/${params.id}`,
      });
      items.push({ label: "Edit" });
    }
  }
  // Rules
  else if (routeName === "rules") {
    items.push({ label: "Rules" });
  } else if (routeName === "rule-create") {
    const serviceId = route.query.service_id;
    const projectId = route.query.project_id;

    if (projectId) {
      const project = projectsStore.currentProject;
      if (project?.service && project.id == projectId) {
        items.push({ label: "Services", to: "/services" });
        items.push({
          label: project.service.name || `Service #${project.service.id}`,
          to: `/services/${project.service.id}`,
        });
        items.push({
          label: project.name || `Project #${projectId}`,
          to: `/projects/${projectId}`,
        });
        items.push({ label: "Register Rule" });
      } else {
        items.push({ label: "Services", to: "/services" });
        items.push({
          label: `Project #${projectId}`,
          to: `/projects/${projectId}`,
        });
        items.push({ label: "Register Rule" });
      }
    } else if (serviceId) {
      const service = servicesStore.currentService;
      items.push({ label: "Services", to: "/services" });
      items.push({
        label: service?.name || `Service #${serviceId}`,
        to: `/services/${serviceId}`,
      });
      items.push({ label: "Register Rule" });
    } else {
      items.push({ label: "Rules", to: "/rules" });
      items.push({ label: "Register Rule" });
    }
  } else if (routeName === "rule-detail") {
    const rule = rulesStore.currentRule;

    // Show parent object in breadcrumb if available
    if (rule?.content_type === "service" && rule?.object_id) {
      // Rule belongs to a service
      items.push({ label: "Services", to: "/services" });
      items.push({
        label: rule.content_name || `Service #${rule.object_id}`,
        to: `/services/${rule.object_id}`,
      });
      items.push({ label: rule.name || `Rule #${params.id}` });
    } else if (rule?.content_type === "project" && rule?.object_id) {
      // Rule belongs to a project - need to fetch project details for service
      const project = projectsStore.currentProject;
      if (project?.service && project.id === rule.object_id) {
        // Project is already loaded with service info
        items.push({ label: "Services", to: "/services" });
        items.push({
          label: project.service.name || `Service #${project.service.id}`,
          to: `/services/${project.service.id}`,
        });
        items.push({
          label: project.name || rule.content_name || `Project #${rule.object_id}`,
          to: `/projects/${rule.object_id}`,
        });
        items.push({ label: rule.name || `Rule #${params.id}` });
      } else {
        // Project not loaded yet or mismatch, show simplified breadcrumb
        items.push({ label: "Services", to: "/services" });
        items.push({
          label: rule.content_name || `Project #${rule.object_id}`,
          to: `/projects/${rule.object_id}`,
        });
        items.push({ label: rule.name || `Rule #${params.id}` });
      }
    } else {
      // Fallback: show generic rules breadcrumb
      items.push({ label: "Rules", to: "/rules" });
      items.push({ label: rule?.name || `Rule #${params.id}` });
    }
  } else if (routeName === "rule-edit") {
    const rule = rulesStore.currentRule;

    // Show parent object in breadcrumb if available
    if (rule?.content_type === "service" && rule?.object_id) {
      items.push({ label: "Services", to: "/services" });
      items.push({
        label: rule.content_name || `Service #${rule.object_id}`,
        to: `/services/${rule.object_id}`,
      });
      items.push({
        label: rule.name || `Rule #${params.id}`,
        to: `/rules/${params.id}`,
      });
      items.push({ label: "Edit" });
    } else if (rule?.content_type === "project" && rule?.object_id) {
      const project = projectsStore.currentProject;
      if (project?.service && project.id === rule.object_id) {
        items.push({ label: "Services", to: "/services" });
        items.push({
          label: project.service.name || `Service #${project.service.id}`,
          to: `/services/${project.service.id}`,
        });
        items.push({
          label: project.name || rule.content_name || `Project #${rule.object_id}`,
          to: `/projects/${rule.object_id}`,
        });
        items.push({
          label: rule.name || `Rule #${params.id}`,
          to: `/rules/${params.id}`,
        });
        items.push({ label: "Edit" });
      } else {
        items.push({ label: "Services", to: "/services" });
        items.push({
          label: rule.content_name || `Project #${rule.object_id}`,
          to: `/projects/${rule.object_id}`,
        });
        items.push({
          label: rule.name || `Rule #${params.id}`,
          to: `/rules/${params.id}`,
        });
        items.push({ label: "Edit" });
      }
    } else {
      items.push({ label: "Rules", to: "/rules" });
      items.push({
        label: rule?.name || `Rule #${params.id}`,
        to: `/rules/${params.id}`,
      });
      items.push({ label: "Edit" });
    }
  }
  // Exporters
  else if (routeName === "exporters") {
    items.push({ label: "Exporters" });
  }
  // Farms
  else if (routeName === "farms") {
    items.push({ label: "Farms" });
  } else if (routeName === "farm-detail") {
    items.push({ label: "Farms", to: "/farms" });
    const farm = farmsStore.currentFarm;
    items.push({ label: farm?.name || `Farm #${params.id}` });
  }
  // URLs
  else if (routeName === "urls") {
    items.push({ label: "URLs" });
  }
  // Groups
  else if (routeName === "groups") {
    items.push({ label: "Groups" });
  } else if (routeName === "group-detail") {
    items.push({ label: "Groups", to: "/groups" });
    const group = groupsStore.currentGroup;
    items.push({ label: group?.name || `Group #${params.id}` });
  }
  // Shards
  else if (routeName === "shards") {
    items.push({ label: "Shards" });
  } else if (routeName === "shard-detail") {
    items.push({ label: "Shards", to: "/shards" });
    const shard = shardsStore.currentShard;
    items.push({ label: shard?.name || `Shard #${params.id}` });
  }
  // Audit Logs
  else if (routeName === "logs") {
    items.push({ label: "Audit Logs" });
  }
  // Profile
  else if (routeName === "profile") {
    items.push({ label: "Profile" });
  }
  // Search
  else if (routeName === "search") {
    items.push({ label: "Search" });
  }
  // Demo
  else if (routeName === "demo") {
    items.push({ label: "Demo" });
  }

  return items;
});

const navigate = (item) => {
  if (item.to) {
    router.push(item.to);
  }
};
</script>

<template>
  <nav
    v-if="breadcrumbItems.length > 0"
    class="breadcrumb-container"
    aria-label="breadcrumb"
  >
    <ol class="breadcrumb">
      <li
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbItems.length - 1 }"
      >
        <a
          v-if="item.to && index !== breadcrumbItems.length - 1"
          href="#"
          @click.prevent="navigate(item)"
          class="breadcrumb-link"
        >
          <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
          <span>{{ item.label }}</span>
        </a>
        <span v-else class="breadcrumb-text">
          <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
          <span>{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-container {
  margin-bottom: 1.5rem;
  background: #ffffff;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #64748b;
}

.breadcrumb-item:not(:last-child)::after {
  content: "/";
  margin-left: 0.5rem;
  color: #cbd5e1;
  font-weight: 300;
}

.breadcrumb-item.active {
  color: #1e293b;
  font-weight: 500;
}

.breadcrumb-link {
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin: -0.25rem -0.5rem;
}

.breadcrumb-link:hover {
  color: #2563eb;
  background-color: #eff6ff;
}

.breadcrumb-text {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.breadcrumb-icon {
  font-size: 0.875rem;
}

@media (max-width: 576px) {
  .breadcrumb-container {
    padding: 0.5rem 0.75rem;
    margin-bottom: 1rem;
  }

  .breadcrumb-item {
    font-size: 0.8125rem;
  }

  .breadcrumb-icon {
    font-size: 0.8125rem;
  }
}
</style>






