<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-violet-200': value == 'NY',
      'bg-amber-500': value == 'FL',
      'bg-rose-200': value == 'TX',
      'bg-lime-200': value == 'NC',
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