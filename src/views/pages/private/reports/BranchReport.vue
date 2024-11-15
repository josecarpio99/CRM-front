<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
      <template #filters>
        <div class="py-4 pl-10 bg-white flex items-center gap-4">
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

            <template #cell-branch="{item}">                  
              <BranchField :value="item.branch" />
            </template>

            <template #cell-venta_neta="{item}">           
              <ValueField :value="item.venta_neta" />
            </template>

            <template #cell-inversion="{item}">           
              <ValueField :value="item.inversion" />
            </template>

            <template #cell-hit_rate="{item}">           
              {{ item.hit_rate.toFixed(2) + '%' }}
            </template>

            <template #cell-roa="{item}">           
              {{ '$ ' + item.roa?.toFixed(2) }}
            </template>

            
          </Table>
      </template>

      <template v-if="!table.loading" #footer>
        <div class="flex items-center">
          <div class="flex items-center">
            <span class="text-lg text-gray-600 font-semibold">{{ trans('global.labels.resume') }}</span>
          </div>
          <div class="flex ml-14 gap-10 text-sm uppercase w-full lg:w-[850px] text-gray-500 tracking-tight">

            <div class="flex items-center">
              <span>Total Venta Neta</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                $ {{ table.meta?.total_venta_neta.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </span>
            </div>

            <div class="flex items-center">
              <span>Total Inversión</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                $ {{ table.meta?.total_inversion.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
              </span>
            </div>

            <div class="flex items-center">
              <span>Total Venta Neta <span class="font-semibold text-lg">-</span> Total Inversión</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                $ {{ table.meta?.total_neto.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
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
import { branches } from "@/stub/statuses";
import TextInput from "@/views/components/input/TextInput";
import dayjs from 'dayjs';
import {numberFormatter} from "@/helpers/data";
import {useSourcesStore} from "@/stores/sources";
import Dropdown from "@/views/components/input/Dropdown";

const reportService = new ReportService();
const sinceDate = dayjs().startOf('month').format('YYYY-MM-DD');
const untilDate = dayjs().format('YYYY-MM-DD');
const sourceSelected = ref({
  id: 2,
  name: 'Publicidad - Guardia'
});

let sources = useSourcesStore().sourceList;

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
      source: {
          value: 2,
          comparison: '='
      },       
  }
});

const page = reactive({
  id: 'branch_report',
  title: trans('global.pages.global_resume'),
  toggleFilters: false,
  showFooter: true,
  isLoading: false
});

const table = reactive({ 
  columns: [   
    {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,     
    },
    {
      key: 'total',
      label: trans('total'),
      show: true,     
    },
    {
      key: 'ganados',
      label: 'Ganados',
      show: true,     
    },
    {
      key: 'perdidos',
      label: 'Perdidos',
      show: true,     
    },
    {
      key: 'vivos',
      label: 'Vivos',
      show: true,     
    },
    {
      key: 'hit_rate',
      label: 'Hit Rate',
      show: true,     
    },
    {
      key: 'venta_neta',
      label: 'Venta Neta',
      show: true,     
    },
    {
      key: 'inversion',
      label: 'Inversión',
      show: true,     
    },
    {
      key: 'roa',
      label: 'ROA',
      show: true,     
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
  mainQuery.filters.since.value = value;
}

function setUntilQueryValue(value) {
  mainQuery.filters.until.value = value;
}

function handleSourceSelect(item) {
  mainQuery.filters.source.value = sourceSelected.value?.id || null;
}

function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  reportService
      .branch(query)
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