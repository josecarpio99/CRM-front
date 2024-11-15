<template>
  <Page 
    :title="page.title" 
    :breadcrumbs="page.breadcrumbs" 
    :actions="page.actions" 
    @action="onPageAction"
    :showFooter="page.showFooter"
    :displayTopMenu="true"
    :is-loading="page.isLoading"
    :title-editable="smartList ? true : false"
    :show-go-back="Boolean(route.params.id)"
    @title-change="updateSmartListName"
  >    
      <template #top-menu> 
        <div class="flex gap-4">
            <div class="basis-1/4">
                <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.work_list') }}</h4>
                
                <router-link 
                  class="p-6 border-2 block rounded-sm cursor-pointer hover:shadow-xl"
                  :class="{'border-blue-300': !route.params.id}"
                  :to="{name: 'deals.cotizados.list'}"
                >
                  <h4 class="text-2xl">{{ trans('global.pages.cotizado') }}</h4>
                </router-link>

            </div>
            <div class="basis-3/4">
                <SmartLists
                  :items="smartLists"
                  :routeName="'deals.cotizados.list'"
                />                
            </div>
        </div>
      </template>

      <template #page-actions>
        <div class="flex items-center">
          <Button
            class="mr-2"
            icon="fa fa-file-excel-o"
            theme="outline"
            :label="trans('global.actions.export')"
            @click="handleExport"
          />

          <FieldsButton
            :columns="table.columns"
            @update="onFieldsChange"
          />
        </div>
      </template>

      <template #beside-title v-if="!authStore.isDirector()">
        <div v-if="!page.isLoading" class="flex ml-4">
          <Button
            v-if="!smartList"
            class="mb-2"
            :label="trans('global.buttons.save_smart_list')"
            @click="showSmartListModal = true"
          />

          <template v-else >
            <div v-if="queryHasChange">
              <Button
                class="mr-3"
                theme="transparent"
                :label="trans('global.buttons.discard_changes')"
                @click="discarChanges"
              />

              <Button
                class="mr-2"
                theme="submit"
                :label="trans('global.buttons.save')"
                @click="updateSmartList"
              />
            </div>

            <VDropdown 
              placement="right"
            >
              <button>
                <Icon class="text-gray-500 align-sub text-lg hover:text-gray-700 cursor-pointer px-2" name="ellipsis-v" />
              </button>
  
              <template #popper>
                <ul>
                  <li 
                    class="py-2 px-4 cursor-pointer text-red-500 hover:bg-gray-100"
                    @click="deleteSmartList"
                  >
                    {{ trans('global.actions.delete') }}
                  </li>
                </ul>
              </template>
            </VDropdown>
          </template>
          
        </div>
      </template>

      <template #under-top>
        <div class="hidden lg:grid grid-cols-11 bg-white" v-if="authStore.isDirector() && table.pagination.meta">

          <div class="grid grid-cols-2 col-span-3 bg-white place-content-center px-4 py-6 border-r-2">
            
            <div class="flex flex-col items-center">
              <span class="font-bold text-lg text-gray-600">Total Cotizado</span>
              <span class="font-semibold text-2xl text-gray-500">{{ '$' + table.pagination.meta.valueSum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-bold text-lg text-gray-600">Número Cotizaciones</span>
              <span class="font-semibold text-2xl text-gray-500">{{ table.pagination.meta.total }}</span>
            </div>
           
          </div>          

          <div class="grid grid-cols-2 col-span-2 place-content-center px-4 py-6 border-r-2">

            <div class="flex flex-col items-center">
              <span class="font-bold text-sm text-gray-700">De las cuales AGS.</span>
              <span class="font-bold text-lg text-gray-500">{{ '$' + table.pagination.meta.branch.AGS.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-bold text-sm text-gray-700">Número Cotizaciones</span>
              <span class="font-bold text-lg text-gray-500">{{ table.pagination.meta.branch.AGS.count }}</span>
            </div>
           
          </div>

          <div class="grid grid-cols-2 col-span-2 place-content-center px-4 py-6 border-r-2">

          <div class="flex flex-col items-center">
            <span class="font-bold text-sm text-gray-700">De las cuales CDMX.</span>
            <span class="font-bold text-lg text-gray-500">{{ '$' + table.pagination.meta.branch.CDMX.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="font-bold text-sm text-gray-700">Número Cotizaciones</span>
            <span class="font-bold text-lg text-gray-500">{{ table.pagination.meta.branch.CDMX.count }}</span>
          </div>

          </div>

          <div class="grid grid-cols-2 col-span-2 place-content-center px-4 py-6 border-r-2">

            <div class="flex flex-col items-center">
              <span class="font-bold text-sm text-gray-700">De las cuales MTY.</span>
              <span class="font-bold text-lg text-gray-500">{{ '$' + table.pagination.meta.branch.MTY.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-bold text-sm text-gray-700">Número Cotizaciones</span>
              <span class="font-bold text-lg text-gray-500">{{ table.pagination.meta.branch.MTY.count }}</span>
            </div>
           
          </div>

          <div class="grid grid-cols-2 col-span-2 place-content-center px-4 py-6">

            <div class="flex flex-col items-center">
              <span class="font-bold text-sm text-gray-700">De las cuales QRO.</span>
              <span class="font-bold text-lg text-gray-500">{{ '$' + table.pagination.meta.branch.QRO.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="font-bold text-sm text-gray-700">Número Cotizaciones</span>
              <span class="font-bold text-lg text-gray-500">{{ table.pagination.meta.branch.QRO.count }}</span>
            </div>
           
          </div>

        </div>
        <!-- <div class="flex justify-center flex-col bg-white px-2 py-4" v-if="authStore.isDirector() && table.pagination.meta">          
          <div class="flex ml-14 gap-6 text-sm uppercase  text-gray-600 tracking-tight">
            <div class="flex items-center">
              <span class="">Total cotizado</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">{{ '$' + table.pagination.meta.valueSum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex items-center">
              <span class="">Número cotizaciones</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ table.pagination.meta.total }}
              </span>
            </div>            
          </div>

          <div class="flex ml-14 gap-6 text-sm uppercase  text-gray-600 tracking-tight">
            <div class="flex items-center">
              <span class="">De las cuales AGS</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">{{ '$' + table.pagination.meta.branch.AGS.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex items-center">
              <span class="">Número cotizaciones</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ table.pagination.meta.branch.AGS.count }}
              </span>
            </div>           
          </div>

          <div class="flex ml-14 gap-6 text-sm uppercase  text-gray-600 tracking-tight">
            <div class="flex items-center">
              <span class="">De las cuales CDMX</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">{{ '$' + table.pagination.meta.branch.CDMX.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex items-center">
              <span class="">Número cotizaciones</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ table.pagination.meta.branch.CDMX.count }}
              </span>
            </div>           
          </div>

          <div class="flex ml-14 gap-6 text-sm uppercase  text-gray-600 tracking-tight">
            <div class="flex items-center">
              <span class="">De las cuales MTY</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">{{ '$' + table.pagination.meta.branch.MTY.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex items-center">
              <span class="">Número cotizaciones</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ table.pagination.meta.branch.MTY.count }}
              </span>
            </div>           
          </div>

          <div class="flex ml-14 gap-6 text-sm uppercase  text-gray-600 tracking-tight">
            <div class="flex items-center">
              <span class="">De las cuales QRO</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">{{ '$' + table.pagination.meta.branch.QRO.sum.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}</span>
            </div>
            <div class="flex items-center">
              <span class="">Número cotizaciones</span>
              <span class="ml-2 text-xl font-semibold text-gray-500 tracking-tight">
                {{ table.pagination.meta.branch.QRO.count }}
              </span>
            </div>           
          </div>

        </div> -->
      </template>

      <template #filters>
        <div class="py-4 pl-10 flex justify-between bg-white">

          <div>
            <div v-if="selectedRecords.length > 0 && !table.loading" class="flex items-center">
              <div class="flex text-lg text-gray-600 gap-1">
                <span class="text-theme-500 font-semibold">{{ selectedRecords.length }} </span>
                <span>/</span>
                <span>{{ table.pagination.meta.total }}</span>
              </div>
  
              <div class="ml-6">
                <Button
                  v-if="can('view:delete')"
                  theme="danger"
                  :label="trans('global.actions.delete')"
                  @click="onBulkDelete"
                />

                <Button
                  theme="outline_success"
                  class="ml-2"
                  :label="trans('deals.labels.update_won')"
                  @click="handleBulkStatusUpdate('ganado')"
                />

                <Button
                  class="ml-2"
                  theme="outline_danger"
                  :label="trans('deals.labels.update_lost')"
                  @click="handleBulkStatusUpdate('perdido')"
                />
              </div>
            </div>
  
            <div v-else >
              <TextInput
                class="flex items-center gap-2 w-64"
                type="text" 
                name="global-search" 
                label="Buscar"
                ref="searchInput"
                @update:modelValue="setSearchQueryValue"
              />            
            </div>

          </div>

          <div class="pr-8">
            <Button
              :disabled="! filterApplied"
              :label="trans('global.buttons.clean_filters')"
              @click="resetFilters"
            />
          </div>           
        </div>
      </template>

      <template #default>
     

          <Table :id="page.id" :key="tableKey" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange" @moved="onColumnMoved" @scroll-end="onScrollEnd" :infinite-scroll="true" :clickeable-row="table.clickeableRow" @row-click="handleRowClick" :row-class="rowClassFn"
          @all-selected="handleAllSelected"
          >

            <template #cell-deal="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'deals.cotizados.show', params: {id: item.id}}"
              >
                <Icon v-if="item.name" class="mr-2 text-gray-600 text-xl align-middle" name="dollar" />
                {{ item.name }}
              </router-link>
            </template>       
            
            <template #cell-checkall="{item}">
              <div class="text-center">
                <input 
                  class="" 
                  type="checkbox" 
                  @click.stop="false"
                  v-model="item.selected"
                  @change="handleSelectedRecord(item)"
                /> 
              </div>
            </template>

            <template #cell-value="{item}">
              <ValueField :value="item.value" />
            </template>

            <template #cell-stage="{item}">
              <PipelineStage :stage-id="item.stage.id" />
            </template>

            <template #cell-creator="{item}">             
              <CircleAvatarIcon :avatarUrl="item.creator?.avatar_url" :user="item.creator" />              
              {{ item.creator?.name }}
            </template>

            <template #cell-owner="{item}">             
              <CircleAvatarIcon :avatarUrl="item.owner?.avatar_url" :user="item.owner" />               
              {{ item.owner?.name }}
            </template>

            <template #cell-status="{item}">                  
              <DealStatusField :value="item.status" />
            </template>

            <template #cell-source="{item}">                  
              <SourceField :value="item?.source?.name" />
            </template>

            <template #cell-branch="{item}">                  
              <BranchField :value="item?.owner?.branch" />
            </template>

            <template #cell-next_task="{item}">                  
              <NextTaskField 
                :task="item?.lastActiveTask" 
                @submit="(args) => onTaskFormSubmit({record: item, ...args})" 
               />
            </template>

            <template #cell-closed_at="{item}">            
                {{ 
                  item.stage_moved_at && item.status != 'en proceso'
                    ? $date(item.stage_moved_at).format() 
                    : null 
                }}          
            </template>

            <template #cell-created_at="{item}">            
                {{ $date(item.created_at).format() }}          
            </template>

            <template #cell-category="{item}">                  
              <DealCategoryField :value="item?.customer?.category?.name" />
            </template>

            <template #cell-estimated_close_date_range="{item}">                  
              <EstimatedCloseDateRangeField :value="item.estimated_close_date_range" />
            </template>

            <template #cell-estimated_close_date="{item}" v-if="authStore.isDirector()">
              <span
               class="inline-block rounded-xl px-2"
               :class="getCloseDateClass(item.estimated_close_date)"
              >
                {{ calculateCloseDate(item.estimated_close_date) }}
              </span>                
            </template>

            <template #cell-quote="{item}">
              <div v-if="item.quotes.length > 0">
                <Icon 
                  class="text-red-500 text-2xl" 
                  name="file-pdf-o" 
                />
              </div>
              <div v-else class="flex items-center gap-2">
                <Icon 
                  class="text-red-500 text-2xl" 
                  name="exclamation-circle" 
                />
                No existe
              </div>
            </template>

            <template #cell-profitability_format="{item}">
              <div v-if="item.media_profitability.length > 0">
                <Icon 
                  class="text-green-500 text-2xl" 
                  name="file-excel-o" 
                />
              </div>
              <div v-else class="flex items-center gap-2">
                <Icon 
                  class="text-red-500 text-2xl" 
                  name="exclamation-circle" 
                />
                No existe
              </div>
            </template>

          </Table>
      </template>

      <template v-if="!table.loading" #footer>
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
              <span>{{ trans('deals.labels.quoted_value') }}</span>
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
      </template>
  </Page>

  <SmartListModal 
    :modalActive="showSmartListModal" 
    @close-modal="showSmartListModal = false" 
    @save-modal="onSmartListSave"
  />
</template>

<script setup>

import _ from "lodash";
import {useRoute} from "vue-router";
import router from "@/router";
import {trans} from "@/helpers/i18n";
import CustomerService from "@/services/CustomerService";
import DealService from "@/services/DealService";
import TaskService from "@/services/TaskService";
import SmartListService from "@/services/SmartListService";
import {watch, onMounted, defineComponent, reactive, ref, defineAsyncComponent, computed } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import $date from "@/helpers/date";
import dayjs from "dayjs";
import Icon from "@/views/components/icons/Icon";
import Page from "@/views/layouts/Page";
import SmartLists from "@/views/components/SmartLists";
import SmartListModal from "@/views/components/SmartListModal";
import FieldsButton from "@/views/components/FieldsButton";
import Table from "@/views/components/Table";
import PipelineStage from "@/views/components/PipelineStage";
import Button from "@/views/components/input/Button";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import ValueField from "@/views/components/ValueField";
import SourceField from "@/views/components/SourceField";
import BranchField from "@/views/components/BranchField";
import NextTaskField from "@/views/components/NextTaskField";
import DealCategoryField from "@/views/components/DealCategoryField";
import DealStatusField from "@/views/components/DealStatusField";
import EstimatedCloseDateRangeField from "@/views/components/EstimatedCloseDateRangeField";
import {cotizadoColumns} from "@/stub/columns";
import { PAGE_LIMIT } from "@/stub/constans";
import { branches, dealStatus } from "@/stub/statuses";
import {customerCategories} from "@/stub/categories";
import {clearObject, removeEmpty, numberFormatter, debounce} from "@/helpers/data";
import { datesFilter } from "@/stub/date";
import {useUsersStore} from "@/stores/users";
import {useSourcesStore} from "@/stores/sources";
import {useAuthStore} from "@/stores/auth";
import toast from '@/helpers/toast';
import {dealCategories} from "@/stub/categories";
import {can} from "@/helpers/permissions";
import {useCotizadoStore} from "@/stores/cotizado";

const route = useRoute();
const dealService = new DealService();
const taskService = new TaskService();
const customerService = new CustomerService();
const smartListservice = new SmartListService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const sourcesStore = useSourcesStore();
const authStore = useAuthStore();
const cotizadoStore = useCotizadoStore();

const tableKey = ref(1);
const searchInput = ref(null);
const queryHasChange = ref(false);
const showSmartListModal = ref(false);
let users = usersStore.userList;
let sources = sourcesStore.sourceList;
let smartList = null;
let smartLists = [];

const mainQuery = reactive(cotizadoStore.mainQuery);

const filterApplied = ref(Object.keys(mainQuery.filters).some(key => {
  if (key == 'type') {
    return false;
  } else {
    return mainQuery.filters[key].value;s
  }
}));
// const mainQuery = reactive({
//   page: 1,
//   limit: PAGE_LIMIT,
//   search: '',
//   sort: '',
//   filters: {
//       search: {
//           value: '',
//           comparison: '='
//       },  
//       type: {
//           value: 'cotizado',
//           comparison: '='
//       },    
//       name: {
//           value: '',
//           comparison: '='
//       },    
//       source: {
//           value: '',
//           comparison: '='
//       },
//       stage: {
//           value: '',
//           comparison: '='
//       },  
//       owner: {
//           value: '',
//           comparison: '='
//       },
//       creator: {
//           value: '',
//           comparison: '='
//       },
//       branch: {
//           value: '',
//           comparison: '='
//       },
//       value: {
//           value: '',
//           comparison: '='
//       },
//       category: {
//           value: '',
//           comparison: '='
//       },
//       status: {
//           value: 'en proceso',
//           comparison: '='
//       },
//       closed_at: {
//           value: '',
//           comparison: '='
//       },
//       created_at: {
//           value: '',
//           comparison: '='
//       }
//   }
// });

const page = reactive({
  id: 'list_deals',
  title: trans('deals.menu.cotizados'),
  breadcrumbs: [
      {
          name: trans('global.pages.cotizados'),
          to: toUrl('/deals'),
          active: true,
      }
  ],  
  toggleFilters: false,
  showFooter: !authStore.isDirector(),
  isLoading: false
});

const table = reactive({ 
  columns: cotizadoColumns,           
  pagination: {
      meta: null,
      links: null,
  },
  loading: true,
  clickeableRow: true,
  records: []  
})  

// Object.assign(table.columns, structuredClone(cotizadoColumns));

const selectedFields = computed(() => table.columns.filter(item => item.show).map(item => item.key));
const selectedRecords = computed(() => table.records.filter(item => item.selected))
const setSearchQueryValue = debounce(value => mainQuery.filters.search.value = value, 400);

function onTableSort(params) {
  mainQuery.sort = params;
}

function onTablePageChange(page) {
  mainQuery.page = page;
}

function onTableAction(params) {
  switch (params.action.id) {
      case 'delete':
          alertHelpers.confirmDanger(function () {
            dealService.delete(params.item.id).then(function (response) {
                  fetchPage(mainQuery);
              });
          })
          break;
  }
}

function onPageAction(params) {           
  switch (params.action.id) {
      case 'filters':
          page.toggleFilters = !page.toggleFilters;
          break;
  }
}

function onFiltersClear() {
  let clonedFilters = mainQuery.filters;
  for(let key in clonedFilters) {
      clonedFilters[key].value = '';
  }
  mainQuery.filters = clonedFilters;
}

function fetchPage(params) {
  // table.records = [];
  table.loading = true;
  let query = prepareQuery(params);
  dealService
      .index(query)
      .then((response) => {
          table.records = response.data.data;
          table.pagination.meta = response.data.meta;
          table.pagination.links = response.data.links;
          table.loading = false;
          page.isLoading = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          table.loading = false;
          page.isLoading = false;
      });
}

function onCellChange(payload) {
  let record = table.records.find((item) => item.id == payload.record.id);
  let oldRecord = {...record};

  if (record.category) {
    record.category_id = record.category?.id;    
  }

  if (record.customer?.category) {
    record.customer.category_id = record.customer.category?.id;    
  }

  if (payload.key == 'category') {
    record.category_id = payload.value.id;
    record.category = {
        id: payload.value.id,
        name: payload.value.label
    };
  } else if (payload.key == 'source') {
    record.source_id = payload.value.id;
    record.source = {
        id: payload.value.id,
        name: payload.value.name
    };  
  } else if (payload.key == 'stage') {
    record.deal_pipeline_stage_id = payload.value.id;
    record.stage = {
        id: payload.value.id,
        name: payload.value.name
    }; 
  } else if (payload.key == 'owner') {
    record.owner_id = payload.value.id;
    record.owner = {
        id: payload.value.id,
        name: payload.value.name
    };
  }
   else {
    record[payload.key] = typeof payload.value == 'object' ? payload.value.id : payload.value.toString(); 
  }
  
  if (false) {
    customerService.handleUpdate(page.id, record.customer.id, removeEmpty(record.customer))
      .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        }
    });
  } else {
    dealService.handleUpdate(page.id, record.id, removeEmpty(record))
      .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        }
    });
  }
}

