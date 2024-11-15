<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title>{{ trans('customers.labels.add_client') }}</template>
    <Alert class="mb-4"/>

    <Form ref="formRef" id="create-company" @submit.prevent="onSubmit" class="w-[700px] max-w-[100%]">
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

            <div class="mb-4">
              <TextInput 
                class="" 
                type="text" 
                :required="true" 
                name="company_name" 
                v-model="form.company_name" 
                :label="trans('customers.labels.company_name')"
                :errorMessage="vv$.company_name.$errors.length ? vv$.company_name.$errors[0].$message : ''"
              />            
              <VTooltip v-if="companiesFound.length > 0" class="text-red-400 mt-1 text-sm inline-block" placement="right">
                <span class="cursor-pointer">Coincidencias encontradas: {{ companiesFound.length }}</span>
                <template #popper>
                  <ul class="flex flex-col gap-2">
                    <li v-for="company in companiesFound">
                      {{ company.company_name }}
                    </li>
                  </ul>
                </template>
              </VTooltip>
            </div>
            
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
            <div class="bg-gray-50 rounded-sm border p-4 mb-2">
              <h4 class="text-gray-700 text-center mb-1">{{ trans('customers.labels.contact_data') }}</h4>

              <TextInput 
                class="mb-4" 
                type="text" 
                :required="true" 
                name="name" 
                v-model="form.name" 
                :label="trans('customers.labels.name')"
                :errorMessage="vv$.name.$errors.length ? vv$.name.$errors[0].$message : ''"
              />     

              <TextInput 
                class="mb-4" 
                type="email" 
                :required="true" 
                name="email" 
                v-model="form.email" 
                :label="trans('users.labels.email')"
                :errorMessage="vv$.email.$errors.length ? vv$.email.$errors[0].$message : ''"
              />
  
              <TextInput 
                class="mb-4 w-full " 
                type="text" 
                :required="true" 
                name="mobile" 
                v-model="form.mobile" 
                :label="trans('customers.labels.mobile')"
                :errorMessage="vv$.mobile.$errors.length ? vv$.mobile.$errors[0].$message : ''"
              />          
            </div>
            
            <Dropdown  
              class="mb-4 customer_category"
              :required="true"
              :label="trans('customers.labels.category')"
              :options="customerCategories" 
              name="category" 
              v-model="form.category_id"   
              :errorMessage="vv$.category_id.$errors.length ? vv$.category_id.$errors[0].$message : ''"                         
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
            :errorMessage="vv$.source_id.$errors.length ? vv$.source_id.$errors[0].$message : ''"
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
              v-model="form.logo" 
              @clear="form.logo = ''" 
              class="mb-4"
              :accept="'image/*'"
            >
          </FileInput>
          
          <div class="flex items-center justify-end gap-2 pl-2 pt-4">
            <input 
              type="checkbox"
              ref="saveAndCreateOportunidad"
              name="saveAndCreateOportunidad"
              id="saveAndCreateOportunidad"
            >
            <label for="saveAndCreateOportunidad">Guardar y crear proyecto</label>
          </div>

        </div>
      </div>

    </Form>

    <template>
      <CreateOportunidadModal v-if="customerId" :customer_id="customerId" :modalActive="showCreateOportunidadModal" @close-modal="handleCloseOportunidad"/>
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
import FileInput from "@/views/components/input/FileInput";
import Dropdown from "@/views/components/input/Dropdown";
import StarToggle from "@/views/components/input/StarToggle";
import { customerCategories } from "@/stub/categories";
import CustomerService from "@/services/CustomerService";
import Alert from "@/views/components/Alert";
import {clearObject, reduceProperties, debounce} from "@/helpers/data";
import {useAlertStore} from "@/stores";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useSourcesStore} from "@/stores/sources";
import {useCustomersStore} from "@/stores/customers";
import CreateOportunidadModal from "@/views/pages/private/deals/modals/CreateOportunidadModal.vue";
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';
// import {VTooltip} from "floating-vue"

const emit = defineEmits(["close-modal"]);

const customerService = new CustomerService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const customersStore = useCustomersStore();
const sourcesStore = useSourcesStore();
const customerId = ref(null);

const formRef = ref(null);
const isLoading = ref(true);
const saveAndCreateOportunidad = ref(null);
const showCreateOportunidadModal = ref(false);

