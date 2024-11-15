<template>
  <div class="rounded-md border-2 mt-4">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer bg-theme-600 hover:bg-theme-700 text-white"
      @click="isOpen = !isOpen">
      <div class="basis-full">
        <h5 class="font-semibold whitespace-normal">{{ title }}</h5>
      </div>
      <div class="text-right flex justify-between items-center">
        <div>        
          <Icon :name="isOpen ? 'angle-up' : 'angle-down'" />
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center p-4 bg-gray-50">
      <p class="whitespace-normal"><slot /></p>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import Icon from "@/views/components/icons/Icon";

const props = defineProps({
  title: {
    type: String,
    default: true
  }
});

const isOpen = ref(true);

</script>