function onTableFilter({column, value}) {
    if (column.key == 'owner' || column.key == 'source' || column.key == 'stage' || column.key == 'branch' || column.key == 'status' || column.key == 'creator' || column.key == 'category') {
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : null;
    } else if (column.key == 'created_at' || column.key == 'closed_at') {
      if (typeof value == 'string') {
        mainQuery.filters[column.key].value = value || null;        
      } else {
        mainQuery.filters[column.key].value = value?.id || null;
      }
    } else if (column.key == 'value') {     
      let newValue = (!value.minValue && !value.maxValue) ? null : `${value.minValue ?? 0},${value.maxValue ?? 0}`; 
      mainQuery.filters['value'].value = newValue;
    } else {
        mainQuery.filters[column.key].value = value || null;
    }

    let _column = table.columns.find(tableColumn => tableColumn.key == column.key);
    
    _column.filter.modelValue = value;
}

function fetchSmartList(id) {
  smartListservice.find(id).then((res) => {
    smartList = res.data.data;
    if (smartList.resource_type != 'cotizado') {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }});        
    }
    
    page.title = smartList.name;

    Object.assign(mainQuery, structuredClone(smartList.definition.query));

    setColumnsForSmartList();
    updateColumnsForSmartList(); 

  })
  .catch(error =>{
    console.log(error);
    if (error.response?.status == 404) {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }})
    }
  })
}

