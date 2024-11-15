<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-green-300': value == 'de 0 a 3 meses',
      'bg-yellow-300': value == 'de 3 a 6 meses',
      'bg-blue-300': value == '6 meses o más'
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