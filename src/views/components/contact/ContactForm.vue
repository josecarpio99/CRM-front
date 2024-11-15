<template>
  <Form id="create-contact" :novalidate="true" @submit.prevent="onSubmit" :class="$props.class">
    <TextInput 
      class="mb-4" 
      type="text" 
      :required="true" 
      name="name" 
      v-model="form.name"
      :label="'Nombre'"
      :errorMessage="v$.name.$errors.length ? v$.name.$errors[0].$message : ''"
    />

    <TextInput 
      class="mb-4" 
      type="text" 
      name="phone" 
      v-model="form.phone"
      :label="'Teléfono'"
    />

    <TextInput 
      class="mb-4" 
      type="text" 
      name="phone2" 
      v-model="form.phone2"
      :label="'Otro Teléfono'"
    />

    <TextInput
      class="mb-6"
      type="email"
      name="email"
      v-model="form.email"
      :label="'Email'"
    />

    <TextInput
      class="mb-6"
      type="email"
      name="email2"
      v-model="form.email2"
      :label="'Otro Email'"
    />

    <div class="text-right">
      <Button
        theme="info"
        :label="'Guardar'"
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
  },
  contact: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(['submit']);
const authStore = useAuthStore();
const usersStore = useUsersStore();

const initialState = {
  name: props.contact?.name,    
  phone: props.contact?.phone,
  phone2: props.contact?.phone2,
  email: props.contact?.email,
  email2: props.contact?.email2
}

const form = reactive({...initialState});

const rules = {
  name: {
    required: helpers.withMessage(trans('global.validation.required'), required),
    maxLength: helpers.withMessage(
      trans('global.validation.maxlength', { count: 255 }),
      maxLength(255)
    ),
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
  // form.value = Object.assign(form, initialState);
};
</script>