function updateColumnsForSmartList() {
  const {
    owner: ownerFilter, 
    creator: creatorFilter, 
    branch: branchFilter,
    source: sourceFilter, 
    status: statusFilter, 
    name: nameFilter,
    created_at: createdAtFilter,
    closed_at: closedAtFilter,
    value: valueFilter,
    category: categoryFilter,
  } = smartList.definition.query.filters;

  if (categoryFilter.value) {  
    let selectedCategories = categoryFilter.value.split(',').map(item => {
      return dealCategories.find(option => option.id == item);
    });
    
    let categoryColumn = table.columns.find(column => column.key == 'category');
    categoryColumn.filter.modelValue = selectedCategories;         
  }

  if (nameFilter.value) {      
    let nameColumn = table.columns.find(column => column.key == 'name');
    nameColumn.filter.modelValue = nameFilter.value;         
  }

  if (valueFilter.value) {      
    let [minValue, maxValue] = valueFilter.value.split(',');

    let valueColumn = table.columns.find(column => column.key == 'value');
    valueColumn.filter.modelValue = {
      minValue,
      maxValue
    };    
  }

  if (createdAtFilter.value) { 
    let createdAtColumn = table.columns.find(column => column.key == 'created_at');

    if (createdAtFilter.value.includes(',')) {
      createdAtColumn.filter.modelValue = createdAtFilter.value;      
    } else {
      let selectedDate = datesFilter.find(option => option.id == createdAtFilter.value);
      
      createdAtColumn.filter.modelValue = selectedDate;
    }        
  }

  if (closedAtFilter.value) {
    let closedAtColumn = table.columns.find(column => column.key == 'closed_at');
      
    if (closedAtFilter.value.includes(',')) {
      closedAtColumn.filter.modelValue = closedAtFilter.value;      
    } else {
      let selectedDate = datesFilter.find(option => option.id == closedAtFilter.value);
      
      closedAtColumn.filter.modelValue = selectedDate;
    }
  } 

  if (sourceFilter.value) {
    let selectedSources = sourceFilter.value.split(',').map(item => {
      return sources.find(option => option.id == item);
    });
    
    let sourceColumn = table.columns.find(column => column.key == 'source');
    sourceColumn.filter.modelValue = selectedSources;         
  }

  if (ownerFilter.value) {
    let selectedUsers = ownerFilter.value.split(',').map(item => {
      return users.find(option => option.id == item);
    });
    
    let ownerColumn = table.columns.find(column => column.key == 'owner');
    ownerColumn.filter.modelValue = selectedUsers;         
  } 

  if (creatorFilter.value) {
    let selectedUsers = creatorFilter.value.split(',').map(item => {
      return users.find(option => option.id == item);
    });
    
    let creatorColumn = table.columns.find(column => column.key == 'creator');
    creatorColumn.filter.modelValue = selectedUsers;         
  }
  
  if (statusFilter.value) {
    let selectedStatus = statusFilter.value.split(',').map(item => {
      return dealStatus.find(option => option.id == item);
    });
    
    let statusColumn = table.columns.find(column => column.key == 'status');
    statusColumn.filter.modelValue = selectedStatus;         
  }

  if (branchFilter.value) {
    let selectedBranches = branchFilter.value.split(',').map(item => {
      return branches.find(option => option.id == item);
    });
    
    let branchColumn = table.columns.find(column => column.key == 'branch');
    branchColumn.filter.modelValue = selectedBranches;         
  }
}

