<template>
  <Form id="create-task" :novalidate="true" @submit.prevent="onSubmit" :class="$props.class">
    <TextInput 
      class="mb-4" 
      type="text" 
      :required="true" 
      name="content" 
      v-model="form.content"
      :label="trans('tasks.labels.name')"
      :errorMessage="v$.content.$errors.length ? v$.content.$errors[0].$message : ''"
    />
    <TextInput 
      class="mb-4" 
      type="datetime-local" 
      :required="true" 
      name="due_at" 
      v-model="form.due_at" 
      :errorMessage="v$.due_at.$errors.length ? v$.due_at.$errors[0].$message : ''"
      :min="$date().format('YYYY-MM-DD HH:mm')"
      :label="trans('tasks.labels.due_at')"
    />

    <Dropdown  
      class="mb-8"
      :required="true"
      :label="trans('tasks.labels.owner')"
      selectLabel="name"
      name="owner" 
      :options="usersStore.userList" 
      v-model="form.owner"              
    /> 

    <div class="text-right">
      <Button
        theme="info"
        :label="trans('tasks.buttons.add')"
      />
    </div>
  </Form>
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
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import Button from "@/views/components/input/Button";
import $date from "@/helpers/date";

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['submit']);
const authStore = useAuthStore();
const usersStore = useUsersStore();

const initialState = {
  content: '',           
  due_at: '',
  owner: {
    id: authStore.user.id,
    name: authStore.user.name
  }
}

const form = reactive({...initialState});

const rules = {
  content: {
    required: helpers.withMessage(trans('global.validation.required'), required),
    maxLength: helpers.withMessage(
      trans('global.validation.maxlength', { count: 255 }),
      maxLength(255)
    ),
  },
  due_at: {
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
  emit('submit', {...form});
  form.value = Object.assign(form, initialState);
};
</script>