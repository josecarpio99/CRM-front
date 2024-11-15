<template>
  <div class="p-2 pb-4 border-y-2 mb-2 border-gray-100 flex group">
    <div class="pr-2">
      <Icon class="text-gray-500 align-top" name="pencil-square-o" />
    </div>
    <div class="flex flex-col w-full">
      <div class="flex justify-between text-xs text-gray-500 min-h-[1.8rem]">
        <p>{{ note.user.name }} dejo una nota</p>
        <div>
          <VDropdown 
            v-if="!showEdit"
            placement="left"
            class="hidden group-hover:block"
          >
            <button class="inline-block">
              <Icon class="text-gray-500 align-sub text-lg hover:text-gray-700 cursor-pointer px-2
              " name="ellipsis-v" />
            </button>

            <template #popper>
              <ul>
                <li 
                  class="py-2 px-4 cursor-pointer text-gray-500 hover:bg-gray-100"
                  @click="open"
                >
                  <span>
                    <Icon class="text-lg mr-2" name="pencil" />
                  </span>
                  <span>{{ trans('notes.buttons.edit') }}</span>
                </li>
                <li 
                  class="py-2 px-4 cursor-pointer text-gray-500 hover:bg-gray-100"
                  @click="deleteNote"
                >
                  <span>
                    <Icon class="text-lg mr-2" name="trash-o" />
                  </span>
                  <span>{{ trans('notes.buttons.delete') }}</span>
                </li>
              </ul>
            </template>
          </VDropdown>
          <span :class="{'group-hover:hidden': !showEdit}">{{ $date(note.created_at).format('DD-MM-YYYY HH:mm A') }}</span>
        </div>
      </div>
      <div v-if="!showEdit" class="my-2 text-gray-600 whitespace-normal max-h-40 overflow-y-scroll">
        {{ note.content }}
      </div>
      
      <div v-else="showEdit" class="bg-[#fff7ed] py-2 px-4 rounded-md">
        <textarea 
          v-model="note.content" 
          ref="textareaEl" 
          class="bg-inherit text-sm text-gray-700 h-40 max-h-40 border-none w-full resize-none p-0 focus:ring-0"
          @input="resize()"
        >
        </textarea>
        <div class="">
          <div class="text-right">
            <Button
              theme="transparent"
              class="mr-2"
              :label="trans('global.buttons.cancel')"
              @click="cancel"

            />

            <Button
              theme="info"
              :label="trans('global.buttons.update')"
              @click="onSubmit"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {trans} from '@/helpers/i18n';
import {useNoteStore} from "@/stores/notes";
import $date from "@/helpers/date";
import Icon from "@/views/components/icons/Icon";
import toast from '@/helpers/toast';
import Button from "@/views/components/input/Button";
import alertHelpers from "@/helpers/alert";

const props = defineProps({
  note: {
    required: true,
    type: Object
  }
});

const noteStore = useNoteStore();
const showEdit = ref(false);
const textareaEl = ref();

function cancel() {
  showEdit.value = false;
}

function open() {
  showEdit.value = true;
  setTimeout(()=>{
    (textareaEl.value).focus()
  }, 200);
}

function onSubmit() {
  showEdit.value = false;
  noteStore.update(props.note)
    .then(res => {
      if (res.status == 200 || res.status == 201) {
        toast.success();
      }
    });
}

function deleteNote() {
  alertHelpers.confirmDanger(function () {
    noteStore.delete(props.note)
      .then(res => {
        if (res.status == 200 || res.status == 201 || res.status == 204) {
          toast.success();
        }
      });
  });
}

function resize() {
  textareaEl.value.style.height = textareaEl.value.scrollHeight + "px";
}
</script>

<style>

</style>