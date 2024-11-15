<template>
  <li class="flex items-center p-2">
    <div class="flex flex-col w-full">
      <VDropdown
        :triggers="[]"
        placement="left"
        :shown="showDropdown"
        @hide="showDropdown = false"
      >
        <div class="flex justify-between items-center mb-2">
          <span 
            class=" whitespace-normal leading-4 flex gap-2 items-center"
          >
            <Icon name="user-o" class="text-gray-500" />
            {{ contact.name }}
          </span>
          <div>
            <Icon 
              class="text-gray-500 cursor-pointer hover:text-blue-500"
              name="pencil" 
              @click="showDropdown = !showDropdown"
            />

          </div>
        </div>

        <div class="flex justify-between items-center gap-3 mb-1">
          <span 
            class=" whitespace-normal leading-4 flex gap-2 items-center"
          >
            <Icon name="envelope-o" class="text-gray-500" />
            <span class="text-sm">{{ contact.email }}</span>
          </span>
        </div>

        <div class="flex justify-between items-center gap-3 mb-1" v-if="contact.email2">
          <span 
            class=" whitespace-normal leading-4 flex gap-2 items-center"
          >
            <Icon name="envelope-o" class="text-gray-500" />
            <span class="text-sm">{{ contact.email2 }}</span>
          </span>
        </div>

        <div class="flex justify-between items-center gap-3">
          <span 
            class=" leading-4 flex gap-2 items-center"
          >
            <Icon name="phone" class="text-gray-500" />
            <span class="text-sm whitespace-normal ">
              {{ contact.phone }}
            </span> 
          </span>

          <span 
            v-if="contact.phone2"
            class=" leading-4 flex gap-2 items-center"
          >
            <Icon name="phone" class="text-gray-500" />
            <span class="text-sm whitespace-normal ">
              {{ contact.phone2 }}
            </span> 
          </span>
        </div>
        <template #popper>
          <ContactForm class="w-96 p-6" :contact="contact" @submit="onSubmit" />
        </template>
      </VDropdown>
    </div>

    <!-- <Icon 
      name="trash-o" 
      class="text-red-500 cursor-pointer ml-auto"
      @click="deletecontact(contact)"
    /> -->
  </li>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import alertHelpers from "@/helpers/alert";
import ContactForm from "@/views/components/contact/ContactForm";

const props = defineProps({
  contact: {
    required: true,
    type: Object
  }
});

const emit = defineEmits(['update']);

const showDropdown = ref(false);

function deletecontact(contact) {
  alertHelpers.confirmDanger(function () {
    
  });
}

function onSubmit(params) {
  emit('update', {data: params, id: props.contact.id});
};
</script>

<style>

</style>