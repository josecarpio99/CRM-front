<template>
  <th scope="col" v-if="column.key == 'checkall'"
    class="align-middle  group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-200 sticky top-0 bg-gray-50"
  >
    <input 
      class="" 
      type="checkbox"
      :checked="allSelected"
      v-model="allSelected"
      @click="selectAll"
    />
  </th>
  <th scope="col" v-else
    class="align-middle  group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 sticky top-0 border-gray-200'" 
    :class="[
      column.class, 
      filterIsClean() ? ['bg-gray-50'] : ['bg-gray-200']
      ]"
    >

    <div class="flex">

      <div class="leading-loose inline-block whitespace-nowrap">{{ column.label }}</div>

      <div class="sort-arrows inline-block text-center align-text-bottom" v-if="column.sorteable">
        <span @click.prevent="onSortChange(column.key, 'asc')" :class="sortControlClasses(column.key, 'asc')"
          class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
            class="fa fa-caret-up"></i></span>
        <span @click.prevent="onSortChange(column.key, 'desc')" :class="sortControlClasses(column.key, 'desc')"
          class="w-full block cursor-pointer font-normal hover:font-bold focus:font-bold hover:text-theme-600 focus:text-theme-600 dark:hover:text-theme-500 dark:focus:text-theme-500"><i
            class="fa fa-caret-down"></i></span>
      </div>

      <div 
        v-if="column.filterable"
        v-show="!props.isLoading"
        class="inline-block float-right ml-auto group-hover:visible"
        :class="{invisible: filterIsClean() || !props.isLoading}"
      >
        <span @click="handleClick"  class="flex mt-[1px] ml-4 text-base cursor-pointer hover:text-gray-700">
          <i class="fa fa-filter"></i>
        </span>
      </div>

    </div>

    <VDropdown
      v-if="column.filterable" 
      :auto-size="false"
      :triggers="[]"
      :shown="showInput"
      :prevent-overflow="false"
      :placement="'auto'"
      :popperClass="`table-header ${['select', 'multiselect', 'radio'].includes(column.filter.type) ? 'with-select' : ''}`"
      @hide="handleBlur"
     >
        <template #popper>  
          
          <slot name="popup-filter">
            <div class="flex justify-between border-b-[1px] pb-2 mb-4">
              <Button 
                theme="outline"
                class=""
                :label="trans('global.actions.filter')"
                :disabled="filterIsClean()"
                @click="filter"
              />
  
              <Button 
                theme="info"
                class="ml-auto"
                :label="trans('global.buttons.clean_filter')"
                :disabled="filterIsClean()"
                @click="cleanFilter"
              />
            </div>
  
            <slot name="popup-content">
              <TextInput 
                v-if="column.filter.type == 'input'"
                class="mb-4" type="text" name="filter" v-model="inputValue" 
                :label="$t('global.labels.filter')"
              />
    
              <Toggle 
                v-if="column.filter.type == 'toggle'"
                class="mb-4" name="filter" v-model="inputValue" 
              />
    
              <div           
                v-if="column.filter.type == 'range'"
              >
                <span class="mb-2 block text-center text-gray-500">{{ column.label }}</span>
                <div class="flex justify-between gap-2">
                  <TextInput 
                    class="mb-4" type="text" name="minValue" v-model="inputValue.minValue"
                  />       
      
                  <TextInput 
                    class="mb-4" type="text" name="maxValue" v-model="inputValue.maxValue"
                  />
                </div>
    
              </div>

              <div           
                v-if="column.filter.type == 'date-select-range'"
              >
                <Toggle v-model="showDateRange" 
                  class="mb-2" 
                  label="Filtrar por rango" 
                />

                <div v-if="showDateRange" class="bg-white flex flex-col gap-4">
                  <TextInput
                    class=""
                    type="date" 
                    name="since-input" 
                    label="Desde:"
                    v-model="sinceDate"
                    :max="dayjs().format('YYYY-MM-DD')"
                    @update:modelValue="setDateValue"
                  />  

                  <TextInput
                    class=""
                    type="date" 
                    name="until-input" 
                    label="Hasta:"
                    v-model="untilDate"
                    :max="dayjs().format('YYYY-MM-DD')"
                    @update:modelValue="setDateValue"
                  />  
                </div> 
                
                <Dropdown  
                  v-else
                  :open="true"
                  :options="column.filter.options"
                  :selectLabel="column.filter.optionsLabel"
                  name="type" 
                  v-model="inputValue" 
                  :label="$t('global.labels.filter')"
                  :showLabel="true"
                  :showPointer="false"
                  :placeholder="'Buscar...'"
                  :multiple="column.filter.type == 'multiselect'"      
                /> 
              </div>
    
              <Dropdown  
                v-else-if="['select', 'multiselect', 'radio'].includes(column.filter.type)"
                :open="true"
                :options="column.filter.options"
                :selectLabel="column.filter.optionsLabel"
                name="type" 
                v-model="inputValue" 
                :label="$t('global.labels.filter')"
                :showLabel="true"
                :showPointer="false"
                :placeholder="'Buscar...'"
                :multiple="column.filter.type == 'multiselect'"
    
              /> 
  
            </slot>
          </slot>



        </template>
    </VDropdown>
  </th>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from "vue";
