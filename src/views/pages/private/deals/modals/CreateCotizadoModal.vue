<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ 'Agregar Proyecto' }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-cotizado" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="rounded-md bg-gray-100 p-2 mb-2">
        <p class="text-gray-600 text-xs mb-2"><span class="font-bold">Nota:</span> Recuerda que una cotización es cuando ya tienes un monto estipulado en firme con tu cliente. El proyecto debe de estar vivo para que siga contando como una cotización.</p> 
      </div>

      <TextInput 
        type="text" 
        class="mb-4" 
        :required="false" 
        name="name" 
        v-model="form.name" 
        :label="trans('deals.labels.proyect_name')"
        :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
      /> 

      <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-8">
        <MoneyInput 
          class="md:mb-0 md:w-1/2" 
          name="value" 
          v-model="form.value" 
          :label="trans('deals.labels.value')" 
          :errorMessage="v$.value.$errors.length ? v$.value.$errors[0].$message : ''"
        />

        <Dropdown  
          class="md:mb-0 md:w-1/2 estimated_close_date_range"
          :required="false"
          :label="trans('deals.labels.estimated_close_date')"
          :options="dealEstimatedCloseDateRange" 
          name="estimated_close_date_range" 
          v-model="form.estimated_close_date_range"  
          :errorMessage="v$.estimated_close_date_range.$errors.length ? v$.estimated_close_date_range.$errors[0].$message : ''"
        />
      </div>

      <Toggle v-model="showCustomerSection" class="mb-2 text-right" label="Agregar nuevo cliente" />

      <div v-show="showCustomerSection" class="rounded-lg p-4 mb-6 bg-gray-100">

        <p class="text-gray-600 font-semibold mb-2">{{ 'Datos del cliente' }}</p>

        <TextInput 
          class="mb-4 w-full"           
          type="text" 
          :required="true" 
          name="name" 
          v-model="form.customer.company_name" 
          :label="trans('customers.labels.company_name')"
          :errorMessage="v$.customer.company_name.$errors.length ? v$.customer.company_name.$errors[0].$message : ''"
          @input="v$.customer.company_name.$touch()"          
        />

        <TextInput 
          class="mb-4 w-full"           
          type="text" 
          :required="true" 
          name="name" 
          v-model="form.customer.name" 
          :label="trans('customers.labels.name')"
          :errorMessage="v$.customer.name.$errors.length ? v$.customer.name.$errors[0].$message : ''"

        />

        <TextInput class="mb-4 w-full"  type="email" :required="false" name="email" v-model="form.customer.email" :label="trans('users.labels.email')"/>

        <TextInput class="mb-4 w-full "  type="text" :required="false" name="mobile" v-model="form.customer.mobile" :label="trans('customers.labels.mobile')"/>

        <Dropdown  
          class="mb-4 customer_category"
          :required="true"
          :label="trans('customers.labels.category')"
          :options="customerCategories" 
          name="category" 
          v-model="form.customer.category_id"   
          :errorMessage="v$.customer.category_id.$errors.length ? v$.customer.category_id.$errors[0].$message : ''"                         
        /> 

      </div>

      <Dropdown  
        v-show="! showCustomerSection"
        class="mb-4" 
        :required="false"           
        :label="trans('deals.labels.client')"
        :options="customerList" 
        selectLabel="name"
        name="customer" 
        v-model="form.customer_id" 
        :errorMessage="v$.customer_id.$errors.length ? v$.customer_id.$errors[0].$message : ''"
      /> 

      <Dropdown  
        v-show="! showCustomerSection && form.customer_id"
        class="mb-4" 
        :required="false"           
        :label="trans('deals.labels.contact')"
        :options="contactList" 
        selectLabel="name"
        name="contact" 
        v-model="form.contact_id" 
      /> 
        
        <div class="flex gap-2 flex-col">
          <div class="w-full">                      
                   
          </div>

          <div class="w-full">            

            <Dropdown  
              :required="false"
              class="mb-4 deal_source"
              :label="trans('deals.labels.source')"
              selectLabel="name"
              name="source" 
              :options="sources" 
              v-model="form.source_id"      
              :errorMessage="v$.source_id.$errors.length ? v$.source_id.$errors[0].$message : ''"
            />
                                 
          </div>

          <div class="w-full">                      
            
            <Dropdown  
              class="mb-4"
              :required="false"
              :label="trans('global.labels.adviser_in_charge')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"  
              :errorMessage="v$.owner_id.$errors.length ? v$.owner_id.$errors[0].$message : ''"
            />                      

          </div>

          <TextInput 
            class="mb-4" 
            type="text" 
            :required="false" 
            name="city" 
            v-model="form.city" 
            :label="trans('customers.labels.city')"
          />   

          <TextInput 
            class="mb-4" 
            type="textarea" 
            :required="false" 
            name="requirement" 
            v-model="form.requirement" 
            :label="trans('global.labels.requirement')"
          />
        </div>  

    </Form>

    <template>
      <!-- <CreatePersonModal :modalActive="showCreatePersonModal" @close-modal="toggleModal('CreatePersonModal')"/>
      <CreateCompanyModal :modalActive="showCreateCompanyModal" @close-modal="toggleModal('CreateCompanyModal')"/> -->
    </template>

  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted, computed, watch} from "vue";
