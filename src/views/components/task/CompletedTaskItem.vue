<template>
  <div class="p-2 pb-4 border-y-2 mb-2 border-gray-100 flex group">
    <div class="pr-2">
      <Icon class="text-gray-500 align-top" name="check-square-o" />
    </div>
    <div class="flex flex-col w-full">
      <div class="flex justify-between text-xs text-gray-500">
        <p>{{ task.done_by_user.name }} completó la tarea</p>
        <div>
          <a 
            href="#" 
            class="mr-2 cursor-pointer hover:text-gray-600 invisible group-hover:visible"
            @click="markAsInComplete"
          >
            {{ trans('tasks.buttons.mark_incomplete') }}
          </a>
          <span>{{ $date(task.due_date).format('DD-MM-YYYY HH:mm A') }}</span>
        </div>
      </div>
      <div class="my-2 text-gray-600 line-through whitespace-normal">
        {{ task.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {trans} from '@/helpers/i18n';
import {useTaskStore} from "@/stores/tasks";
import $date from "@/helpers/date";
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import {useAuthStore} from "@/stores/auth";

const props = defineProps({
  task: {
    required: true,
    type: Object
  }
});

const taskStore = useTaskStore();
const authStore = useAuthStore();

function markAsInComplete() {
  taskStore.markAsInComplete(props.task.id)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        authStore.getCurrentUser();
        toast.success();
      }
    });
}

</script>

<style>

</style>