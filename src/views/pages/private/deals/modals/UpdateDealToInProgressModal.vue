<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ 'Actualizar A En Proceso' }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="convert-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="flex gap-2 flex-col">
          <div class="w-full">           

            <Dropdown  
              class=" estimated_close_date_range mb-4"
              :required="true"
              :label="trans('deals.labels.estimated_close_date')"
              :options="dealEstimatedCloseDateRange" 
              name="estimated_close_date_range" 
              v-model="form.estimated_close_date_range"     
              :errorMessage="v$.estimated_close_date_range.$errors.length ? v$.estimated_close_date_range.$errors[0].$message : ''"
            />

            <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-2">
              <MoneyInput 
                class="md:mb-0 md:w-1/2" 
                name="value" 
                v-model="form.value" 
                :label="trans('deals.labels.value')" 
                :errorMessage="v$.value.$errors.length ? v$.value.$errors[0].$message : ''"
              />

              <TextInput 
                class="md:mb-0 md:w-1/2" 
                name="discount" 
                type="number"
                v-model="form.discount" 
                :label="trans('deals.labels.discount')"
                :errorMessage="v$.discount.$errors.length ? v$.discount.$errors[0].$message : ''"
              />

            </div>
            
      
                   
          </div>          

        </div>

    </Form>

    <template #primary-button>
      <Button
        :label="'Guardar'"
        @click="onSubmit"
      />
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
import MoneyInput from "@/views/components/input/MoneyInput";
import Dropdown from "@/views/components/input/Dropdown";
import Button from "@/views/components/input/Button";
import { dealCategories } from "@/stub/categories";
import { dealCustomerResponsiveness, dealStages, pmChargeStatuses, dealEstimatedCloseDateRange } from "@/stub/statuses";
import DealService from "@/services/DealService";
import SectorService from "@/services/SectorService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties} from "@/helpers/data";
import {useAlertStore} from "@/stores";;
import {useAuthStore} from "@/stores/auth";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';

const emit = defineEmits(["close-modal", "submit"]);

const props = defineProps({
  deal: {
    required: true,
    type: Object
  }
});

const initialState = {
  estimated_close_date_range: null,
  value: 0,
  discount: 0
};

const form = reactive({...initialState});

const rules = {
  value: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  estimated_close_date_range: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  discount: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const v$ = useVuelidate(rules, form);

const dealService = new DealService();
const alertStore = useAlertStore();
const authStore = useAuthStore();

const formRef = ref(null);
const isLoading = ref(true);

function onSubmit() {  
  alertStore.clear();

  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  form.value = typeof form.value == 'string' ? form.value.replace(/\D/g, '') : form.value;

  dealService.updateToInprogress(
      props.deal.id,
      reduceProperties(form, ['estimated_close_date_range'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        

      emit('close-modal');
      emit('submit');
    }
  })
  
  return false;
}

function onCloseModal() {
  emit('close-modal');
}

onMounted( async () => {
  form.estimated_close_date_range = dealEstimatedCloseDateRange.find(option => option.id === props.deal.estimated_close_date_range);
  form.value = props.deal.value;
  form.discount = props.deal.discount;
  
  isLoading.value = false;
});

</script>