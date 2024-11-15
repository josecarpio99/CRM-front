<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="user-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">{{ trans('global.labels.associated_contacts') }}</h5>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
          <VDropdown 
            :auto-size="false"
            :prevent-overflow="false"
            :placement="'auto'" 
            :skidding="-10"
            :distance="15"
            :arrow-padding="6"
            :triggers="[]"
            :shown="showDropdown"
            @hide="showDropdown = false"
          >
            <Icon 
              name="plus" 
              :class="['text-gray-500', 'cursor-pointer', 'hover:text-blue-300']"
              @click.stop="showDropdown = !showDropdown"
            />

            <template #popper>    
              <div class="px-4 py-8 w-80 text-xs">
                <VSelect 
                  class="w-full text-gray-500 shadow-sm text-xs"
                  v-model="selectedContact" 
                  :options="contactList" 
                  id="contact-search" 
                  name="contact-search"
                  label="name"     
                  placeholder="Buscar contacto..."
                >

                  <template #no-options="{ search, searching, loading }">
                    <span class="text-xs px-2">
                      {{ search.length < 3 ? 'Buscar contacto' : 'No se encontraron resultados'  }}
                    </span>
                  </template>
              
                </VSelect>

                <div class="text-right">
                  <Button
                    class="mt-6 text-xs"
                    label="Agregar"
                    :disabled="! selectedContact"
                    @click="handleAddContact"
                  />

                </div>

              </div>
            </template>
          </VDropdown> 
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <ul 
        v-if="contacts.length > 0"
        class="w-full "
      >        
        <li
          v-for="contact in contacts"
          class="flex flex-col px-2 pt-2  pb-2 pl-4 relative border-t first:border-t-0"
        >
          <Icon 
            v-if="contacts.length > 1"
            class="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-red-400" 
            :name="'remove'" 
            @click="handleRemoveContact(contact)"
          />

          <div class="flex items-center mb-2">
            {{ contact.name }}
          </div>     

          <div class="flex items-center mb-2" v-if="contact.phone">
            <Icon 
              class="mr-2 align-middle" 
              :name="'phone'" 
            />
            <span>{{ contact.phone }}</span>
          </div>

          <div class="flex items-center" v-if="contact.email">
            <Icon 
              class="mr-2 align-middle" 
              :name="'envelope-o'" 
            />
            <span>{{ contact.email }}</span>
          </div>

        </li>
      </ul>
      <p v-else class="text-gray-500 my-4">{{ trans('global.labels.without_associated_contact') }}</p>

    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import {debounce} from "@/helpers/data";
import Button from "@/views/components/input/Button";
import ContactService from "@/services/ContactService";
const props = defineProps({
  customer: {
    type: Object,
    default: null
  },
  contacts: {
    type: Array,
    default: []
  }
});

const emit = defineEmits(['add', 'remove'])

const isOpen = ref(true);
const showDropdown = ref(false);
const selectedContact = ref(null);
const options = reactive([]);
const contactService = new ContactService();
const contactList = ref([]);

function handleAddContact() {
  emit('add', {contact: selectedContact});

  selectedContact.value = null;
  showDropdown.value = false;
}

function handleRemoveContact(contact) {
  emit('remove', {contact: contact});
}

const getContactList = () => {
  if (! props.customer) return;

  let query = {
    'filter[contactable_type]': 'customer',
    'limit': 'all',
    'filter[contactable_id]': props.customer.id
  }

  return new Promise((resolve) => {    
      contactService.index(query)
      .then((response) => {
        contactList.value = response.data.data;
      }).finally(() => {
        resolve();
      })
  })
}

onMounted( async () => {
  getContactList()
})
</script>