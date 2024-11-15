<script setup>
import { money_format } from "@/helpers/data";

defineProps({
  title: String,
  data: Array
});
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow border">
    <h3 class="text-lg font-medium text-blue-500 mb-4 text-center">{{ title }}</h3>
    <div class="space-y-2">
      <!-- Column Headers -->
      <div class="flex justify-between text-sm font-semibold text-gray-600 border-b pb-2">
        <span class="w-1/3 "></span>
        <span class="w-1/3 text-center">Cantidad</span>
        <span v-if="data[0]?.value !== undefined" class="w-1/3 text-right">Valor</span>
      </div>
      <!-- Table Rows -->
      <div v-for="(row, index) in data" :key="index" class="flex justify-between text-sm">
        <span class="w-1/3 text-blue-400 ">{{ row.period }}</span>
        <span class="w-1/3 text-center font-medium">{{ row.count }}</span>
        <span v-if="row.value || row.value === 0" class="w-1/3 text-right font-medium">${{ money_format(row.value, 0) }}</span>
      </div>
    </div>
  </div>
</template>