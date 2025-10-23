<script setup>
import { useDemoStore } from "../stores/demo.js";

const demoStore = useDemoStore();
</script>

<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ locale }}
      </option>
    </select>
  </div>
  <h1>{{ $t("msg") }}</h1>

  <ul class="store-demo">
    <li v-for="(fruit, index) in demoStore.fruits" :key="index">
      {{ $t(fruit) }}
    </li>
  </ul>
</template>
