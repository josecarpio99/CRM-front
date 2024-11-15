<template>
  <div :style="style" :class="$props.class" @click.stop="false">      
      <label 
        class="inline-flex items-center"
        :class="{'cursor-pointer': props.clickable}"
        @click.stop="false"
       >
          <span v-if="showLabel" class="mr-2 text-sm font-medium text-gray-500 dark:text-gray-300">{{ props.label }}</span>

          <input 
            type="checkbox" 
            :checked="inputValue"
            @input="onInput"
            class="sr-only peer"
          >
          
          <div class="flex items-center space-x-1">
              <svg 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="currentColor" 
                viewBox="0 0 22 20"
                :class="[inputValue ? 'text-yellow-300' : 'text-gray-400', 'w-4 h-4', props.iconClass]"
              >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
              </svg>
          </div>

          
      </label>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  class: String,
  style: [String, Object], 
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    default: false,
    type: Boolean,
  },
  item: {
    default: null,
    type: Object,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  iconClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'updated']);

const inputValue = ref(props.modelValue);

function onInput(event) {
  if (! props.clickable) {
    return;
  }
  inputValue.value = event.target.checked;
  emit("updated", {value: event.target.checked, item: props.item});
  emit("update:modelValue", event.target.checked);
}

</script>