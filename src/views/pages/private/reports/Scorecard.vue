<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @sort="onTableSort" @filter="onTableFilter">   
            
            <template #cell-name="{item}">             
              <CircleAvatarIcon :avatarUrl="item.avatar_url" :user="item" />              
              {{ item.name }}
            </template>

            <template #cell-branch="{item}">                  
              <BranchField :value="item.branch" />
            </template>

            <template #cell-opportunities_sum_value="{item}">           
              <ValueField :value="item.opportunities_sum_value" />
            </template>

            <template #cell-quotations_sum_value="{item}">
              <ValueField :value="item.quotations_sum_value" />

            </template>

            <template #cell-deals_sum_value="{item}">
              <ValueField :value="item.deals_sum_value" />
            </template>
            
          </Table>
      </template>

      <!-- <template v-if="!table.loading" #footer>
        <div class="flex items-center">
          <div class="flex items-center">
            <span class="text-lg text-gray-600 font-semibold">{{ trans('global.labels.resume') }}</span>
          </div>
          <div class="flex ml-14 gap-10 text-sm uppercase w-full lg:w-[550px] text-gray-500 tracking-tight">
            <div class="flex items-center">
              <span>{{ trans('deals.labels.total_deals') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.total }}</span>
            </div>
            <div class="flex items-center">
              <span>{{ trans('deals.labels.value_total') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                ${{ numberFormatter.format(table.pagination.meta.valueSum) }}
              </span>
            </div>
            <div class="flex items-center">
              <span>{{ trans('deals.labels.value_avg') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">
                ${{ numberFormatter.format(table.pagination.meta.valueAvg) }}
              </span>
            </div>
          </div>
        </div>
      </template> -->
  </Page>  
</template>

<script setup>
import {trans} from "@/helpers/i18n";
import {watch, onMounted, reactive, ref } from 'vue';
import $date from "@/helpers/date";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import ScorecardService from "@/services/ScorecardService";
import Icon from "@/views/components/icons/Icon";
import Table from "@/views/components/Table";
import ValueField from "@/views/components/ValueField";
import BranchField from "@/views/components/BranchField";
import Page from "@/views/layouts/Page";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import { branches } from "@/stub/statuses";

const scorecardService = new ScorecardService();

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {
      name: {
          value: '',
          comparison: '='
      },    
      branch: {
          value: '',
          comparison: '='
      },
      opportunities_sum_value: {
          value: '',
          comparison: '='
      },       
      quotations_sum_value: {
          value: '',
          comparison: '='
      },       
      deals_sum_value: {
          value: '',
          comparison: '='
      },       
  }
});

const page = reactive({
  id: 'list_scorecard',
  title: trans('global.menu.scorecard'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const table = reactive({ 
  columns: [
    {
      key: 'name',
      label: trans('users.header.seller'),
      show: true,
      filterable: true,
      sorteable: true,
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
      filterable: true,
      filter: {
        modelValue: '',
        type: 'multiselect',
        options: branches,
      }
    },
    {
      key: 'opportunities_sum_value',
      label: trans('users.header.opportunities_estimated'),
      show: true,
      sorteable: true
    },
    {
      key: 'quotations_sum_value',
      label: trans('users.header.active_quotations'),
      show: true,
      sorteable: true
    },
    {
      key: 'deals_sum_value',
      label: trans('users.header.deals_sum_value'),
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

function fetchPage(params) {
  table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  scorecardService
      .index(query)
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