function setColumnsForSmartList() {
  let remainingColumns = table.columns
    .filter(column => !smartList.definition.fields.includes(column.key))

  remainingColumns.forEach(column => column.show = false);

  let selectedColumns = smartList.definition.fields.map(field => {
      return table.columns.find(column => column.key == field)
    })

  selectedColumns.forEach(column => column.show = true);

  table.columns = selectedColumns.concat(remainingColumns);
}


function onSmartListSave({name}) {
  smartListservice.store({
    name,
    user_id: authStore.user.id,
    resource_type: 'cotizado',    
    definition: {
      'query': {
        ...mainQuery,
        page: 1
      },
      'fields': selectedFields.value
    } 
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      router.push({name: 'deals.cotizados.list', params: {id: res.data.data.id}})
    }
  });
}

function deleteSmartList() {
  alertHelpers.confirmDanger(function () {
    smartListservice.delete(smartList.id).then(function (response) {
      router.push({name: 'deals.cotizados.list'});
    });
  })
}

function discarChanges() {
  Object.assign(mainQuery, structuredClone(smartList.definition.query));
  setColumnsForSmartList();
  updateColumnsForSmartList();
  tableKey.value++;
}

function updateSmartList(updateQueryHasChange = true, updateDefinition = true) {
  if (updateQueryHasChange) {
    queryHasChange.value = false;    
  }

  smartListservice.update(smartList.id, {
    name: smartList.name,
    user_id: smartList.user_id,
    resource_type: smartList.resource_type,    
    definition: updateDefinition ? {
      'query': {...mainQuery},
      'fields': selectedFields.value
    } : smartList.definition
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      smartList = res.data.data;
      toast.success();
    }
  });
}

