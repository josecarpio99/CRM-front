<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('leads.phrases.sure_to_convert', {name: lead.name}) }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="convert-lead" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">

          <div class="rounded-md bg-gray-100 p-2 mb-2">
            <p class="text-gray-600 text-xs mb-2"><span class="font-bold">Nota:</span> Recuerda que al convertir un lead en contacto, el lead se borra del CRM y se reemplaza por un contacto.</p> 

          </div>
         
          <div class="w-full ">
            <TextInput 
              class="mb-4" 
              type="text" 
              :required="true" 
              name="company_name" 
              v-model="form.company_name" 
              :label="trans('customers.labels.company_name')"
              :errorMessage="v$.company_name.$errors.length ? v$.company_name.$errors[0].$message : ''"
            />

            <TextInput 
              class="mb-2" 
              type="text" 
              :required="false" 
              name="razon_social" 
              v-model="form.razon_social" 
              :label="trans('customers.labels.razon_social')"
            />       

          </div>
          
          <div class="w-full ">
            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->

            <!-- <div class="bg-gray-50 rounded-sm border p-4 mb-2">
              <h4 class="text-gray-700 text-center mb-1">{{ trans('customers.labels.contact_data') }}</h4>             

              <TextInput 
                class="mb-4" 
                type="text" 
                :required="true" 
                name="name" 
                v-model="form.name" 
                :label="trans('customers.labels.name')"
                :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
              />   

              <TextInput 
                class="mb-4" 
                type="email" 
                :required="true" 
                name="email" 
                v-model="form.email" 
                :label="trans('users.labels.email')"
                :errorMessage="v$.email.$errors.length ? v$.email.$errors[0].$message : ''"
              />
  
              <TextInput 
                class="mb-4 w-full " 
                type="text" 
                :required="true" 
                name="mobile" 
                v-model="form.mobile" 
                :label="trans('customers.labels.mobile')"
                :errorMessage="v$.mobile.$errors.length ? v$.mobile.$errors[0].$message : ''"
              />          
            </div> -->
            
            <Dropdown  
              class="mb-4 customer_category"
              :required="true"
              :label="trans('customers.labels.category')"
              :options="customerCategories" 
              name="category" 
              v-model="form.category_id"   
              :errorMessage="v$.category_id.$errors.length ? v$.category_id.$errors[0].$message : ''"                         
            /> 

            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('global.labels.adviser_in_charge')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"              
            />   

          </div>

          <Dropdown  
            :required="false"
            class="mb-4 deal_source"
            :label="trans('leads.labels.lead_source')"
            selectLabel="name"
            name="source" 
            :options="sourcesStore.sourceList" 
            v-model="form.source_id"      
            :errorMessage="v$.source_id.$errors.length ? v$.source_id.$errors[0].$message : ''"
          />

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

          <div class="flex items-center justify-end gap-2 pl-2 pt-4">
            <input 
              type="checkbox"
              ref="saveAndCreateOportunidad"
              name="saveAndCreateOportunidad"
              id="saveAndCreateOportunidad"
              checked
            >
            <label for="saveAndCreateOportunidad">Guardar y crear proyecto</label>
          </div>

        </div>
      </div>

    </Form>

    <template>
      <CreateOportunidadModal v-if="customerId" :customer_id="customerId" :requirement="requirement" :modalActive="showCreateOportunidadModal" @close-modal="handleCloseOportunidad"/>
    </template>
  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import router from "@/router";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import { customerCategories } from "@/stub/categories";
import LeadService from "@/services/LeadService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useSourcesStore} from "@/stores/sources";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';
import {useCustomersStore} from "@/stores/customers";
import CreateOportunidadModal from "@/views/pages/private/deals/modals/CreateOportunidadModal.vue";

import {useGlobalStateStore} from "@/stores/global";
const emit = defineEmits(["close-modal"]);

const props = defineProps({
  lead: {
    required: true,
    type: Object
  }
});


const initialState = {
  company_name: '',
  razon_social: '',    
  // name: '',           
  // email: '',
  // mobile: '',
  city: '',
  requirement: null,
  category_id: null,
  source_id: null,
  owner_id: null
};

const form = reactive({...initialState});

const rules = {
  company_name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  source_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  // name: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // },
  // mobile: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // }, 
  // email: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // },
  category_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const v$ = useVuelidate(rules, form);

const leadService = new LeadService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const sourcesStore = useSourcesStore();
const customersStore = useCustomersStore();
const globalUserState = useGlobalStateStore();

const customerId = ref(null);
const requirement = ref(null);
const formRef = ref(null);
const isLoading = ref(true);
const saveAndCreateOportunidad = ref(null);
const showCreateOportunidadModal = ref(false);
let users = usersStore.userList;



async function onSubmit() {  
  let createOportunidad = saveAndCreateOportunidad.value.checked;

  alertStore.clear();
  
  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  globalUserState.loadingElements['convert-lead'] = true;

  form.create_opportunity = createOportunidad;

  leadService.convert(
      props.lead.id, 
      reduceProperties(form, ['category_id','owner_id', 'source_id'], 'id')
    ).then(async (res) => {                
    if (res?.status == 200 || res?.status == 201) {
        await customersStore.getCustomerList();
        // if (createOportunidad) {
        //   requirement.value = res.data.data.requirement;
        //   customerId.value = res.data.data.id;
        //   showCreateOportunidadModal.value = true;
        // } else {
        //   emit('close-modal');
        //   router.push({name: 'customers.show', params: {id: res.data.data.id}});
        // }

        emit('close-modal');
        router.push({name: 'customers.show', params: {id: res.data.data.id}});
    }
  })
  .finally(() => {
    globalUserState.loadingElements['convert-lead'] = false;
  })
  
  return false;
}

function handleCloseOportunidad() {
  router.push({name: 'customers.show', params: {id: customerId.value}});
  showCreateOportunidadModal.value = false;
  emit('close-modal');
}

function onCloseModal() {
  emit('close-modal');
}

onMounted( async () => {

  form.owner_id = users.find(option => option.id === props.lead.owner?.id);
  form.category_id = customerCategories.find(option => option.id === props.lead.category?.id);
  form.source_id = sourcesStore.sourceList.find(option => option.id === props.lead.source?.id);

  form.company_name = props.lead.company_name;
  form.razon_social = props.lead.razon_social;
  form.name = props.lead.name;
  form.email = props.lead.email;
  form.city = props.lead.city;
  form.mobile = props.lead.mobile;
  form.requirement = props.lead.requirement;
  isLoading.value = false;
});

</script>