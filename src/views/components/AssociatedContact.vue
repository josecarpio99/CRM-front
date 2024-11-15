<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="user-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <!-- <h5 class="font-semibold">{{ trans('global.labels.associated_contacts') }}</h5> -->
        <h5 class="font-semibold">{{ 'Cliente Asociado' }}</h5>
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
                  v-model="selectedCustomer" 
                  :options="customerList" 
                  id="customer-search" 
                  name="customer-search"
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
                    :disabled="! selectedCustomer"
                    @click="handleAddCustomer"
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
        v-if="customer"
        class="w-full"
      >
        <li class="flex flex-col px-2 pt-2 pb-2 pl-4">
          <router-link 
            class="font-semibold text-blue-500 hover:text-blue-700 hover:underline mb-4"
            :to="{name: 'customers.show', params: {id: customer.id}}"
          >
            {{ customer.company_name }}
          </router-link>
          <div class="flex items-center mb-2" v-if="customer.city">
            <Icon 
              class="mr-2 align-middle" 
              :name="'map-marker'" 
            />
            <span>{{ customer.city }}</span>
          </div>
          <div class="flex items-center mb-2" v-if="customer.mobile">
            <Icon 
              class="mr-2 align-middle" 
              :name="'phone'" 
            />
            <span>{{ customer.mobile }}</span>
          </div>
          <div class="flex items-center" v-if="customer.email">
            <Icon 
              class="mr-2 align-middle" 
              :name="'envelope-o'" 
            />
            <span>{{ customer.email }}</span>
          </div>
        </li>  
        
        <li
          v-for="contact in contacts"
          class="flex flex-col px-2 pt-2 border-t-2 pb-2 pl-4 relative"
        >
          <Icon 
            class="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-red-400" 
            :name="'remove'" 
            @click="handleRemoveCustomer(contact)"
          />

          <router-link 
            class="font-semibold text-blue-500 hover:text-blue-700 hover:underline mb-4"
            :to="{name: 'customers.show', params: {id: contact.id}}"
          >
            {{ contact.name }}
          </router-link>     

          <div class="flex items-center mb-2" v-if="contact.mobile">
            <Icon 
              class="mr-2 align-middle" 
              :name="'phone'" 
            />
            <span>{{ contact.mobile }}</span>
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
import {ref, reactive} from "vue";
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import {debounce} from "@/helpers/data";
import Button from "@/views/components/input/Button";
import CustomerService from "@/services/CustomerService";
import {useCustomersStore} from "@/stores/customers";
import { storeToRefs } from 'pinia';

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

const customerService = new CustomerService();
const isOpen = ref(true);
const showDropdown = ref(false);
const selectedCustomer = ref(null);
const options = reactive([]);
const customersStore = useCustomersStore();

const { customerList } = storeToRefs(customersStore);

const handleSearch = debounce(function(search, loading) {
  if (search.length < 3) return;

  loading(true);

  customerService.index({
    'filter[name]': search
  })
  .then((response) => {
    Object.assign(options, response.data.data);
  }).finally(() => {
    loading(false);
  })

}, 400);

function handleAddCustomer() {
  emit('add', {customer: selectedCustomer});

  selectedCustomer.value = null;
  showDropdown.value = false;
}

function handleRemoveCustomer(customer) {
  emit('remove', {customer: customer});
}
</script>