function updateSmartListName({value}) {
  smartList.name = value;
  page.title = value;
  updateSmartList(false, false);  
}

function onColumnMoved({columns}) { 
  let remainingColumns = table.columns.filter(column => !column.show);

  let selectedColumns = columns.map(columnMoved => {
    return table.columns.find(column => column.key == columnMoved.key);
  })
  
  table.columns = selectedColumns.concat(remainingColumns);
  // table.columns = columns;
  if (smartList) {
    checkIfTableChange();
  }
  tableKey.value++;
}

function onFieldsChange({columns}) {
  table.columns = columns;
  if (smartList) {
    checkIfTableChange();
  }
  resetQueryOfRemovedColumns();
  tableKey.value++;
}

function resetQueryOfRemovedColumns() {
  table.columns.forEach(column => {
    if (!column.show) {
      if (mainQuery.filters[column.key]) {
        // if (column.key == 'category') {
        //   mainQuery.filters.category_id.value = '';
        // } else {
        //   mainQuery.filters[column.key].value = '';  
        // }
        mainQuery.filters[column.key].value = '';  

        column.filter.modelValue = null;
      }
    }   
  });
}

function checkIfTableChange() {
  queryHasChange.value = (
    _.isEqual(mainQuery, smartList.definition.query) &&
    _.isEqual(selectedFields.value, smartList.definition.fields)
  )
    ? false 
    : true;
}

