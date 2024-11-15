<template>
  <div class="bg-[#fff7ed] mt-2 py-2 px-4 rounded-md border-2 mb-4">
    <div class="mb-2">
      <span class="text-gray-700">{{ trans('global.labels.internal_note') }}</span>
    </div>
    <p 
      v-if="!isOpen" 
      class="text-gray-400 mt-2 text-sm w-full cursor-text"
      @click="open"
    >
      {{ trans('customers.phrases.add_note') }}
    </p>
    <div v-if="isOpen">
      <textarea 
        v-model="content" 
        ref="textareaEl" 
        class="bg-inherit text-sm text-gray-700 max-h-40 border-none w-full resize-none p-0 focus:ring-0"
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
            :label="trans('global.buttons.add')"
            @click="onSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {trans} from "@/helpers/i18n";
import Button from "@/views/components/input/Button";

const emit = defineEmits(['submit']);

const isOpen = ref(false);
const content = ref('');
const textareaEl = ref();

function cancel() {
  content.value = '';
  isOpen.value = false;
}

function open() {
  isOpen.value = true;
  setTimeout(()=>{
    (textareaEl.value).focus()
  }, 200);
}

function onSubmit() {
  isOpen.value = false;
  emit('submit', {content: content.value});
  content.value = '';
}

function resize() {
  textareaEl.value.style.height = "18px";
  textareaEl.value.style.height = textareaEl.value.scrollHeight + "px";
}
</script>

<style lang="scss" scoped>

</style>