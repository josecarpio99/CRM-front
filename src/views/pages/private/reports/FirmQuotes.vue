<template>
  <Page 
    :title="page.title" 
    :breadcrumbs="page.breadcrumbs"
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  > 
      <template #default>
          <Table :id="page.id" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading">

            <template #cell-deal="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'deals.cotizados.show', params: {id: item.id}}"
              >
                <Icon v-if="item.name" class="mr-2 text-gray-600 text-xl align-middle" name="dollar" />
                {{ item.name}}
              </router-link>
            </template>

            <template #cell-value="{item}">
              <span class="text-gray-600 font-bold">
                {{ '$' + item.value?.toLocaleString('en-US') }}
              </span>
            </template>

            <template #cell-owner="{item}">             
              <CircleAvatarIcon :avatarUrl="item.owner?.avatar_url" :user="item.owner" />              
              {{ item.owner?.name }}
            </template>

            <template #cell-category="{item}">          
              <span
               class="inline-block text-white rounded-xl px-2"
               :class="{
                'bg-orange-400' : item.category?.id == 5,
                'bg-blue-400' : item.category?.id == 6,
                'bg-green-400' : item.category?.id == 7
               }"
              >
                {{ item.category?.name }}
              </span>
            </template>

            <template #cell-has_project_manager="{item}">                  
              {{ item.has_project_manager ? 'Si' : 'No' }}
            </template>

            <!-- <template #cell-estimated_close_date="{item}">
              <span
               class="inline-block rounded-xl px-2"
               :class="getCloseDateClass(item.estimated_close_date)"
              >
                {{ calculateCloseDate(item.estimated_close_date) }}
              </span>                
            </template> -->

            <template #cell-created_at="{item}">            
                {{ $date(item.created_at).format() }}          
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
import dayjs from "dayjs";
import {dealColumns} from "@/stub/columns";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import DealService from "@/services/DealService";
import Icon from "@/views/components/icons/Icon";
import Table from "@/views/components/Table";
import Page from "@/views/layouts/Page";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";

const dealService = new DealService();

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: {
    column: 'value',
    direction: 'desc'
  },
  filters: {
      type: {
          value: 'cotizado',
          comparison: '='
      },    
      name: {
          value: '',
          comparison: '='
      },    
      source: {
          value: '',
          comparison: '='
      },    
      owner: {
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
  id: 'list_deals',
  title: trans('deals.menu.firm_quotes'),
  breadcrumbs: [
      {
          name: trans('global.pages.cotizados'),
          to: toUrl('/deals'),
          active: true,
      }
  ],  
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const fields = ['deal', 'branch', 'owner', 'estimated_close_date_range', 'value'];

const valueColumn = dealColumns.find(column => column.key == 'value');
valueColumn.label = trans('deals.header.amount_quoted')

const columns = fields.map(field => dealColumns.find(column => column.key == field))
    .map(column => {
      return {
        ...column,
        show: true,
        sorteable: false,
        filterable: false,
        editable: false,
      }
    });

const table = reactive({ 
  columns: columns,           
  pagination: {
      meta: null,
      links: null,
  },
  loading: true,
  records: null  
});

function fetchPage(params) {
  table.records = [];
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

onMounted(async () => { 
  fetchPage(mainQuery);
});

function calculateCloseDate(date) {
  if(!date) return 'No rellenado';

  if (dayjs(date).isBefore(dayjs())) {

    return 'Vencida';

  } else if (dayjs(date).isBefore(dayjs().endOf('month'))) {

    return 'Próximo a cierre';

  } else if (dayjs(date).isBefore(dayjs().add(1, 'month').endOf('month'))) {

    return 'Cercal del cierre'; 

  } else {

    return 'Lejos del cierre';

  }
}

function getCloseDateClass(date) {
  if(!date) return '';

  if (dayjs(date).isBefore(dayjs())) {

    return ['bg-red-500', 'text-white'];

  } else if (dayjs(date).isBefore(dayjs().endOf('month'))) {

    return ['bg-orange-400', 'text-white'];

  } else if (dayjs(date).isBefore(dayjs().add(1, 'month').endOf('month'))) {

    return ['bg-yellow-400', 'text-white']; 

  } else {

    return ['bg-blue-400', 'text-white'];;

  }
}



</script>