function onScrollEnd() {
  if (mainQuery.limit < table.pagination.meta.total) {
    mainQuery.limit += PAGE_LIMIT;  
  }
}

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

function handleRowClick({record}) {
  router.push({name: 'deals.cotizados.show', params: {id: record.id }});
}

function rowClassFn(item) {
  if (item.status != 'en proceso') return '';

  if (
    ! item.lastActiveTask || 
    dayjs().isAfter(dayjs(item?.lastActiveTask?.due_at).add(1, 'day'))
  ) 
  {
    return ['bg-red-100', 'border-y-2', 'border-red-300'];
  }   
}

function onTaskFormSubmit({content, due_at, owner, record}) {
  taskService.store({
    content: content,
    due_at: due_at,
    owner_id: owner.id,
    task_type: 'deal',
    id: record.id,
    user_id: authStore.user.id
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      let item = table.records.find((item) => item.id == record.id);
      if (! item.lastActiveTask) {
        item.lastActiveTask = res.data.data;
      }
    }
  });
}

function handleSelectedRecord(item) {
}

function handleAllSelected(params) {
  table.records.forEach(item => {
    item.selected = params.selected;
  });
}

async function onBulkDelete() {
  alertHelpers.confirmDanger(async function () {
    page.isLoading = true;

    let data = {
      deals: selectedRecords.value.map(item => item)
    };

    dealService.bulkDelete(data).then(function (response) {
      toast.success();
      fetchPage(mainQuery);
    });
  })
}

