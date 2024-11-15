<template>
  <div :style="style" class="text-gray-700 font-semibold" :class="$props.class">
      <label
          :for="name"
          class="text-sm text-gray-500 font-normal"
          :class="{ 'sr-only': !showLabel }"
          v-if="label">
          {{ label }}<span class="text-red-600" v-if="$props.required">*</span>
      </label>
       
      <vue-number 
        v-model="inputValue" 
        @input="onInput"
        v-bind="number"
        class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-theme-500 focus:border-theme-500 text-sm"
      >
      </vue-number>

      <span v-if="$props.errorMessage.length > 0" class="text-red-500 text-sm ml-1">
          {{ $props.errorMessage }}
      </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { component as VueNumber } from '@coders-tm/vue-number-format';

const props = defineProps({
  class: String,
  style: [String, Object],
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    default: 0,
    type: [Number, String],
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  number: {
    default: {
        decimal: '.',
        separator: ',',
        prefix: '$ ',
        precision: 3,
        nullValue: 0
    }
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = props.modelValue

function onInput(event) {
  emit("update:modelValue", event.target.value);
}


</script>