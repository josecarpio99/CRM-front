<template>
  <div 
    class="w-full shadow border-b border-gray-200 mb-8 sm:rounded-lg overflow-auto table-wrapper"
    ref="tableWrapperEl"
  >
    <table class="w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
       
        <draggable 
          
          :list="columnsData"
          tag="tr" 
          item-key="columns"
          @change="onColumnChange"
        >          
          <template #item="{ element: column }" >
            <TableHeader  
              :column="column" 
              :currentSort="currentSort"
              :is-loading="isLoading"
              @sort-change="onSortChange" 
              @filter-change="onFilterChange"  
              @all-selected="onAllSelected"            
            >
              <template #popup-filter>
                <slot :column="column" :name="'column-filter-' + column.key">
                </slot> 
              </template>
            </TableHeader>

          </template>
          <th v-if="actions" scope="col"
            class="align-middle px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            <slot name="actions">{{ trans('global.actions.name') }}</slot>
          </th>
        </draggable>
        
      </thead>
      <tbody v-if="records && records.length" class="bg-white row-divider">
        <tr 
        v-for="(record, i) in records" 
        @click="handleRowClick(record)"
        :class="[{
          'pointer-events-none': isEditing,
          'hover:bg-gray-100': clickeableRow,
          'cursor-pointer': clickeableRow
        }, rowClassHandle(record)]"
        >        

          <template v-for="(column, j) in columnsData">
            <TableCell
                    :editable="column.editable" 
                    :cellvalue="getCellValue(record, column)"
                    :record="record" 
                    :type="column.edit?.type"
                    :options="column.edit?.options"
                    :selectLabel="column.edit?.optionsLabel"
                    :cellkey="column.key" 
                    @changed="onCellChange"
                    @blurred="onCellBlur"
                    @edit-click="onCellEditClick"
                >                        
                <slot :item="record" :name="'cell-' + column.key">
                  {{ getCellLabel(record, column) }}
                </slot> 
            </TableCell>            
          </template>
        
          <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot :name="'actions-' + j" v-for="(action, j) in actions">
              <router-link v-if="action.hasOwnProperty('to') && action.to" :to="getActionPage(action, record)"
                :class="getActionClass(action)" :title="action.name">
                <i v-if="action.icon" :class="action.icon"></i>
                <span v-if="(!action.hasOwnProperty('showName') || action.showName)" v-html="action.name"></span>
              </router-link>
              <a v-else :class="getActionClass(action)" @click="onActionClick({ action: action, item: record })"
                :title="action.name">
                <i v-if="action.icon" :class="action.icon"></i>
                <span v-if="(!action.hasOwnProperty('showName') || action.showName)" v-html="action.name"></span>
              </a>
            </slot>
          </td>

        </tr>

        <tr v-if="$props.isLoading">
          <td :colspan="columnsLength" class="pt-10 pb-6 text-center">
            <template>
              <Spinner :text-new-line="true"></Spinner>
            </template>
          </td>
        </tr>

      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="columnsLength" class="pt-10 pb-6 text-center">
            <template v-if="$props.isLoading">
              <Spinner :text-new-line="true"></Spinner>
            </template>
            <template v-else>
              {{ trans('global.phrases.no_records') }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- <Pager v-if="lastPage && !$props.isLoading" :page-count="lastPage" :value="currentPage" @input="onPagerInput" /> -->
</template>

<script setup>
import { trans } from "@/helpers/i18n";
import { computed, defineComponent, reactive, ref } from "vue";
import draggable from 'vuedraggable';
import Pager from "@/views/components/Pager";
import Spinner from "@/views/components/icons/Spinner";
import TableHeader from "@/views/components/table/TableHeader";
import TableCell from "@/views/components/table/TableCell";
import {getPropByString} from '@/helpers/data';
import { useInfiniteScroll } from '@vueuse/core'

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  columns: {
    type: [Array, Object],
    default: [],
  },
  records: {
    type: [Array, Object],
    default: [],
  },
  actions: {
    type: [Array, Object, Boolean],
    default: false,
  },
  pagination: {
    type: Object,
    default: {
      meta: {
        current_page: 1,
        last_page: 1,
      },
      links: null,
    },
  },
  clickeableRow: {
    type: Boolean,
    default: false
  },
  rowClass: {
    type: Function
  },
  infiniteScroll: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['pageChanged', 'action', 'sort', 'filter', 'cell-change', 'moved', 'scrollEnd', 'row-click', 'all-selected']);

const isEditing = ref(false);

