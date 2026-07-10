<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, useNotifiersStore } from '../stores';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';

const router = useRouter();
const authStore = useAuthStore();
const notifiersStore = useNotifiersStore();

const user = ref(authStore.user);
const notifiers = ref([]);
const loading = ref(false);

onMounted(async () => {
  if (user.value) {
    await loadNotifiers();
  }
});

const loadNotifiers = async () => {
  loading.value = true;
  try {
    const response = await notifiersStore.fetchNotifiers({
      object_id: user.value.id,
      content_type: 'user',
    });
    notifiers.value = response.results || response;
  } catch (error) {
    console.error('Error loading notifiers:', error);
    notifiers.value = [];
  } finally {
    loading.value = false;
  }
};

const registerNotifier = () => {
  router.push('/notifiers/new?context_type=user');
};

const editNotifier = (notifier) => {
  router.push(`/notifiers/${notifier.id}/edit`);
};

const deleteNotifier = async (notifier) => {
  if (confirm('Are you sure you want to delete this notifier?')) {
    try {
      await notifiersStore.deleteNotifier(notifier.id);
      await loadNotifiers();
    } catch (error) {
      alert('Error deleting notifier: ' + error.message);
    }
  }
};
</script>

<template>
  <div class="profile-page">
    <h1>Profile</h1>

    <Card class="mb-4">
      <template #title>User Information</template>
      <template #content>
        <div v-if="user" class="info-grid">
          <div class="info-item">
            <strong>Username:</strong>
            <span>{{ user.username }}</span>
          </div>
          <div class="info-item">
            <strong>Email:</strong>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-item">
            <strong>Is Superuser:</strong>
            <span>{{ user.is_superuser ? 'Yes' : 'No' }}</span>
          </div>
        </div>
        <p v-else>Loading user information...</p>
      </template>
    </Card>

    <Card>
      <template #title>
        <div class="d-flex justify-content-between align-items-center">
          <span>My Notifiers</span>
          <Button
            label="Register Notifier"
            icon="pi pi-plus"
            severity="success"
            size="small"
            @click="registerNotifier"
          />
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="text-center p-4">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>Loading notifiers...</p>
        </div>
        <div v-else-if="notifiers.length === 0" class="empty-state">
          <Message severity="info" :closable="false">
            <i class="pi pi-bell" style="font-size: 1.5rem"></i>
            <p class="mt-2">No notifiers configured for your profile.</p>
          </Message>
          <Button
            label="Register Notifier"
            icon="pi pi-plus"
            severity="success"
            size="small"
            class="mt-3"
            @click="registerNotifier"
          />
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
      </template>
    </Card>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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

.mb-4 {
  margin-bottom: 1.5rem;
}

.d-flex {
  display: flex;
}

.gap-1 {
  gap: 0.25rem;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

.p-4 {
  padding: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 1rem;
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

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.bg-success {
  background-color: #22c55e;
  color: white;
}

.bg-danger {
  background-color: #ef4444;
  color: white;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1.5rem;
  }
}
</style>
