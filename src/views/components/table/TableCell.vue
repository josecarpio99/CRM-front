<template>
  <td class="px-4 py-2 whitespace-nowrap text-sm" :class="{editable: $props.editable}">
     <div :class="{hidden:showInput}">
      <slot />
      <span 
        v-if="props.editable"
        @click.stop="handleClick" 
        class="cursor-pointer invisible text-gray-400 hover:text-gray-700 ml-2"
      >
        <i class="fa fa-pencil"></i>
      </span>
     </div>

     <input v-if="props.editable && props.type == 'input'" type="text" ref="inputElement" @blur="handleBlur" @keypress.enter="handleEnter"
     v-model="inputValue" class="border text-sm border-gray focus:outline-none focus:ring focus:ring-transparent focus:border-gray-500" :class="`${showInput ? 'block' : 'hidden'}`">
     
     <!-- <Dropdown v-else-if="props.type == 'list'" 
      :options="props.options" 
      name="type" 
      v-model="inputValue" 
      :showLabel="false"
      :class="{hidden : !showInput}"      
      @closed="handleBlur"
     />  -->

     <VDropdown
      v-else-if="props.editable && props.type == 'list'"
      :auto-size="false"
      :popperClass="'w-64'"
      :triggers="[]"
      :shown="showInput"
      :prevent-overflow="false"
      @hide="handleBlur"
     >
        <template #popper>        
          <Dropdown  
            :open="true"
            :options="props.options"
            :selectLabel="props.selectLabel"
            name="type" 
            v-model="inputValue" 
            :showLabel="false"
            :showPointer="false"
            :placeholder="'Buscar...'"
            @selected="handleEnter"

          /> 

        </template>
     </VDropdown>
  </td>
</template>

<script setup>
import { ref, watch, onBeforeMount } from "vue";
import Dropdown from "@/views/components/input/Dropdown";

const props = defineProps({
  class: String,
  record: {
    type: [Object],
    required: true
  },
  cellkey: {
    type: [String, Number],
    required: true
  },
  cellvalue: {
    type: [String, Object, Number, Boolean],
    required: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'input'
  },
  options: {
    type: [Array, Object],
    required: false,
  },
  selectLabel: {
    type: String,
    default: "label",
  },
});

const inputElement = ref();
const inputValue = ref(props.cellvalue); 
const showInput = ref(false);

watch(() => props.cellvalue, (newValue) => {  
    inputValue.value = newValue;
});

const emit = defineEmits(['changed', 'blurred', 'edit-click'])

function handleClick()
{
  emit('edit-click');
  showInput.value = true
  if (props.type == 'input') {
    setTimeout(()=>{
        (inputElement.value).focus()
    }, 200)  
  }
}

function handleBlur()
{        
    emit('blurred');
    showInput.value = false;
    inputValue.value = props.cellvalue;    
}

function handleEnter()
{
    showInput.value = false
    emit('changed', {
      record: props.record, 
      key: props.cellkey, 
      value: inputValue.value
    })
}

</script>

<style>
.editable:hover span {
  visibility: visible;
}

.v-popper__inner {
  overflow-y: visible !important;
}
</style>
