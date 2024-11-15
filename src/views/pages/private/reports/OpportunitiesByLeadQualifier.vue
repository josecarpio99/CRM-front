<template>
  <Page 
      :title="page.title" 
      :showFooter="page.showFooter"
      :is-loading="page.isLoading"
    > 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @sort="onTableSort" @filter="onTableFilter" :infinite-scroll="true" :clickeable-row="table.clickeableRow" @row-click="handleRowClick" @scroll-end="onScrollEnd">   

            <template #cell-deal="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'deals.oportunidades.show', params: {id: item.id}}"
              >
                <Icon v-if="item.name" class="mr-2 text-gray-500 text-xl align-middle" name="sign-in" />
                {{ item.name}}
              </router-link>
            </template>

            <!-- <template #cell-value="{item}">        
              <ValueField :value="item.value" />
            </template> -->

            <template #cell-owner="{item}">             
              <CircleAvatarIcon :avatarUrl="item.owner?.avatar_url" :user="item.owner" />              
              {{ item.owner?.name }}
            </template>

            <template #cell-source="{item}">                  
              <SourceField :value="item?.source?.name" />
            </template>

            <template #cell-branch="{item}">                  
              <BranchField :value="item?.owner?.branch" />
            </template>

            <template #cell-next_task="{item}">                  
              <NextTaskField :task="item?.lastActiveTask" />
            </template>

            <template #cell-response_time="{item}">                  
              <!-- <span
                v-if="! item.confirmed_at"
                class="bg-gray-300 text-gray-600 font-bold p-2 rounded-lg"
              >
                En espera...
              </span> -->
              <Countup
                v-if="! item.confirmed_at"
                class="text-[1rem]" 
                :date="item.created_at" 
              />
              <ResponseTimeField 
                v-else
                :value="item.confirmed_at" 
                :compDate="item.created_at"
              />
            </template>

            <template #cell-category="{item}">                  
              <DealCategoryField :value="item?.customer?.category?.name" />
            </template>

            <template #cell-estimated_close_date_range="{item}">                  
              <EstimatedCloseDateRangeField :value="item.estimated_close_date_range" />
            </template>

            <template #cell-created_at="{item}">            
                {{ $date(item.created_at).format() }}          
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
import DealService from "@/services/DealService";
import Icon from "@/views/components/icons/Icon";
import Table from "@/views/components/Table";
import Page from "@/views/layouts/Page";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import { branches } from "@/stub/statuses";
import ValueField from "@/views/components/ValueField";
import SourceField from "@/views/components/SourceField";
import BranchField from "@/views/components/BranchField";
import NextTaskField from "@/views/components/NextTaskField";
import DealCategoryField from "@/views/components/DealCategoryField";
import EstimatedCloseDateRangeField from "@/views/components/EstimatedCloseDateRangeField";
import ResponseTimeField from "@/views/components/ResponseTimeField";
import Countup from "@/views/components/Countup";
import router from "@/router";
import {dealCategories} from "@/stub/categories";
import { datesFilter } from "@/stub/date";
import { PAGE_LIMIT } from "@/stub/constans";
import {useSourcesStore} from "@/stores/sources";
import {useUsersStore} from "@/stores/users";

const dealService = new DealService();
const sourcesStore = useSourcesStore();
const usersStore = useUsersStore();

let sources = sourcesStore.sourceList;
let users = usersStore.userList;

const mainQuery = reactive({
  page: 1,
  limit: PAGE_LIMIT,
  search: '',
  sort: '',
  filters: { 
      name: {
          value: '',
          comparison: '='
      },    
      created_by_lead_qualifier: {
          value: true,
          comparison: '='
      },    
      source: {
          value: '',
          comparison: '='
      },    
      stage: {
          value: '',
          comparison: '='
      },    
      owner: {
          value: '',
          comparison: '='
      },
      branch: {
          value: '',
          comparison: '='
      },
      value: {
          value: '',
          comparison: '='
      },
      created_at: {
          value: '',
          comparison: '='
      }
  }
});

const page = reactive({
  id: 'assigned_leads',
  title: trans('global.menu.assigned_leads'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const table = reactive({ 
  columns: [
  // {
  //     key: 'deal',
  //     label: trans('deals.labels.title'),
  //     show: true,
  //     locked: true,
  // },   
  {
      key: 'name',
      label: trans('deals.labels.title'),
      show: true,
      locked: true,
      editable: false,
      sorteable: false,
      filterable: false,
      filter: {
        modelValue: '',
        type: 'input'            
      }
  },        
  {
      key: 'branch',
      label: trans('users.labels.branch'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      },
      cellLabel: 'owner.branch'
  },  
  {
      key: 'owner',
      label: trans('global.labels.owner'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: false,
      editable: false,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: users,
        optionsLabel: 'name'
      },
      cellKey: 'owner.id',
      cellLabel: 'owner.name'
  },       
  {
      key: 'source',
      label: trans('global.labels.source'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: false,
      editable: false,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: sources,
        optionsLabel: 'name'
      },
      cellKey: 'source.id',
      cellLabel: 'source.name'
  }, 
  {
      key: 'category',
      label: trans('deals.labels.category'),
      show: true,
      locked: false,
      sorteable: false,
      filterable: false,
      editable: false,
      filter: {
        modelValue: '',
        type: 'select',
        options: dealCategories
      }
  },  
  {
      key: 'response_time',
      label: trans('deals.labels.response_time'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false            
  }, 
  // {
  //     key: 'value',
  //     label: trans('deals.labels.value_estimated'),
  //     show: true,
  //     locked: false,
  //     editable: false,
  //     sorteable: false,
  //     filterable: false,
  //     filter: {
  //       modelValue: {
  //         minValue: null,
  //         maxValue: null
  //       },
  //       type: 'range'
  //     },       
  // }, 
  {
      key: 'created_at',
      label: trans('global.labels.created_at'),
      show: true,
      locked: false,
      editable: false,
      sorteable: false,
      filterable: false,
      filter: {
        modelValue:'',
        type: 'select',
        options: datesFilter
      }        
  },         
],           
  pagination: {
      meta: null,
      links: null,
  },
  loading: true,
  records: null,
  clickeableRow: true 
});

function onTableSort(params) {
  mainQuery.sort = params;
}

function onTableFilter({column, value}) {
    if (column.key == 'owner' || column.key == 'source' || column.key == 'stage' || column.key == 'branch') {
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : null;
    } else if (column.key == 'created_at') {
      mainQuery.filters['created_at'].value = value?.id || null;
    } else if (column.key == 'category') {
      mainQuery.filters['category_id'].value = value || null;
    } else if (column.key == 'value') {  
      let newValue = (!value.minValue && !value.maxValue) ? null : `${value.minValue ?? 0},${value.maxValue ?? 0}`;    
      mainQuery.filters['value'].value = newValue;
    } 
    else {
        mainQuery.filters[column.key].value = value || null;
    }

    let _column = table.columns.find(tableColumn => tableColumn.key == column.key);
    
    _column.filter.modelValue = value;
}

function onScrollEnd() {
  if (mainQuery.limit < table.pagination.meta.total) {
    mainQuery.limit += PAGE_LIMIT;  
  }
}

function handleRowClick({record}) {
  router.push({name: 'deals.oportunidades.show', params: {id: record.id }});
}

function fetchPage(params) {
  table.loading = true;
  let query = prepareQuery(params);
  dealService
      .index(query)
      .then((response) => {
          table.records = response.data.data;
          table.pagination.meta = response.data.meta;
          table.pagination.links = response.data.links;
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