function handleBulkStatusUpdate(status) {
  alertHelpers.confirmDanger(async function () {
    page.isLoading = true;

    let data = {
      status: status,
      deals: selectedRecords.value.map(item => item)
    };

    dealService.massStatusUpdate(data).then(function (response) {
      toast.success();
      fetchPage(mainQuery);
    });
  })
}

function handleExport() {
  let exportColumns = [];  

  table.columns.forEach(item => {
    if (
      item.key != 'checkall' &&
      item.show
    ) {
      exportColumns.push(item.key);
    }
  });

  let query = prepareQuery(mainQuery);
  query.columns = exportColumns;
  query = new URLSearchParams(query).toString();

  let exportUrl = import.meta.env.VITE_API_URL + '/deal/export';

  if (query) {
    exportUrl += '?' + query;
  }

  window.open(exportUrl, '_blank');
}

function resetFilters() {
  table.columns.forEach((column) => {
    if (column.filterable) {
      if (column.key == 'value') {
        column.filter.modelValue = {
          minValue: null,
          maxValue: null
        };     
        
      } else {
        column.filter.modelValue = '';
      }
    }
  });

  Object.keys(mainQuery.filters).forEach(key => {
    if (key != 'type') {
      mainQuery.filters[key].value = '';      
    }
  })

  searchInput.value.$el.querySelector('input').value = mainQuery.filters.search.value;

  tableKey.value++;
}

