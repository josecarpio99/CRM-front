<template>
  <div class="flex items-center mr-4 relative">
    <span class="relative" @click="showList = !showList">
        <span 
          class="absolute top-[-1px] right-[-5px] inline-block rounded-full text-white bg-red-500 text-[.6rem] pointer-events-none"
          v-if="lastIncompletedTasks.length > 0"
        >
            {{ lastIncompletedTasks.length }}

        </span>
        <Icon 
            class="cursor-pointer"
            name="pencil-square-o text-theme-600 text-lg" 
            title="Tareas Pendientes"
        />
    </span>
    <div 
      v-if="showList"
      class="mt-4 rounded-lg shadow-lg p-4 absolute top-8 left-[-8rem] bg-white z-50 w-max min-w-[18rem] max-w-[24rem] max-h-[30rem] overflow-auto border-2"
    >
      <ul v-if="lastIncompletedTasks.length > 0" class="text-xs text-gray-600">
        <li 
          v-for="task in lastIncompletedTasks"
          class="flex flex-col border-b-2 py-2  cursor-pointer hover:bg-gray-100"
          @click="handleSelect(task.resource)" 
        >
          <span 
            class="whitespace-normal leading-4 font-bold"
          >
            {{ task.content }}
          </span>
          <span 
            class="whitespace-normal "
          >
            {{ task.resource?.name }}
          </span>
          <span
            class="text-xs"
            :class="dayjs().isBefore(dayjs(task.due_at)) ? 'text-gray-500' : 'text-red-500'"
          >
          {{ $date(task.due_at).format('DD MMM, YYYY HH:mm A') }}
          </span>
        </li>
      </ul>
      <span v-else>Sin tareas pendientes...</span>
    </div>
  </div>

</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import Icon from "@/views/components/icons/Icon";
import {useAuthStore} from "@/stores/auth";
import { storeToRefs } from 'pinia';
import $date from "@/helpers/date";
import dayjs from "dayjs";

const authStore = useAuthStore();
const { lastIncompletedTasks } = storeToRefs(authStore);
const showList = ref(false);

function handleSelect(resource) {
  let routeName = {
    lead: 'leads.show',
    cotizado: 'deals.cotizados.show',
    oportunidad: 'deals.oportunidades.show',
    customer: 'customers.show',
  }[resource.type];

  showList.value = false;

  router.push({name: routeName, params: {id: resource.id }});
}
</script>