import router from "@/router";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import MoneyInput from "@/views/components/input/MoneyInput";
import Toggle from "@/views/components/input/Toggle";
import Dropdown from "@/views/components/input/Dropdown";
import { customerCategories } from "@/stub/categories";
import { dealCustomerResponsiveness, dealStages, pmChargeStatuses, dealEstimatedCloseDateRange } from "@/stub/statuses";
import DealService from "@/services/DealService";
import SectorService from "@/services/SectorService";
import ContactService from "@/services/ContactService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useCustomersStore} from "@/stores/customers";
import {useSourcesStore} from "@/stores/sources";
import {useAuthStore} from "@/stores/auth";
import CreatePersonModal from "@/views/pages/private/customers/modals/CreatePersonModal.vue";
import CreateCompanyModal from "@/views/pages/private/customers/modals/CreateCompanyModal.vue";
import useVuelidate from '@vuelidate/core';
import {
  required,
  requiredIf,
  maxLength,  
  helpers
} from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import {debounce} from "@/helpers/data";

const props = defineProps({
  customer_id: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(["close-modal"]);

const dealService = new DealService();
const contactService = new ContactService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const formRef = ref(null);
const showCustomerSection = ref(true);
const isLoading = ref(true);
const showCreatePersonModal = ref(false);
const showCreateCompanyModal = ref(false);
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();
const customerId = computed(() => props.customer_id);

const { customerList } = storeToRefs(customersStore);
const contactList = ref([]);

const initialState = {
  type: 'cotizado',    
  customer_id: null,    
  source_id: null,
  contact_id: null,
  owner_id: {
    id: authStore.user.id,
    name: authStore.user.name,
  },
  estimated_close_date_range: null,
  value: 0,  
  name: null,
  customer: {
    company_name: null,
    name: null,
    email: null,
    mobile: null,
    category_id: null,
  }
};

const form = reactive(structuredClone(initialState));

const rules = {
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  customer_id: {
    required: helpers.withMessage(
        trans('global.validation.required'), 
        requiredIf(() => showCustomerSection.value == false)
    )    
  },
  source_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  value: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  estimated_close_date_range: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  customer: {
    category_id: {
      required: helpers.withMessage(
        trans('global.validation.required'), 
        requiredIf(() => showCustomerSection.value == true)
      )
    },
    name: {
      required: helpers.withMessage(
        trans('global.validation.required'), 
        requiredIf(() => showCustomerSection.value == true)
      )
    },
    company_name: {
      required: helpers.withMessage(
        trans('global.validation.required'), 
        requiredIf(() => showCustomerSection.value == true)
      )
    },
  }
} 

const v$ = useVuelidate(rules, form);

let users = usersStore.userList;
let sources = sourcesStore.sourceList;

function onSubmit() {  
  alertStore.clear();

  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  form.value = typeof form.value == 'string' ? form.value.replace(/\D/g, '') : form.value;

  const dataForm = {
    ...reduceProperties(form, ['customer_id', 'source_id', 'owner_id', 'estimated_close_date_range', 'contact_id'], 'id'), 
    customer: reduceProperties(form.customer, ['category_id'], 'id')
  }; 

  dealService.handleCreate(
      'create-cotizado', 
      dataForm
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
        Object.assign(form, structuredClone(initialState));
        emit('close-modal');
        router.push({name: 'deals.cotizados.show', params: {id: res.data.data.id}});
    }
  })
  
  return false;
}

function onCloseModal() {
  Object.assign(form, structuredClone(initialState));
  if (customerId.value) {
    form.customer_id = customerList.value.find(item => item.id == customerId.value);
  }
  emit('close-modal');
}

function toggleModal(key) {
  alertStore.clear();
  if (key === 'CreatePersonModal') {
    showCreatePersonModal.value = !showCreatePersonModal.value;            
  }
  if (key === 'CreateCompanyModal') {
    showCreateCompanyModal.value = !showCreateCompanyModal.value;
  }  

  if (
      showCreateCompanyModal.value == true ||
      showCreatePersonModal.value == true
  ) {
      alertStore.showOnPage = false;
  } else {
      alertStore.showOnPage = true;
  }
}

const handleContactSearch = debounce((search, loading) => {
  if (search.length < 3) return;

  loading(true);

  getContactList(search)
    .finally(() => {
      loading(false);
    })
}, 400)

const getContactList = () => {
  let query = {
    'filter[contactable_type]': 'customer',
    'limit': 'all'
  }

  if (form.customer_id) {
    query['filter[contactable_id]'] = form.customer_id.id;
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

watch(() => form.customer_id, () => {
  if (form.customer_id) {
    getContactList(null)
      .then(() => {
        if(contactList.value.length == 1) {
          form.contact_id = contactList.value[0]
        } else if(contactList.value.length == 0) {
          form.contact_id = null
        }
      })
  }
});

onMounted( async () => {
  if (customerId.value) {
    form.customer_id = customerList.value.find(item => item.id == customerId.value);
    showCustomerSection.value = false;
  }

  isLoading.value = false;
});

</script>

<style>
#create-cotizado .customer_category .v-select {
  background-color: #fff !important;
}
</style>