const currentSort = reactive({ column: null, direction: 'ASC' });
const columnsData = reactive(props.columns.filter(column => column.show));
const tableWrapperEl = ref(null);

const columnsLength = computed(() => {
  let total = 0;
  for (let i in props.columns) {
    total++;
  }
  if (props.actions) {
    total++;
  }
  return total;
})

function getPaginationMeta(key) {
  let value = null;
  if (props.pagination) {
    if (props.pagination.hasOwnProperty('meta') && props.pagination.meta) {
      if (props.pagination.meta.hasOwnProperty(key)) {
        value = props.pagination.meta[key];
      }
    }
  }
  return value;
}

function getActionPage(action, record) {
  if (!action.hasOwnProperty('to')) {
    return '#';
  }
  for (let key in record) {
    if (action.to.indexOf('{' + key + '}') !== -1) {
      return action.to.replace('{' + key + '}', record[key]);
    }
  }
  return action.to;
}

function getActionClass(action) {

  let classes = 'uppercase cursor-pointer text-lg';
  if (Object.keys(props.actions).length > 1) {
    classes += ' mr-3';
  }

  if (action.hasOwnProperty('danger') && action.danger) {
    classes += ' text-danger-400'
  }

  return classes;
}

function onPagerInput(page) {
  emit('pageChanged', page);
}

function onActionClick(params) {
  emit('action', params)
}

function onSortChange({column, direction}) {
  if (currentSort.column === column && currentSort.direction === direction) {
    clearSorting();
  } else {
    currentSort.column = column;
    currentSort.direction = direction;
  }
  emit('sort', { column: currentSort.column, direction: currentSort.direction });
}

function onFilterChange(params) {
  emit('filter', params);
}

function onCellChange(params) {
  emit('cell-change', params);
}

function onAllSelected(params) {
  emit('all-selected', params);
}

function onCellBlur() {
  isEditing.value = false;
}

function onCellEditClick() {
  isEditing.value = true;
}

function handleRowClick(record) {
  if (!isEditing.value && props.clickeableRow) {
    emit('row-click', {record});
  }
}

function sortControlClasses(column, direction) {
  if (currentSort.column === column && currentSort.direction === direction) {
    return 'text-theme-500'
  }
  return '';
}

function clearSorting() {
  currentSort.column = null;
  currentSort.direction = null;
}

function getCellValue(record, column) {
  let isSelectType = false;
  let cellLabel = column.hasOwnProperty('cellLabel') ? column.cellLabel : column.key;

  if (column.hasOwnProperty('edit') && column.editable) {
    if (['list', 'select', 'multiselect'].includes(column.edit.type)) {
      isSelectType = true;
    }
  }  

  if (isSelectType) {
    let cellKey = column.hasOwnProperty('cellKey') ? column.cellKey : column.key;
    let cellLabel= column.hasOwnProperty('cellLabel') ? column.cellLabel : column.key;

    let optionsKey = column.edit?.optionsKey ?? 'id';
    let optionsLabel = column.edit?.optionsLabel ?? 'label';

    return {[optionsKey]: getPropByString(record, cellKey), [optionsLabel]: getPropByString(record, cellLabel)}
  }

  return getPropByString(record, cellLabel);
}

function getCellLabel(record, column) {
  let cellLabel = column.hasOwnProperty('cellLabel') ? column.cellLabel : column.key;
  return getPropByString(record, cellLabel) ?? '';
}

function onColumnChange(value) {
  emit('moved', {columns: columnsData});
}

function rowClassHandle(item) {
  if (props.rowClass) {
    if (typeof props.rowClass === 'function') {
      // console.log(props.rowClass(item));
      return props.rowClass(item);  
    }
  }
}

const currentPage = computed(() => {
  return getPaginationMeta('current_page');
})

const lastPage = computed(() => {
  return getPaginationMeta('last_page')
})

  
if (props.infiniteScroll) {  
  useInfiniteScroll(
    tableWrapperEl,
    () => {
      if (!props.isLoading && props.records.length > 0) {
        emit('scrollEnd');
      }
    },
    { 
      distance: 20,
      interval: 300 
    }
  );
}


</script>
<style>
.table-wrapper {
  max-height: calc(100vh - 240px - 61.5px);
}

.sort-arrows {
  font-size: 1.2em;
  line-height: 0.7;
  width: 30px;
}

.sort-arrows i.fa {
  line-height: 0.1;
}

.sort-arrows .fa {
  font-size: 15px;
}

.row-divider > :not([hidden]):not(.border-b-2):not(.border-y-2) {
  @apply border-y-[1px];
  @apply border-gray-200;
}
</style>
