<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-green-300': value == 'Prospección',
      'bg-yellow-300': value == 'Publicidad - Guardia',
      'bg-blue-300': value == 'Recompra'
    }"
  >
    {{ value }}
  </span>   
</template>

<script setup>

const props = defineProps({
  value: {
    required: true
  }
});

</script>