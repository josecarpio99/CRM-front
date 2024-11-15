<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="files-o" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">
          <slot name="title">{{ trans('global.labels.documents') }}</slot>
        </h5>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
          <Icon 
            name="plus" 
            class="text-gray-500 cursor-pointer hover:text-blue-300" 
            @click.stop="showModal = true"
          />
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <ul 
        v-if="documents.length > 0"
        class="w-full"
      >
        <DocumentItem v-for="document in documents" :document="document" :key="document.id"  />      
      </ul>
      <p v-else class="text-gray-500 my-4">{{ trans('global.labels.without_documents') }}</p>
    </div>
  </div>

  <Modal :is-showing="showModal" @close="showModal = false;">
    <Panel :title="'Subir documento'" :is-loading="isLoading">
        <span class="text-gray-600 font-semibold">Máximo: 40MB</span>
        <form @submit.prevent="onSubmit">            
            <FileInput 
              name="file" 
              :required="true" 
              :label="trans('global.labels.document')" 
              v-model="form.file" 
              @clear="form.file = ''" 
              class="mb-4"
              :accept="accept"
            >
            </FileInput>
            <Button :label="trans('global.buttons.upload')" :disabled="!form.file" />
        </form>
    </Panel>
  </Modal>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';
import {trans} from '@/helpers/i18n';
import {useAuthStore} from "@/stores/auth";
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import alertHelpers from "@/helpers/alert";
import Button from "@/views/components/input/Button";
import FileInput from "@/views/components/input/FileInput";
import Modal from "@/views/components/Modal";import Panel from "@/views/components/Panel";
import {useDocumentStore} from "@/stores/document";
import DocumentItem from "@/views/components/DocumentItem";

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '*/*'
  },
  documents: {
    type: Array,
    default: []
  }
})

const documentStore = useDocumentStore();

const emit = defineEmits(['submit']);

const isOpen = ref(true);
const showModal = ref(false);
const form = reactive({
  file: null,
})

function onSubmit() {
  let maxMbSize = (1024 * 1024) * 40;
  if (form.file.size > maxMbSize) {
    alert('El tamaño del archivo no debe ser mayor a 40MB');
    return;
  }
  emit('submit', {file: form.file});
  form.file = null;
}
</script>