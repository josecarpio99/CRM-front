<template>
  <div class="rounded-md border-2 mt-2">
    <div 
      class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen"
    >
      <Icon name="users" class="basis-1/12 text-gray-500 cursor-pointer mr-1" />
      <div class="basis-full">
        <h5 class="font-semibold">{{ 'Contactos' }}</h5>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
          <ContactPopup @submit="onSubmit" />
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />        
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <ul 
        v-if="contacts.length > 0"
        class="w-full divide-y divide-gray-200 flex flex-col gap-3"
      >
        <ContactItem v-for="contact in contacts" :contact="contact" @update="onUpdate"  />      
      </ul>
      <p v-else class="text-gray-500 my-4">{{ 'Sin Contactos' }}</p>
    </div>
  </div>
    
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import {trans} from '@/helpers/i18n';
import ContactItem from "@/views/components/contact/ContactItem";
import ContactPopup from "@/views/components/contact/ContactPopup";
import Icon from "@/views/components/icons/Icon";

const props = defineProps({
  contacts: {
    type: Array,
    default: []
  } 
});

const emit = defineEmits(['submit', 'update']);
const isOpen = ref(true);


function onSubmit(params) {
  emit('submit', params);
};

function onUpdate(params) {
  emit('update', params);
};

</script>

<style lang="scss" scoped>

</style>