<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')">
    <template #title>{{ 'Editr Proyecto' }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4 mt-4">
        
        <div class="flex gap-2 flex-col">
          <div class="w-full">

            <TextInput 
              type="text" 
              class="mb-4" 
              :required="false" 
              name="name" 
              v-model="form.name" 
              :label="trans('deals.labels.proyect_name')"
              :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
            /> 

            <Dropdown  
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
              class="mb-4 deal_status"
              :required="false"
              :label="trans('deals.labels.cotizado_status')"
              name="status" 
              :options="dealStatus" 
              v-model="form.status"  
              :errorMessage="v$.status.$errors.length ? v$.status.$errors[0].$message : ''"
            /> 

            <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-2">
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
                   
                   
          </div>

          <div class="w-full mb-2">           

            <Dropdown  
              :required="false"
              class="deal_source"
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
<!-- 
          <div class="w-full">            

          </div> -->

          <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-2">
            <TextInput 
              class="md:w-1/2" 
              type="text" 
              :required="false" 
              name="city" 
              v-model="form.city" 
              :label="trans('customers.labels.city')"
            />

            <TextInput 
                class="md:mb-0 md:w-1/2" 
                name="discount" 
                type="number"
                v-model="form.discount" 
                :label="trans('deals.labels.discount')"
              />
          </div>

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
import MoneyInput from "@/views/components/input/MoneyInput";
import Dropdown from "@/views/components/input/Dropdown";
import { dealCustomerResponsiveness, dealStages, pmChargeStatuses, dealStatus, dealEstimatedCloseDateRange } from "@/stub/statuses";
import { dealCategories } from "@/stub/categories";
import DealService from "@/services/DealService";
import Alert from "@/views/components/Alert";
import {clearObject, fillObject, reduceProperties, removeEmpty} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useCustomersStore} from "@/stores/customers";
import {useSourcesStore} from "@/stores/sources";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';
import { storeToRefs } from 'pinia';

const props = defineProps({  
  deal: {
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
  status: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  customer_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  source_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  value: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  estimated_close_date_range: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const v$ = useVuelidate(rules, form);

const dealService = new DealService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();
const formRef = ref(null);
const isLoading = ref(true);

const { customerList } = storeToRefs(customersStore);

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

  let data = reduceProperties(form, ['category_id', 'customer_id', 'source_id', 'owner_id', 'estimated_close_date_range', 'status'], 'id');
  dealService.handleUpdate(
      'update-deal', 
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
  Object.assign(form, props.deal);
  
  form.status = dealStatus.find(option => option.id === form.status);
  form.customer_id = customerList.value.find(option => option.id === form.customer?.id);
  form.source_id = sources.find(option => option.id === form.source?.id);
  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.estimated_close_date_range = dealEstimatedCloseDateRange.find(option => option.id === form.estimated_close_date_range);
  
  isLoading.value = false;
});

</script>