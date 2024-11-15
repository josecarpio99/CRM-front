<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('deals.phrases.convert_oportunidad') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="convert-deal" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">      

      <div class="flex gap-2 flex-col">

        <div class="rounded-md bg-gray-100 p-2 mb-2">
          <p class="text-gray-600 text-xs mb-2"><span class="font-bold">Nota:</span> Recuerda que al convertir una oportunidad a cotización, la oportunidad se borra del CRM y se reemplaza por una cotización.</p> 

        </div>
          <div class="w-full">           

            <div class="flex gap-4 flex-col md:flex-row md:justify-between mb-4">
              <MoneyInput 
                class="md:mb-0 md:w-1/2" 
                name="value" 
                v-model="form.value" 
                :label="trans('deals.labels.cotizado_estimated_value')" 
                :errorMessage="v$.value.$errors.length ? v$.value.$errors[0].$message : ''"

              />

              <Dropdown  
                class="md:mb-0 md:w-1/2 estimated_close_date_range"
                :required="true"
                :label="trans('deals.labels.estimated_close_date')"
                :options="dealEstimatedCloseDateRange" 
                name="estimated_close_date_range" 
                v-model="form.estimated_close_date_range"     
                :errorMessage="v$.estimated_close_date_range.$errors.length ? v$.estimated_close_date_range.$errors[0].$message : ''"
              />
            </div>
                   
                   
          </div>          

        </div>

    </Form>

    <template #primary-button>
      <Button
        :label="trans('global.actions.convert')"
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

const emit = defineEmits(["close-modal"]);

const props = defineProps({
  deal: {
    required: true,
    type: Object
  }
});

const initialState = {
  estimated_close_date_range: null,
  value: 0,
};

const form = reactive({...initialState});

const rules = {
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

  dealService.convert(
      props.deal.id,
      reduceProperties(form, ['estimated_close_date_range'], 'id')
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201) {        
      router.push({name: 'deals.cotizados.show', params: {id: res.data.data.id}});
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
  
  isLoading.value = false;
});

</script>