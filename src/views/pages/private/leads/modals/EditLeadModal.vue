<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')">
    <template #title>{{ trans('leads.labels.edit_lead') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-lead" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">
         
          <div class="w-full ">
            <TextInput 
              class="mb-4" 
              type="text" 
              :required="false" 
              name="company_name" 
              v-model="form.company_name" 
              :label="trans('customers.labels.company_name')"
            />

            <TextInput 
              class="mb-2" 
              type="text" 
              :required="false" 
              name="razon_social" 
              v-model="form.razon_social" 
              :label="trans('customers.labels.razon_social')"
            />    
<!-- 
            <TextInput 
              class="mb-4" 
              type="text" 
              :required="false" 
              name="name" 
              v-model="form.name" 
              :label="trans('customers.labels.name')"
            />          -->

          </div>
          
          <div class="w-full ">
            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->
            <!-- <TextInput 
              class="mb-4" 
              type="email" 
              :required="false" 
              name="email" 
              v-model="form.email" 
              :label="trans('users.labels.email')"
            /> -->

            <!-- <TextInput 
              class="mb-4 w-full " 
              type="text" 
              :required="false" 
              name="mobile" 
              v-model="form.mobile" 
              :label="trans('customers.labels.mobile')"
            />           -->
            
            <Dropdown  
              class="mb-4 customer_category"
              :required="false"
              :label="trans('customers.labels.category')"
              :options="leadCategories" 
              name="category" 
              v-model="form.category_id"                  
            /> 

            <Dropdown  
              class="mb-4"
              :required="true"
              :label="trans('global.labels.adviser_in_charge')"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="form.owner_id"   
              :errorMessage="v$.owner_id.$errors.length ? v$.owner_id.$errors[0].$message : ''"                         

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
         

        </div>
      </div>
    </Form>

  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import { leadCategories } from "@/stub/categories";
import LeadService from "@/services/LeadService";
import SectorService from "@/services/SectorService";
import CountryService from "@/services/CountryService";
import Alert from "@/views/components/Alert";
import {clearObject, fillObject, reduceProperties, removeEmpty} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useSourcesStore} from "@/stores/sources";
import $date from "@/helpers/date";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

const props = defineProps({  
  lead: {
    type: Object,
    required: true
  }, 
  showDelete: {
    type: Boolean,
    dafault: false
  }
});

const emit = defineEmits(['close-modal', 'updated', 'delete']);

const form = reactive({});

const rules = {
  // company_name: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // },
  // name: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // },
  // source_id: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // },
  // mobile: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // }, 
  // email: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // },
  // category_id: {
  //   required: helpers.withMessage(trans('global.validation.required'), required)
  // }, 
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const v$ = useVuelidate(rules, form);

const leadService = new LeadService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const sourcesStore = useSourcesStore();

const formRef = ref(null);
const isLoading = ref(true);

let users = usersStore.userList;

function onSubmit() {  
  alertStore.clear();
  
  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  let data = reduceProperties(form, ['category_id', 'owner_id', 'source_id'], 'id');
  
  leadService.handleUpdate(
      'update-lead', 
      form.id,
      removeEmpty(data)
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {
        emit('updated');
        emit('close-modal');
    }
  })
  
  return false;
}

function onCloseModal() {
  emit('close-modal');
}

onMounted( async () => {

  Object.assign(form, props.lead);

  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.category_id = leadCategories.find(option => option.id === form.category?.id);
  form.source_id = sourcesStore.sourceList.find(option => option.id === form.source?.id);
  
  isLoading.value = false;
});

</script>