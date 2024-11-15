<template>
  <li class="flex items-center p-2">
    <Icon 
      name="square-o" 
      class="text-gray-500 cursor-pointer mr-2"
      @click="markAsCompleted(task)"
    />
    <div class="flex flex-col">
      <VDropdown
        :triggers="[]"
        placement="left"
        :shown="showDropdown"
        @hide="showDropdown = false"
      >
        <span 
          class="text-blue-500 whitespace-normal leading-4 cursor-pointer"
          @click.stop="showDropdown = !showDropdown"
        >
          {{ task.content }}
        </span>
        <template #popper>
          <Form id="update-task" :novalidate="true" @submit.prevent="onSubmit" class="w-96 p-6">
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
                  :label="trans('tasks.buttons.update')"
                />
              </div>
            </Form>  
        </template>
      </VDropdown>
      
      <p class="text-xs">
        <span
          :class="dayjs().isBefore(dayjs(task.due_at)) ? 'text-gray-500' : 'text-red-500'"
        >
        {{ $date(task.due_at).format('DD-MM-YYYY HH:mm A') }}
        </span>
        <span> . </span>
        <span class="text-gray-500">{{ task.owner?.name }}</span>
      </p>
    </div>
    <Icon 
      name="trash-o" 
      class="text-red-500 cursor-pointer ml-auto"
      @click="deletetask(task)"
    />
  </li>
</template>

<script setup>
import {reactive, ref} from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  required,
  maxLength,  
  helpers
} from '@vuelidate/validators';
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import alertHelpers from "@/helpers/alert";
import {useAuthStore} from "@/stores/auth";
import {useTaskStore} from "@/stores/tasks";
import {useUsersStore} from "@/stores/users";
import $date from "@/helpers/date";
import dayjs from "dayjs";
import Form from "@/views/components/Form";
import TextInput from "@/views/components/input/TextInput";
import Dropdown from "@/views/components/input/Dropdown";
import Button from "@/views/components/input/Button";

const props = defineProps({
  task: {
    required: true,
    type: Object
  }
});

const authStore = useAuthStore();
const taskStore = useTaskStore();
const usersStore = useUsersStore();

const showDropdown = ref(false);

const form = reactive({
  id: props.task.id,
  content: props.task.content,
  due_at: props.task.due_at,
  owner: {
    id: props.task.owner.id,
    name: props.task.owner.name
  }
});

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


function markAsCompleted(task) {
  task.done = true;
  task.done_by = authStore.user.id;
  task.done_by_user = {
    id: authStore.user.id,
    name: authStore.user.name
  };
  task.due_date = dayjs().format('YYYY-MM-DD HH:mm')
  taskStore.markAsCompleted(task)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        authStore.getCurrentUser();
        toast.success();
      }
    });
}

function deletetask(task) {
  alertHelpers.confirmDanger(function () {
    taskStore.delete(task)
      .then(res => {
        if (res.status == 200 || res.status == 201 || res.status == 204) {
          authStore.getCurrentUser();
          toast.success();
        }
      });
  });
}

function onSubmit() {
  v$.value.$touch();

  if (v$.value.$invalid) {
    return true
  }

  showDropdown.value = false;
  taskStore.update(form)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        authStore.getCurrentUser();
        toast.success();
      }
    });
};
</script>

<style>

</style>