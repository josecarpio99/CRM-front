<template>
  <VDropdown
    popperClass="p-2"
    placement="left"
  >
    <Button 
      :label="trans('global.buttons.fields')"
    />

    <template #popper>
      <div class="p-4">
        <div v-for="column in columnsData" class="mb-2">
          <input 
            class="mr-2" 
            type="checkbox" 
            :id="column.key" 
            v-model="column.show"
            :disabled="column.locked"
            @change="onInputChange"
          />
          <label 
            :class="{
              'cursor-pointer': !column.locked,
              'hover:bg-gray-100': !column.locked,
              'cursor-not-allowed': column.locked
            }"
            :for="column.key"
          >
            {{ column.label }}
          </label>  
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<script setup>
import {watch, computed} from "vue";
import Button from "@/views/components/input/Button";
import {trans} from "@/helpers/i18n";

const props = defineProps({
  columns: {
    required: true,
    type: [Array]
  }
});

const emit = defineEmits(['update']);

const columnsData = computed(() => props.columns);

function onInputChange() {
  emit('update', {columns: columnsData.value});
}

</script>

<style scoped>
input:disabled {
  background-color: theme('colors.gray.300');
  color: theme('colors.gray.500');
}

input:disabled:hover {
  background-color: theme('colors.gray.300');
  color: theme('colors.gray.500');
  cursor: not-allowed;
}
</style>