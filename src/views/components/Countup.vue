<template>
  <div class="text-red-400 text-xl font-semibold" :class="props.class">
    {{ diff }}
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {timeDiff} from "@/helpers/date";

const props = defineProps({
  date: {
    required: true,
    type: String
  },
  class: {
    type: String,
    default: null
  }
})


const diff = ref(null);

let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    diff.value = timeDiff(props.date);
  }, 1000);
})

onUnmounted(() => {
  clearInterval(interval);
}) 
</script>