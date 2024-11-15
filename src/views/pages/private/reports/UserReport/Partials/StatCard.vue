<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subValue: [String, Number],
  trend: String,
  color: {
    type: String,
    default: "blue-500"
  }
});
</script>

<template>
  <div class="bg-white border rounded-lg shadow relative flex flex-col" :class="`text-${color}`">
    <div class="p-4 flex flex-col items-center justify-center h-full">
      <div class="text-4xl font-bold text-center">{{ value }}</div>
      <div v-if="subValue || subValue === 0" class="text-xl  text-center mt-auto">$ {{ subValue }}</div>
      <div v-if="trend" class="text-center mt-1 absolute right-3 top-1">
        <span v-if="trend === 'up'" class="text-green-500">▲</span>
        <span v-else class="text-red-500">▼</span>
      </div>

    </div>
    <div class="text-sm text-white text-center py-2 mt-auto tracking-wider" :class="`bg-${color}`">{{ title }}</div>

  </div>
</template>