watch(mainQuery, (newTableState) => {
  filterApplied.value = Object.keys(mainQuery.filters).some(key => {
    if (key == 'type') {
      return false;
    } else {
      return mainQuery.filters[key].value;s
    }
  })

  if (smartList) {
    checkIfTableChange();
  }
  fetchPage(mainQuery);
});

onMounted(async () => {
  page.isLoading = true;
  if (!route.params.id) {
    page.title = trans('deals.menu.cotizados');
    if (authStore.isDirector()) {
      const directorFields = ['name', 'branch', 'owner', 'source', 'category', 'next_task', 'value'];

      table.columns.forEach(column => {
        column.show = false;
      });

      let selectedColumns = directorFields.map(field => {
        let column = table.columns.find(column => column.key == field);
        column.show = true;
        return column;
      });

      let remainingColumns = table.columns.filter(column => !column.show);      
      
      table.columns = selectedColumns.concat(remainingColumns);
      
      mainQuery.sort = {
        column: 'value',
        direction: 'desc'
      }
    }
  } else {
    await fetchSmartList(route.params.id);
  }

  smartLists = await smartListservice.index({'filter[resource_type]': 'cotizado'}).then(res => res.data.data);  


  let ownerColumn = table.columns.find(column => column.key == 'owner');
  let sourceColumn = table.columns.find(column => column.key == 'source');
  let creatorColumn = table.columns.find(column => column.key == 'creator');
  
  creatorColumn.filter.options = users;

  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;

  sourceColumn.filter.options = sources;
  sourceColumn.edit.options = sources;

  if (! can('view:created_by')) {
    table.columns = table.columns.filter(column => column.key != 'creator');
  }

  // table.columns.forEach(column => {
  //   if (column.filterable) {
  //     onTableFilter({column, value: column.filter.modelValue})
  //   }
  // });

  searchInput.value.$el.querySelector('input').value = mainQuery.filters.search.value;

  page.isLoading = false;
  fetchPage(mainQuery);
});

</script>
