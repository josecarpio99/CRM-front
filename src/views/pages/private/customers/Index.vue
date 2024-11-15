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
                  :to="{name: 'customers.list'}"
                >
                  <h4 class="text-2xl">{{ trans('global.pages.wallet') }}</h4>
                </router-link>

            </div>
            <div class="basis-3/4">
                <SmartLists
                  :items="smartLists"
                  :routeName="'customers.list'"
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

      <template #default>
          <Table :id="page.id" :key="tableKey" v-if="table" :columns="table.columns" :records="table.records" :pagination="table.pagination" :is-loading="table.loading" @page-changed="onTablePageChange" @action="onTableAction" @sort="onTableSort" @filter="onTableFilter" @cell-change="onCellChange"
          @moved="onColumnMoved" @scroll-end="onScrollEnd" :infinite-scroll="true" :clickeable-row="table.clickeableRow" @row-click="handleRowClick"
          @all-selected="handleAllSelected" :row-class="rowClassFn"
          > 
            <template #cell-name="{item}">
              <router-link 
                class="font-semibold hover:text-blue-700 hover:underline"
                :to="{name: 'customers.show', params: {id: item.id}}"
              >
                <Icon 
                  v-if="item.name" 
                  class="mr-2 text-xl align-middle text-gray-500" 
                  :name="item.is_company ? 'building-o' : 'user-o'" 
                />
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

            <template #cell-star="{item}">
              <StarToggle :modelValue="item.star" :item="item" :key="item.id" class="text-center" iconClass="h-6 w-6" @updated="onStarUpdate" />
            </template>

            <template #cell-mobile="{item}">
              <Icon v-if="item.mobile" class="mr-2 text-xl align-middle" name="mobile-phone" />
              {{ item.mobile }}
            </template>

            <template #cell-owner="{item}">
              <CircleAvatarIcon :avatarUrl="item.owner?.avatar_url" :user="item.owner" />             
              {{ item.owner?.name }}
            </template>

            <template #cell-branch="{item}">                  
              <BranchField :value="item?.owner?.branch" />
            </template>

            <template #cell-category="{item}">                  
              <DealCategoryField :value="item?.category?.name" />
            </template>

            <template #cell-source="{item}">                  
              <SourceField :value="item?.source?.name" />
            </template>

            <template #cell-next_task="{item}">                  
              <NextTaskField 
                :task="item?.lastActiveTask" 
                @submit="(args) => onTaskFormSubmit({record: item, ...args})" 
               />
            </template>

            <template #cell-created_at="{item}">            
                {{ $date(item.created_at).format() }}          
            </template>            

            <template #cell-last_sell_at="{item}">            
                {{ item.latestWonDeal ? $date(item.latestWonDeal.stage_moved_at).format() : '' }}          
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
              <span>{{ trans('customers.labels.total_contacts') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.total }}</span>
            </div>

            <!-- <div class="flex items-center">
              <span>{{ trans('customers.labels.clients') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.totalClients }}</span>
            </div>

            <div class="flex items-center">
              <span>{{ trans('customers.labels.potential_clients') }}</span>
              <span class="ml-2 text-xl font-semibold text-gray-400 tracking-tight">{{ table.pagination.meta.totalPotentialClients }}</span>
            </div> -->

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
import SmartListService from "@/services/SmartListService";
import TaskService from "@/services/TaskService";
import {watch, onMounted, onBeforeMount, reactive, ref, computed } from 'vue';
import {getResponseError, prepareQuery} from "@/helpers/api";
import {toUrl} from "@/helpers/routing";
import {useAlertStore} from "@/stores";
import alertHelpers from "@/helpers/alert";
import $date from "@/helpers/date";
import Icon from "@/views/components/icons/Icon";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Page from "@/views/layouts/Page";
import SmartLists from "@/views/components/SmartLists";
import SmartListModal from "@/views/components/SmartListModal";
import FieldsButton from "@/views/components/FieldsButton";
import Table from "@/views/components/Table";
import Button from "@/views/components/input/Button";
import Avatar from "@/views/components/icons/Avatar";
import Filters from "@/views/components/filters/Filters";
import FiltersRow from "@/views/components/filters/FiltersRow";
import FiltersCol from "@/views/components/filters/FiltersCol";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import StarToggle from "@/views/components/input/StarToggle";
import BranchField from "@/views/components/BranchField";
import SourceField from "@/views/components/SourceField";
import DealCategoryField from "@/views/components/DealCategoryField";
import NextTaskField from "@/views/components/NextTaskField";
import {customerColumns} from "@/stub/columns";
import {customerCategories} from "@/stub/categories";
import { datesFilter, datesSinceFilter } from "@/stub/date";
import { customerStatuses, customerStarStatus, branches } from "@/stub/statuses";
import { PAGE_LIMIT } from "@/stub/constans";
import {clearObject, removeEmpty, debounce} from "@/helpers/data";
// import debounce from "@/helpers/data";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useSourcesStore} from "@/stores/sources";
import toast from '@/helpers/toast';
import dayjs from "dayjs";
import {can} from "@/helpers/permissions";
import {useCustomersStore} from "@/stores/customers";
import { storeToRefs } from 'pinia';

