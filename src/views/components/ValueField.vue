<template>
  <span 
    class="text-gray-600 font-bold p-2 rounded-lg"
    :class="{
      'bg-pink-100': value <= 500_000,
      'bg-blue-200': value > 500_000 && value <= 3_000_000,
      'bg-yellow-200': value > 3_000_000 && value <= 6_000_000,
      'bg-green-200': value > 6_000_000,
      'font-semibold': props.large,
      'text-2xl': props.large,
    }"
  >
    {{ '$ ' + value?.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
  </span>   
</template>

<script setup>

const props = defineProps({
  value: {
    required: true,
    default: 0
  },
  large: {
    type: Boolean,
    default: false
  }
});

</script>

<style lang="scss" scoped>

</style>