import Dropdown from "@/views/components/input/Dropdown";
import TextInput from "@/views/components/input/TextInput";
import Toggle from "@/views/components/input/Toggle";
import Button from "@/views/components/input/Button";
import {trans} from "@/helpers/i18n";
import dayjs from 'dayjs';

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  currentSort: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['sort-change', 'filter-change', 'update:modelValue', 'all-selected']);

const showInput = ref(false);
const allSelected = ref(false);
const inputValue = props.column.filter?.type == 'range' ?
                  reactive(props.column.filter?.modelValue) :
                  ref(props.column.filter?.modelValue); 

const showDateRange = ref(false);
const sinceDate = ref(null);
const untilDate = ref(null);

// watch(inputValue, (newValue) => {  
//   inputValue.value = newValue;   
//   emit('filter-change', {column: props.column, value: newValue});
// });

function onSortChange(column, direction) {
  emit('sort-change', {column, direction})
}

function sortControlClasses(column, direction) {
  if (props.currentSort.column === column && props.currentSort.direction === direction) {
    return 'text-theme-500'
  }
  return '';
}

function handleClick()
{
  showInput.value = true;  
}

function handleBlur()
{        
  showInput.value = false;
}

function filterIsClean() {
  if (props.column.filter?.type == 'range') {
    return !inputValue.minValue && !inputValue.maxValue;
  }

  if (Array.isArray(inputValue.value)) {
    return inputValue.value.length == 0;
  }

  return !inputValue.value;
}

function filter() {
  let value = props.column.filter?.type == 'range' ? inputValue : inputValue.value;
  emit('filter-change', {column: props.column, value: value});
  showInput.value = false;
}

function cleanFilter() {
  if (props.column.filter?.type == 'range') {
    inputValue.minValue = null;
    inputValue.maxValue = null;
  } else {
    inputValue.value = '';
  }

  sinceDate.value = null;
  untilDate.value = null;

  emit('filter-change', {column: props.column, value: inputValue.value});
  // showInput.value = false;
}

function setDateValue() {
  if (! sinceDate.value && ! untilDate.value) {
    inputValue.value = null;
  } else {
    inputValue.value = (sinceDate.value ?? '') + ',' + (untilDate.value ?? '');
  }
}

function selectAll(event) {
  emit('all-selected', {selected: event.target.checked});
}

onMounted(() => {
  if (props.column.filter?.type == 'date-select-range') {
    if (typeof inputValue.value == 'string' && inputValue.value.includes(',')) {
      showDateRange.value = true;
      let [sinceDateVal, untilDateVal] = [...inputValue.value.split(',')];

      sinceDate.value = sinceDateVal;
      untilDate.value = untilDateVal;
    }
  }
})

</script>

<style lang="scss" scoped>
.v-popper__inner {
  overflow-y: visible !important;
}

// .v-popper--theme-dropdown {
//   padding: 16px !important;
// }
</style>