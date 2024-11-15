<template>
  <div class="flex items-center mr-4 relative">
    <span class="relative" @click="showList = !showList">
        <span 
          class="absolute top-[-1px] right-[-3px] inline-block rounded-full text-white bg-red-500 text-[.6rem] pointer-events-none"
          v-if="unReadNotifications.length > 0"
        >
            {{ unReadNotifications.length }}

        </span>
        <Icon 
            class="cursor-pointer"
            name="bell text-theme-500 text-lg" 
            title="Notificaciones"
        />
    </span>
    <div 
      v-if="showList"
      class="mt-4 rounded-lg shadow-lg absolute top-8 left-[-8rem] bg-white z-50 w-max min-w-[18rem] max-w-[24rem] overflow-auto border-2"
    >
      <ul v-if="notifications.length > 0" class="text-xs text-gray-600 max-h-[30rem] overflow-auto">
        
        <li 
          v-for="notification in notifications"
          class="flex flex-col border-b-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
          :class="!notification.read_at ? 'bg-white' : 'bg-gray-100'"
          @click="handleSelect(notification)" 
        >         
          <span 
            class="whitespace-normal leading-4 font-bold"
          >
            <template v-if="notification.type == 'NewNoteNotification'">
              {{ notification.data.name }} dejó una nota

              <span class="text-xs flex items-center mt-2 text-gray-500 ">
                <Icon
                  class="mr-2"
                  :name="getIconNameByType(notification.data.type)"
                />
                <span>{{notification.data.noteable_name }}</span>
              </span>
            </template>
          </span>

          <span class="text-xs text-right mt-2">
            {{ $date(notification.created_at).format() }}
          </span>
       
        </li>       

      </ul>
      <div class="p-4 text-center text-gray-600" v-else>Sin notificaciones...</div>

      <div
          v-if="unReadNotifications.length > 0"
          class="px-4 py-[.25rem] text-center  cursor-pointer hover:bg-gray-100 bg-white "
          @click="markAllAsRead"
        >
          <span class="font-semibold text-gray-600 text-xs">Marcar todos como leído</span>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from "vue";
import router from "@/router";
import Icon from "@/views/components/icons/Icon";
import {useAuthStore} from "@/stores/auth";
import { storeToRefs } from 'pinia';
import $date from "@/helpers/date";
import NotificacionService from "@/services/NotificacionService";
import dayjs from "dayjs";

const authStore = useAuthStore();
const { notifications } = storeToRefs(authStore);
const showList = ref(false);
const notificacionService = new NotificacionService();

const unReadNotifications = computed(() => notifications.value.filter(item => item.read_at == null));

function handleSelect(notification) {
  let routeName = {
    lead: 'leads.show',
    cotizado: 'deals.cotizados.show',
    oportunidad: 'deals.oportunidades.show',
    customer: 'customers.show',
  }[notification.data.type];

  showList.value = false;

  notification.read_at = dayjs();

  router.push({name: routeName, params: {id: notification.data.noteable_id }});

  markAsRead(notification.id)
}

function markAsRead(id = null) {
  notificacionService.markAsRead(id);
}

function markAllAsRead() {
  notifications.value.forEach(item => {
    item.read_at = dayjs();
  });

  markAsRead();
}

function getIconNameByType(type) {
  return {
    lead: 'flag',
    cotizado: 'dollar',
    oportunidad: 'sign-in',
    customer: 'users',
  }[type];
}
</script>