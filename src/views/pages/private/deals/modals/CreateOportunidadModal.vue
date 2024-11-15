<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('deals.labels.add_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="rounded-md bg-gray-100 p-2 mb-2">
        <p class="text-gray-600 text-xs mb-2"><span class="font-bold">Nota:</span> Recuerda que una oportunidad es un proyecto que <span class="font-bold uppercase">aún no esta cotizado</span>,
          pero en donde ya tienes contacto con el cliente e identificaste sus necesidades.</p> 

      </div>
        
      <TextInput 
        type="text" 
        class="mb-4" 
        :required="false" 
        name="name" 
        v-model="form.name" 
        :label="trans('deals.labels.oportunidad_name')"
        :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
      /> 

      <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-8">
        <MoneyInput 
          class="md:mb-0 md:w-1/2" 
          name="value" 
          v-model="form.value" 
          :label="trans('deals.labels.oportunidad_estimated_value')" 
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

      <Toggle v-model="showCustomerSection" class="mb-2 text-right" label="Agregar nuevo contacto" />

      <div v-show="showCustomerSection" class="rounded-lg p-4 mb-6 bg-gray-100">

        <p class="text-gray-600 font-semibold mb-2">{{ trans('deals.phrases.main_contact') }}</p>

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
        :label="trans('deals.labels.main_contact')"
        :options="customerList" 
        selectLabel="name"
        name="customer" 
        v-model="form.customer_id"
        :errorMessage="v$.customer_id.$errors.length ? v$.customer_id.$errors[0].$message : ''"
        @input="v$.customer_id.$touch()"  

      /> 
        
        <div class="flex gap-2 flex-col">
          <div class="w-full">                      

            <!-- <span class="text-blue-300 text-xs mt-[1px] mb-4 block">Agregar <button class="uppercase text-blue-500 font-semibold hover:text-blue-700" @click.prevent="toggleModal('CreatePersonModal')">Persona</button> o <button class="uppercase text-blue-500 font-semibold hover:text-blue-700" @click.prevent="toggleModal('CreateCompanyModal')">Empresa</button></span> -->

            <!-- <TextInput type="text" class="mb-4" :required="false" name="value" v-model="form.value" :label="trans('deals.labels.oportunidad_estimated_value')"/> -->
                   
          </div>

          <div class="w-full">            

            <Dropdown  
              :required="false"
              class="mb-4 deal_source"
              :label="trans('deals.labels.oportunidad_source')"
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
import {reactive, ref, onMounted, watch, computed} from "vue";
import router from "@/router";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import MoneyInput from "@/views/components/input/MoneyInput";
import Toggle from "@/views/components/input/Toggle";
import Dropdown from "@/views/components/input/Dropdown";
import { customerCategories } from "@/stub/categories";
import { dealEstimatedCloseDateRange } from "@/stub/statuses";
import DealService from "@/services/DealService";
import SectorService from "@/services/SectorService";
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

const props = defineProps({
  customer_id: {
    type: Number,
    default: null
  },
  requirement: {
    type: String,
    default: null
  },
});

const emit = defineEmits(["close-modal"]);

const dealService = new DealService();
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
const requirement = computed(() => props.requirement);

const { customerList } = storeToRefs(customersStore);

const initialState = {
  type: 'oportunidad',    
  customer_id: null,    
  source_id: null,
  owner_id: {
    id: authStore.user.id,
    name: authStore.user.name,
  },
  estimated_close_date_range: null,
  value: 0,  
  name: null,
  requirement: null,
  city: null,
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
    ...reduceProperties(form, ['customer_id', 'source_id', 'owner_id', 'estimated_close_date_range'], 'id'), 
    customer: reduceProperties(form.customer, ['category_id'], 'id')
  };  
  
  dealService.handleCreate(
      'create-deal', 
      dataForm
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {
        Object.assign(form, structuredClone(initialState));
        emit('close-modal');
        router.push({name: 'deals.oportunidades.show', params: {id: res.data.data.id}});

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

onMounted( async () => {
  if (customerId.value) {
    form.customer_id = customerList.value.find(item => item.id == customerId.value);
    showCustomerSection.value = false;
  }

  if (requirement.value) {
    form.requirement = requirement.value;
  }

  isLoading.value = false;
});

</script>

<style>
#create-deal .customer_category .v-select {
  background-color: #fff !important;
}

</style>