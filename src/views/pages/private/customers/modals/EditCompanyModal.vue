<template>
  <BaseModal :isLoading="isLoading" :show-delete="props.showDelete" @close-modal="onCloseModal" @save-modal="onSubmit" @delete="$emit('delete')" >
    <template #title>{{ trans('customers.labels.edit_client') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="update-company" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
      <div class="border-b-2 border-gray-100 pb-4">
        <div class="flex gap-2 flex-col ">
         
          <div class="w-full ">
            <StarToggle 
              class="mb-4"
              v-model="form.star" 
              iconClass="h-6 w-6"  
              :label="trans('customers.labels.key_contact')"
              :showLabel="true"
            />


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

            <!-- <TextInput 
              class="mb-4" 
              type="text" 
              :required="true" 
              name="name" 
              v-model="form.name" 
              :label="trans('customers.labels.name')"
              :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
            />          -->

          </div>
          
          <div class="w-full ">
            <!-- <div class="flex flex-col sm:flex-row gap-2">
            </div> -->
            <!-- <TextInput 
              class="mb-4" 
              type="email" 
              :required="true" 
              name="email" 
              v-model="form.email" 
              :label="trans('users.labels.email')"
              :errorMessage="v$.email.$errors.length ? v$.email.$errors[0].$message : ''"
            /> -->

            <!-- <TextInput 
              class="mb-4 w-full " 
              type="text" 
              :required="true" 
              name="mobile" 
              v-model="form.mobile" 
              :label="trans('customers.labels.mobile')"
              :errorMessage="v$.mobile.$errors.length ? v$.mobile.$errors[0].$message : ''"
            />           -->
            
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
            :label="trans('customers.labels.origin')"
            selectLabel="name"
            name="source" 
            :options="sourcesStore.sourcesForCustomers" 
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

          <FileInput 
              name="logo" 
              :label="trans('global.labels.logo')" 
              v-model="form.image" 
              @clear="form.image = ''" 
              class="mb-4"
              :accept="'image/*'"
            >
          </FileInput>

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
import FileInput from "@/views/components/input/FileInput";
import Dropdown from "@/views/components/input/Dropdown";
import StarToggle from "@/views/components/input/StarToggle";
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties, removeEmpty} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useSourcesStore} from "@/stores/sources";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

const props = defineProps({  
  customer: {
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

const customerService = new CustomerService();
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

  let data = reduceProperties(form, ['category_id', 'sector_id', 'owner_id', 'source_id'], 'id');
  data.logo = form.image;
  customerService.handleUpdate(
      'update-company', 
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

  Object.assign(form, props.customer);
  
  form.owner_id = users.find(option => option.id === form.owner?.id);
  form.category_id = customerCategories.find(option => option.id === form.category?.id);
  form.source_id = sourcesStore.sourceList.find(option => option.id === form.source?.id);

  isLoading.value = false;

});

</script>