<template>
  <li class="flex items-end px-2 pb-2 group">
    <div class="flex items-center">
      <Icon 
        name="file-o" 
        class="text-gray-500 cursor-pointer mr-2"
      />
      <div class="flex flex-col">
        <span 
          :class="{hidden:showInput}"
          class="cursor-pointer whitespace-normal break-all text-blue-500"
          @click="handleShowFile"
        >
        {{ document.file_name }}
        </span>

        <input 
          type="text" 
          ref="inputElement"
          @blur="handleBlur"
          @keypress.enter="handleEnter"
          v-model="inputValue" 
          class="border p-0.5 text-sm border-gray focus:outline-none focus:ring focus:ring-transparent focus:border-gray-500" :class="`${showInput ? 'block' : 'hidden'}`">

        <span class="text-xs text-gray-500">{{ $date(document.created_at).format() }}</span>
      </div>
    </div>

    <div class="flex justify-end items-center ml-auto text-blue-600 invisible group-hover:visible">
      <a :href="document.url" target="_blank">
        <Icon 
          name="cloud-download" 
          class="cursor-pointer mr-2"
        />
      </a>
      <Icon 
        name="pencil" 
        class="cursor-pointer mr-2"
        @click="edit"
      />
      <Icon 
        name="trash" 
        class="cursor-pointer"
        @click="deleteDocument"
      />
    </div>
  </li>  

  <Modal :is-showing="showFile" @close="showFile = false;" class="max-w-none">
    <img v-if="document.type == 'image'" :src="document.url" class="mx-auto">
    <iframe 
      v-else-if="document.type == 'pdf'"
      class="w-full min-h-[90vh] mx-auto" 
      :src="document.url" 
    >
    </iframe>
  </Modal>
</template>

<script setup>
import {reactive, ref} from 'vue';
import $date from "@/helpers/date";
import dayjs from "dayjs";
import {useDocumentStore} from "@/stores/document";
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import alertHelpers from "@/helpers/alert";
import Modal from "@/views/components/Modal";

const props = defineProps({
  document: {
    required: true,
    type: Object
  }
});

const documentStore = useDocumentStore();
const inputValue = ref(props.document.name);
const showInput = ref(false);
const showFile = ref(false);
const inputElement = ref();

function edit()
{
  showInput.value = true
  setTimeout(()=>{
      (inputElement.value).focus()
  }, 200)    
}

function handleBlur()
{        
  showInput.value = false;
  inputValue.value = props.document.name;    
}

function handleEnter()
{
  if (inputValue.value.length < 3) {
    toast.error('El nombre debe tener al menos 3 carácteres');
    inputValue.value = props.document.name;
    return;
  }

  showInput.value = false;  
  let fileName = inputValue.value + '.' + props.document.file_name.split('.').pop();

  let urlArr = props.document.url.split('/');
  urlArr[urlArr.length - 1] = fileName;
  let url = urlArr.join('/');
  
  documentStore.update({
    ...props.document, 
    name: inputValue.value, 
    file_name: fileName,
    url: url
  })
    .then(res => {
      if (res.status == 200 || res.status == 201 || res.status == 204) {
        toast.success();
      }
    }); 
}

function deleteDocument() {
  alertHelpers.confirmDanger(function () {
    documentStore.delete({...props.document})
      .then(res => {
        if (res.status == 200 || res.status == 201 || res.status == 204) {
          toast.success();
        }
      });
  });
}

function handleShowFile() {
  if (!['pdf', 'image'].includes(props.document.type)) {
    window.open(props.document.url, '_blank').focus();
  } else {
    showFile.value = true;
  }
}

</script>
