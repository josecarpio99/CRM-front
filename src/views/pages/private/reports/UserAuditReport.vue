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
            class="flex items-center gap-2 max-w-[16rem] w-full"
            :label="trans('users.labels.branch')"
            name="branch" 
            :options="branches" 
            @input="handleBranchSelect"   
            v-model="branchSelected"            
          /> 

          <!-- <TextInput
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
          />   -->
        </div>
      </template> 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @sort="onTableSort" @filter="onTableFilter">           

            <template #cell-owner="{item}">
              <CircleAvatarIcon :avatarUrl="item.avatar_url" :user="{
                branch: item.branch
              }" />             
              {{ item.name }}
            </template>
            
            <template #cell-branch="{item}">                  
              <BranchField :value="item.branch" />
            </template>
            
          </Table>
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

const authStore = useAuthStore();

const reportService = new ReportService();
const sinceDate = dayjs().startOf('month').format('YYYY-MM-DD');
const untilDate = dayjs().format('YYYY-MM-DD');
const branchSelected = ref({id: null, label: 'TODAS'});

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
          value: '',
          comparison: '='
      },       
      until: {
          value: '',
          comparison: '='
      },       
      branch: {
          value: '',
          comparison: '='
      },       
  }
});

const page = reactive({
  id: 'branch_report_report',
  title: trans('global.pages.user_audit'),
  toggleFilters: false,
  showFooter: false,
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
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
    },   
    {
      key: 'active_deals',
      label: 'Activos',
      show: true,     
      sorteable: true
    },
    {
      key: 'warning_deals',
      label: 'Rojo',
      show: true,     
      sorteable: true
    },     
  ],           
  pagination: {
      meta: null,
      links: null,
  },
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

function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  reportService
      .userAudit(query)
      .then((response) => {
          table.records = response.data.data;
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