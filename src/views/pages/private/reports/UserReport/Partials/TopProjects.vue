<script setup>
import { money_format } from "@/helpers/data";

defineProps({
  projects: Array
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow border">
    <h3 class="text-lg font-medium text-blue-500 mb-4 text-center">TOP 5 PROYECTOS</h3>
    <div class="space-y-2">
      <!-- Column Headers -->
      <div class="flex justify-between text-sm font-semibold text-gray-600 border-b pb-2">
        <span>Empresa</span>
        <span>Valor</span>
      </div>
      <!-- Table Rows -->
      <div v-for="(project, index) in projects" :key="index" class="flex justify-between text-sm">
        <span class="text-blue-400">{{ index + 1 }}) {{ project.customer.company_name }}</span>
        <span class="font-medium">${{ money_format(project.value, 0) }}</span>
      </div>
    </div>
  </div>
</template>