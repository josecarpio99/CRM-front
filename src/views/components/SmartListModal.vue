<template>
  <BaseModal :isLoading="isLoading" @close-modal="onCloseModal" @save-modal="onSubmit">
    <template #title-wrapper>
      <h2 class="text-lg font-semibold p-2 text-gray-700">{{ trans('smart_list.labels.give_name') }}</h2>
    </template>

    <Form ref="formRef" id="create-smart-list" @submit.prevent="onSubmit" class="w-[500px] max-w-[100%]">
      <div class="mt-3">
        <TextInput 
          type="text" 
          class="mb-4" 
          :required="true"
          name="name" 
          v-model="form.name" 
          :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
         />
      </div>
    </Form>

  </BaseModal>
</template>

<script setup>
import {reactive, ref, onMounted} from "vue";
import {trans} from "@/helpers/i18n";
import BaseModal from '@/views/components/BaseModal';
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import useVuelidate from '@vuelidate/core';
import {
  required,
  helpers
} from '@vuelidate/validators';

const emit = defineEmits(["close-modal", "save-modal"]);

const form = reactive({
  name: null
});

const formRef = ref(null);
const isLoading = ref(true);

const rules = {
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required)
  }
}

const v$ = useVuelidate(rules, form);

function onSubmit() {  
  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  v$.value.$reset();

  emit('save-modal', {name: form.name});
  emit('close-modal');
  form.name = null;
}

function onCloseModal() {
  form.name = null;
  emit('close-modal');
}

onMounted( async () => {
  isLoading.value = false;
});

</script>