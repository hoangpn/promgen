<script setup>
import { ref, watch } from 'vue';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  loading: {
    type: Boolean,
    default: false
  },
  showClearButton: {
    type: Boolean,
    default: true
  },
  debounce: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);

const searchValue = ref(props.modelValue);
let debounceTimeout = null;

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue;
});

watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue);

  if (props.debounce > 0) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      emit('search', newValue);
    }, props.debounce);
  }
});

const handleSearch = () => {
  emit('search', searchValue.value);
};

const handleClear = () => {
  searchValue.value = '';
  emit('update:modelValue', '');
  emit('clear');
  emit('search', '');
};

const handleKeyup = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  } else if (event.key === 'Escape') {
    handleClear();
  }
};
</script>

<template>
  <div class="search-bar">
    <IconField>
      <InputIcon>
        <i class="pi pi-search" />
      </InputIcon>
      <InputText
        v-model="searchValue"
        :placeholder="placeholder"
        @keyup="handleKeyup"
        class="search-input"
        :disabled="loading"
      />
    </IconField>

    <div class="search-actions">
      <Button
        v-if="showClearButton && searchValue"
        icon="pi pi-times"
        severity="secondary"
        text
        rounded
        @click="handleClear"
        v-tooltip.top="'Clear search (Esc)'"
        :disabled="loading"
        class="clear-button"
      />
      <Button
        label="Search"
        icon="pi pi-search"
        severity="primary"
        @click="handleSearch"
        v-tooltip.top="'Search (Enter)'"
        :loading="loading"
        class="search-button"
      />
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  padding: 1rem;
  background-color: var(--p-card-background, #ffffff);
  border-radius: 8px;
  border: 1px solid var(--p-card-border-color, #e5e7eb);
  margin-bottom: 1.5rem;
}

.search-bar :deep(.p-iconfield) {
  flex: 1;
}

.search-bar :deep(.p-inputtext) {
  width: 100%;
  padding-left: 2.5rem;
}

.search-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.clear-button {
  transition: all 0.2s ease;
}

.clear-button:hover {
  background-color: var(--p-button-secondary-hover-background);
}

.search-button {
  min-width: fit-content;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .search-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .search-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .search-bar {
    padding: 0.5rem;
  }
}
</style>