const route = useRoute();
const service = new CustomerService();
const smartListservice = new SmartListService();
const taskService = new TaskService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();
const sourcesStore = useSourcesStore();
const customersStore = useCustomersStore();

const tableKey = ref(1);
const searchInput = ref(null);
const queryHasChange = ref(false);
const showSmartListModal = ref(false);
let users = usersStore.userList;
let sources = sourcesStore.sourceList;
let smartList = null;
let smartLists =  [];

const mainQuery = reactive(customersStore.mainQuery);

// const filterApplied = computed(() => mainQuery.filters.some(filter => !))
const filterApplied = ref(Object.keys(mainQuery.filters).some(key => {
  return mainQuery.filters[key].value;
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
//       name: {
//           value: '',
//           comparison: '='
//       },    
//       company_name: {
//           value: '',
//           comparison: '='
//       }, 
//       source: {
//           value: '',
//           comparison: '='
//       },     
//       owner: {
//           value: '',
//           comparison: '='
//       },
//       star: {
//           value: '',
//           comparison: '='
//       },
//       branch: {
//           value: '',
//           comparison: '='
//       },
//       status: {
//           value: '',
//           comparison: '='
//       },   
//       category_id: {
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
  id: 'list_customers',
  title: '',
  breadcrumbs: [
      {
          name: trans('global.pages.wallet'),
          to: toUrl('/customers'),
          active: true,
      }
  ],  
  toggleFilters: false,
  showFooter: true,
  isLoading: false
});

const table = reactive({ 
  columns: customerColumns,           
  pagination: {
      meta: null,
      links: null,
  },
  actions: {
      
      delete: {
          id: 'delete',
          name: trans('global.actions.delete'),
          icon: "fa fa-trash",
          showName: false,
          danger: true,
      }
  },
  loading: true,  
  clickeableRow: true,
  records: []  
});

// Object.assign(table.columns, structuredClone(customerColumns));

const selectedFields = computed(() => table.columns.filter(item => item.show).map(item => item.key));
const selectedRecords = computed(() => table.records.filter(item => item.selected));
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
              service.delete(params.item.id).then(function (response) {
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
  service
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

function fetchSmartList(id) {
  smartListservice.find(id).then((res) => {
    smartList = res.data.data;
    if (smartList.resource_type != 'customer') {
      router.push({name: 'notFound', params: {pathMatch: 'not-found' }});        
    }
    
    page.title = smartList.name;

    for (let key in mainQuery.filters) {
      if (! smartList.definition.query.filters.hasOwnProperty(key)) {
        smartList.definition.query.filters[key] = {...mainQuery.filters[key]};
      }
    }    
    
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

function onCellChange(payload) {
  let record = table.records.find((item) => item.id == payload.record.id);
  record.logo = null;
  let oldRecord = {...record};

  if (record.category) {
    record.category_id = record.category?.id;    
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
  } else if (payload.key == 'owner') {
    record.owner_id = payload.value.id;
    record.owner = {
        id: payload.value.id,
        name: payload.value.name
    };
  } else if (payload.key == 'status') {
    record.customer_status = payload.value.id;   
  }
   else {
    record[payload.key] = typeof payload.value == 'object' ? payload.value.id : payload.value.toString(); 
  }
  
  service.handleUpdate(page.id, record.id, removeEmpty(record))
    .then((res) => {     
        if (res.response?.status >= 400) {            
            Object.assign(record, oldRecord);
        } else {
          if ((payload.key == 'status')) {
            fetchPage(mainQuery);
          }
        }
    });
}

function onTableFilter({column, value}) {
    if (column.key == 'owner' || column.key == 'status' || column.key == 'branch' || column.key == 'source' || column.key == 'category') {      
      mainQuery.filters[column.key].value = (value) ? value.map(item => item.id).join(',') : null;
    }
    else if (column.key == 'star') {
        mainQuery.filters['star'].value = value.id || null;
    } 
    else if (column.key == 'created_at') {
      if (typeof value == 'string') {
        mainQuery.filters[column.key].value = value || null;        
      } else {
        mainQuery.filters['created_at'].value = value?.id || null;
      }
    } 
    else if (column.key == 'last_sell_at') {
      if (typeof value == 'string') {
        mainQuery.filters[column.key].value = value || null;        
      } else {
        mainQuery.filters['last_sell_at'].value = value?.id || null;
      }
    }
    else if (column.key == 'category') {
        mainQuery.filters['category_id'].value = value || null;
    } 
    else if (column.key == 'days_since_last_won_deal') { 
        mainQuery.filters['days_since_last_won_deal'].value = value?.id || null;
    }
    else if (column.key == 'next_task') { 
        mainQuery.filters['next_task'].value = value.id || null;

    }
    else {
      mainQuery.filters[column.key].value = value || null;
    }

    let _column = table.columns.find(tableColumn => tableColumn.key == column.key);
    
    _column.filter.modelValue = value;
}

function onSmartListSave({name}) {
  smartListservice.store({
    name,
    user_id: authStore.user.id,
    resource_type: 'customer',    
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
      router.push({name: 'customers.list', params: {id: res.data.data.id}})
    }
  });
}

function deleteSmartList() {
  alertHelpers.confirmDanger(function () {
    smartListservice.delete(smartList.id).then(function (response) {
      router.push({name: 'customers.list'});
    });
  })
}

function updateColumnsForSmartList() {  
  const {
    branch: branchFilter, 
    source: sourceFilter,
    star: starFilter, 
    owner: ownerFilter, 
    status: statusFilter, 
    name: nameFilter, 
    category: categoryFilter,
    // category: categoryFilter,
    created_at: createdAtFilter,
    last_sell_at: lastSellAtFilter,
    days_since_last_won_deal: daysSinceLastWonDealFilter,
    next_task: nextTaskFilter
  } = smartList.definition.query.filters;

  if (nameFilter.value) {      
    let nameColumn = table.columns.find(column => column.key == 'name');
    nameColumn.filter.modelValue = nameFilter.value;         
  }

  if (sourceFilter.value) {
    let selectedSources = sourceFilter.value.split(',').map(item => {
      return sources.find(option => option.id == item);
    });
    
    let sourceColumn = table.columns.find(column => column.key == 'source');
    sourceColumn.filter.modelValue = selectedSources;         
  }

  if (starFilter.value) {      
    let starOptionSelected = customerStarStatus.find(option => option.id == starFilter.value);

    let starColumn = table.columns.find(column => column.key == 'star');
    starColumn.filter.modelValue = starOptionSelected;         
  }

  if (nextTaskFilter.value) {      
    let nextTaskOptionSelected = nexTaskStatuses.find(option => option.id == starFilter.value);

    let nextTaskColumn = table.columns.find(column => column.key == 'next_task');
    nextTaskColumn.filter.modelValue = nextTaskOptionSelected;         
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

  if (daysSinceLastWonDealFilter.value) {
    let daysSinceLastWonDealColumn = table.columns.find(column => column.key == 'days_since_last_won_deal');
    daysSinceLastWonDealColumn.filter.modelValue = datesSinceFilter.find(option => option.id == daysSinceLastWonDealFilter.value);         
  }

  if (lastSellAtFilter.value) {
    let lastSellAtColumn = table.columns.find(column => column.key == 'last_sell_at');

    if (lastSellAtFilter.value.includes(',')) {
      lastSellAtColumn.filter.modelValue = lastSellAtFilter.value;      
    } else {
      let selectedDate = datesFilter.find(option => option.id == lastSellAtFilter.value);
      
      lastSellAtColumn.filter.modelValue = selectedDate;
    }
    
  }

  if (categoryFilter.value) {  
    let selectedCategories = categoryFilter.value.split(',').map(item => {
      return customerCategories.find(option => option.id == item);
    });
    
    let categoryIdColumn = table.columns.find(column => column.key == 'category');
    categoryIdColumn.filter.modelValue = selectedCategories;         
  }

  if (ownerFilter.value) {
    let selectedUsers = ownerFilter.value.split(',').map(item => {
      return users.find(option => option.id == item);
    });
    
    let ownerColumn = table.columns.find(column => column.key == 'owner');
    ownerColumn.filter.modelValue = selectedUsers;         
  }

  if (branchFilter.value) {
    let selectedBranches = branchFilter.value.split(',').map(item => {
      return branches.find(option => option.id == item);
    });
    
    let branchColumn = table.columns.find(column => column.key == 'branch');
    branchColumn.filter.modelValue = selectedBranches;         
  }

  if (statusFilter.value) {
    let selectedStatuses = statusFilter.value.split(',').map(item => {
      return customerStatuses.find(option => option.id == item);
    });
    
    let statusColumn = table.columns.find(column => column.key == 'status');
    statusColumn.filter.modelValue = selectedStatuses;         
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
        if (column.key == 'category') {
          mainQuery.filters.category_id.value = '';
        } else {
          mainQuery.filters[column.key].value = '';  
        }
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

function handleRowClick({record}) {
  router.push({name: 'customers.show', params: {id: record.id }});
}

function onStarUpdate({value, item}) {
  item.star = value;
  // let record = table.records.find((item) => item.id == payload.record.id);
  // let oldRecord = {...record};
  // record['star'] = value;

  service.toggleStar(
      item.id
    ).then((res) => {                
    if (res?.status == 200 || res?.status == 201 || res?.status == 204) {
      toast.success();
    }
  })
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
      customers: selectedRecords.value.map(item => item)
    };

    service.bulkDelete(data).then(function (response) {
      toast.success();
      fetchPage(mainQuery);
    });
  })
}

function rowClassFn(item) {

  if (
    item.star &&    
    item.active_opportunities_count == 0 &&
    item.active_quotes_count == 0  &&    
    ( 
      ! item.lastActiveTask || 
      dayjs().isAfter(dayjs(item?.lastActiveTask?.due_at).add(1, 'day')) 
    )
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
    task_type: 'customer',
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

function handleExport() {
  let exportColumns = [];  

  table.columns.forEach(item => {
    if (
      item.key != 'checkall' &&
      item.key != 'star' &&
      item.show
    ) {
      exportColumns.push(item.key);
    }
  });

  let query = prepareQuery(mainQuery);
  query.columns = exportColumns;
  query = new URLSearchParams(query).toString();

  let exportUrl = import.meta.env.VITE_API_URL + '/customer/export';

  if (query) {
    exportUrl += '?' + query;
  }

  window.open(exportUrl, '_blank');
}

function resetFilters() {
  table.columns.forEach((column) => {
    if (column.filterable) {
      column.filter.modelValue = '';      
    }
  });

  Object.keys(mainQuery.filters).forEach(key => {
    mainQuery.filters[key].value = '';
  })

  searchInput.value.$el.querySelector('input').value = mainQuery.filters.search.value;

  tableKey.value++;
}

watch(mainQuery, (newTableState) => {
  filterApplied.value = Object.keys(mainQuery.filters).some(key => {
    return mainQuery.filters[key].value;
  });  
  
  if (smartList) {
    checkIfTableChange();
  }
  fetchPage(mainQuery);
});


onMounted(async () => {
  page.isLoading = true;

  if (!route.params.id) {
    page.title = trans('global.pages.wallet');
  } else {
    await fetchSmartList(route.params.id);
  }

  smartLists = await smartListservice.index({'filter[resource_type]': 'customer'}).then(res => res.data.data);  

  let ownerColumn = table.columns.find(column => column.key == 'owner');
  let sourceColumn = table.columns.find(column => column.key == 'source');

  ownerColumn.filter.options = users;
  ownerColumn.edit.options = users;

  sourceColumn.filter.options = sources;
  sourceColumn.edit.options = sources;

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
