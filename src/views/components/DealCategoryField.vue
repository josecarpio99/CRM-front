<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-green-300': value == 'AAA - Corporativos e Industrias',
      'bg-yellow-300': value == 'AA - Pymes',
      'bg-blue-300': value == 'A - Micro y Personas Físicas'
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