const initialState = {
  // is_company: 1,
  star: false,           
  company_name: null,
  razon_social: null,  
  city: null,           
  name: null,           
  email: null,
  mobile: null,
  category_id: null,
  owner_id: {
    id: authStore.user.id,
    name: authStore.user.name,
  },
  logo: null
};

const form = reactive({...initialState});

const companyName = computed(() => form.company_name)

const companiesFound = ref([])

const rules = {
  company_name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  source_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  mobile: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  email: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  },
  category_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }, 
  owner_id: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const vv$ = useVuelidate(rules, form);

let users = usersStore.userList;

function onSubmit() { 
  let createOportunidad = saveAndCreateOportunidad.value.checked;
  // return;
  alertStore.clear();

  vv$.value.$touch();

  if (vv$.value.$invalid) {
    console.log(vv$);
    return true;
  }

  vv$.value.$reset();

  customerService.handleCreate(
      'create-company', 
      reduceProperties(form, ['category_id', 'owner_id', 'source_id'], 'id')
    ).then(async (res) => {                
    if (res?.status == 200 || res?.status == 201) { 

        Object.assign(form, initialState);
        customersStore.customerList.unshift({
          id: res.data.data.id,
          name: res.data.data.name,
        });

        await customersStore.getCustomerList();
        
        if (createOportunidad) {
          customerId.value = res.data.data.id;
          showCreateOportunidadModal.value = true;
        } else {
          emit('close-modal');
          router.push({name: 'customers.show', params: {id: res.data.data.id}});
        }
        // emit('close-modal');

    }
  })
  
  return false;
}

function onCloseModal() {
  Object.assign(form, initialState);
  emit('close-modal');
}

function handleCloseOportunidad() {
  showCreateOportunidadModal.value = false;
  emit('close-modal');
}

const searchCompanyByName = debounce((searchTerm) => {
  customerService.index({
    'filter[search]': searchTerm,
    limit: 20
  }).then(res => {
    let similarCompanies = [];

    res.data.data.forEach((company) => {

      // console.log(`Similitud entre ${searchTerm} y ${company.company_name} es: ${calcularSimilitud(searchTerm.toLowerCase(), company.company_name.toLowerCase())}`);

      if(calcularSimilitud(searchTerm.toLowerCase(), company.company_name.toLowerCase()) >= 50) {
        similarCompanies.push(company)
      }
    })

    companiesFound.value = similarCompanies
  })
  
}, 400);

function calcularSimilitud(texto1, texto2) {
  // Caso base: si alguna cadena está vacía, la similitud es 0
  if (!texto1.length || !texto2.length) {
    return 0;
  }

  // Matriz para almacenar las distancias de Levenshtein
  const matriz = Array(texto1.length + 1).fill(null).map(() => Array(texto2.length + 1).fill(null));

  // Inicializar la primera fila y columna de la matriz
  for (let i = 0; i <= texto1.length; i++) {
    matriz[i][0] = i;
  }
  for (let j = 0; j <= texto2.length; j++) {
    matriz[0][j] = j;
  }

  // Calcular las distancias de Levenshtein
  for (let i = 1; i <= texto1.length; i++) {
    for (let j = 1; j <= texto2.length; j++) {
      const costoSustitucion = texto1[i - 1] === texto2[j - 1] ? 0 : 1;
      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1, // Eliminación
        matriz[i][j - 1] + 1, // Inserción
        matriz[i - 1][j - 1] + costoSustitucion // Sustitución
      );
    }
  }

  // Calcular la similitud como 1 menos la distancia normalizada
  const distancia = matriz[texto1.length][texto2.length];
  const longitudMaxima = Math.max(texto1.length, texto2.length);
  const similitud = 1 - (distancia / longitudMaxima);

  // Convertir la similitud a porcentaje
  return similitud * 100;
}

watch(companyName, () => {
  if(companyName.value?.length > 3) {
    searchCompanyByName(companyName.value)
  }
  
})

onMounted( async () => {  
  isLoading.value = false;

});

</script>

<style scoped>
/* .search-product-list .vs__dropdown-toggle {
  padding: .45rem !important;
} */

.v-popper--theme-tooltip .v-popper__inner {  
  background-color: theme('colors.gray.500') !important;
  font-size: 1rem;
}
</style>