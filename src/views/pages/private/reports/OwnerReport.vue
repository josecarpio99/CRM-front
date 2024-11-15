<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
      <template #filters>
        <div class="py-4 pl-10 bg-white flex items-center gap-4">
          <Dropdown  
            v-if="authStore.isMasterOrDirector()"
            class="flex items-center gap-2 max-w-[16rem]"
            :label="trans('users.labels.branch')"
            name="branch" 
            :options="branches" 
            @input="handleBranchSelect"   
            v-model="branchSelected"            
          /> 

          <TextInput
            class="flex items-center gap-2 w-64"
            type="date" 
            name="since-input" 
            label="Desde:"
            v-model="sinceDate"
            :max="dayjs().format('YYYY-MM-DD')"
            @update:modelValue="setSinceQueryValue"
          />  

          <TextInput
            class="flex items-center gap-2 w-64"
            type="date" 
            name="until-input" 
            label="Hasta:"
            v-model="untilDate"
            :max="dayjs().format('YYYY-MM-DD')"
            @update:modelValue="setUntilQueryValue"
          />  

          <Dropdown  
            class="flex items-center gap-2"
            select-class="w-[15rem]"
            :label="trans('deals.labels.source') + ':'"
            :select-label="'name'"
            name="source" 
            placeholder="Selecciona el Origen"
            :options="sources" 
            @input="handleSourceSelect"   
            v-model="sourceSelected"            
          /> 
        </div>
      </template> 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @sort="onTableSort" @filter="onTableFilter">           

            <template #cell-owner="{item}">
              <CircleAvatarIcon :avatarUrl="item.avatar_url" :user="{
                branch: item.branch
              }" />             
              {{ item.owner }}
            </template>

            <template #cell-venta_neta="{item}">           
              <ValueField :value="item.venta_neta" />
            </template>          

            <template #cell-hit_rate="{item}">           
              {{ (item.hit_rate ? Number(item.hit_rate).toFixed(2) : '0.00') + '%' }}
            </template>

            <template #cell-inversion="{item}">           
              <ValueField :value="item.inversion" />
            </template>

            <template #cell-roa="{item}">           
              {{ item.roa.toFixed(2) }}
            </template>
            
          </Table>
      </template>

      <template v-if="!table.loading" #footer>
        <div class="flex items-center">
          <div class="flex items-center">
            <span class="text-lg text-gray-600 font-semibold">{{ trans('global.labels.resume') }}</span>
          </div>
          <div class="flex ml-14 gap-10 text-sm uppercase w-full lg:w-[950px] text-gray-500 tracking-tight">

            <div class="flex items-center">
              <span>Total</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                {{ table.meta?.total }}
              </span>
            </div>  

            <div class="flex items-center">
              <span>Ganados</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                {{ table.meta?.total_ganados }}
              </span>
            </div>  

            <div class="flex items-center">
              <span>Perdidos</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                {{ table.meta?.total_perdidos }}
              </span>
            </div>  

            <div class="flex items-center">
              <span>Vivos</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                {{ table.meta?.total_vivos }}
              </span>
            </div>  

            <div class="flex items-center">
              <span>Total Venta Neta</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                $ {{ table.meta?.total_venta_neta.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </span>
            </div>        

          </div>
        </div>
      </template>
  </Page>  
</template>

<script setup>
import {trans} from "@/helpers/i18n";
import {watch, onMounted, reactive, ref } from 'vue';
import $date from "@/helpers/date";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import ReportService from "@/services/ReportService";
import Icon from "@/views/components/icons/Icon";
import Table from "@/views/components/Table";
import ValueField from "@/views/components/ValueField";
import BranchField from "@/views/components/BranchField";
import Page from "@/views/layouts/Page";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import dayjs from 'dayjs';
import {useAuthStore} from "@/stores/auth";
import {useSourcesStore} from "@/stores/sources";

const authStore = useAuthStore();

const reportService = new ReportService();
const sinceDate = dayjs().startOf('month').format('YYYY-MM-DD');
const untilDate = dayjs().format('YYYY-MM-DD');
const branchSelected = ref({id: null, label: 'TODAS'});
const sourceSelected = ref({
  id: 2,
  name: 'Publicidad - Guardia'
});
let sources = useSourcesStore().sourceList;

const branches = ref([
  {
    id: null,
    label: 'TODAS',
  },  
  {
    id: 'NY',
    label: 'NY',
  },  
  {
    id: 'FL',
    label: 'FL',
  },  
  {
    id: 'TX',
    label: 'TX',
  },  
  {
    id: 'NC',
    label: 'NC',
  }
]);

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {        
      since: {
          value: sinceDate,
          comparison: '='
      },       
      until: {
          value: untilDate,
          comparison: '='
      },       
      branch: {
          value: '',
          comparison: '='
      },
      source: {
          value: 2,
          comparison: '='
      },      
  }
});

const page = reactive({
  id: 'owner_report',
  title: trans('global.pages.resume_by_branch'),
  toggleFilters: false,
  showFooter: true,
  isLoading: false
});

const table = reactive({ 
  columns: [   
    {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      sorteable: true
    },
    {
      key: 'total',
      label: trans('total'),
      show: true,
      sorteable: true
    },
    {
      key: 'ganados',
      label: 'Ganados',
      show: true,
      sorteable: true
    },
    {
      key: 'perdidos',
      label: 'Perdidos',
      show: true,
      sorteable: true
    },
    {
      key: 'vivos',
      label: 'Vivos',
      show: true,
      sorteable: true   

    },
    {
      key: 'hit_rate',
      label: 'Hit Rate',
      show: true,
      sorteable: true
    },
    {
      key: 'venta_neta',
      label: 'Venta Neta',
      show: true,
      sorteable: true
    },
    {
      key: 'inversion',
      label: 'Inversión',
      show: true,    
      sorteable: true
    },
    {
      key: 'roa',
      label: 'ROA',
      show: true,
      sorteable: true
    },
  ],           
  pagination: {
      meta: null,
      links: null,
  },
  meta: null,
  loading: true,
  records: null  
});

function onTableFilter({column, value}) {
    if (column.key == 'branch') {
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : null;
    } else {
      mainQuery.filters[column.key].value = value || null;
    }

    let _column = table.columns.find(tableColumn => tableColumn.key == column.key);
    
    _column.filter.modelValue = value;
}

function onTableSort(params) {
  mainQuery.sort = params;
}

function setSinceQueryValue(value) {
  console.log(value);
  mainQuery.filters.since.value = value;
}

function setUntilQueryValue(value) {
  console.log(value);
  mainQuery.filters.until.value = value;
}

function handleBranchSelect(item) {
  mainQuery.filters.branch.value = branchSelected.value?.id || null;
}

function handleSourceSelect(item) {
  mainQuery.filters.source.value = sourceSelected.value?.id || null;
}


function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  reportService
      .owner(query)
      .then((response) => {
          table.records = response.data.data;
          table.meta = response.data.meta;
          table.loading = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          table.loading = false;
      });
}

watch(mainQuery, (newTableState) => {
  fetchPage(mainQuery);
});

onMounted(async () => { 
  fetchPage(mainQuery);
});


</script>