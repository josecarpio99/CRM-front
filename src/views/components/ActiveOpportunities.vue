<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="sign-in" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">{{ trans('customers.labels.active_opportunities') }}</h5>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
         
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2 max-h-96 overflow-y-auto">
      <ul 
        v-if="deals.length > 0"
        class="w-full"
      >
        <li 
          v-for="deal in deals"
          class="flex flex-col px-2 pt-2 pb-2 pl-4 border-b"
        >
          <router-link 
            class="font-semibold text-blue-500 hover:text-blue-700 hover:underline mb-4"
            :to="{name: 'deals.oportunidades.show', params: {id: deal.id}}"
          >
            {{ deal.name }}
          </router-link>
          <!-- <div class="flex items-center mb-2" v-if="deal.city">
            <Icon 
              class="mr-2 align-middle" 
              :name="'map-marker'" 
            />
            <span>{{ deal.city }}</span>
          </div> -->
        
        </li>  
        
       
      </ul>
      <p v-else class="text-gray-500 my-4">{{ trans('global.labels.without_active_opportunities') }}</p>

    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import Button from "@/views/components/input/Button";

const props = defineProps({
  deals: {
    type: Array,
    default: []
  } 
});

const isOpen = ref(true);


</script>