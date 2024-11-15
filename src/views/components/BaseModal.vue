<template>
  <Teleport to="body">
    <Transition name="modal-outer">
      <div
        v-show="modalActive"
        class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center items-center px-8"
      >
        <Transition name="modal-inner">
          <div
            v-if="modalActive"
            class="bg-white max-w-[95%] max-h-[80vh] overflow-x-hidden flex flex-col"
          >
            <div class="border-b-[1px] border-gray-200 p-4">
              <slot name="title-wrapper">
                <h2><slot name="title" /></h2>               

              </slot>
            </div>
            <div v-if="!isLoading" class="p-4 overflow-x-hidden">
              <slot />
            </div>
            <div v-else class="flex justify-center items-center w-[600px] max-w-[100%] h-[300px] max-h-[100%]">
              <Spinner :text-new-line="true"></Spinner>
            </div>
            <div class="p-4 flex bg-gray-100">
                <div v-if="props.showDelete" class="flex items-center hover:underline decoration-red-500">
                  <span 
                    class="text-red-500 cursor-pointer"
                    @click="$emit('delete')"
                  >
                    {{ trans('global.actions.delete') }}
                  </span>
                </div>
                <div class="ml-auto">
                  <Button
                    theme="outline"
                    class="bg-white border-theme-700 border-[1px] mr-2"
                    :label="trans('global.buttons.close')"
                    @click="$emit('close-modal')"
                  />

                  <slot name="primary-button"> 
                    <Button
                      :label="trans('global.buttons.save')"
                      @click="$emit('save-modal')"
                    />
                  </slot>
                </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {watch} from "vue";
import {trans} from "@/helpers/i18n";
import Button from "@/views/components/input/Button";
import Spinner from "@/views/components/icons/Spinner";


defineEmits(["close-modal", "save-modal", "delete"]);
const props = defineProps({
  modalActive: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    dafault: false
  },
  showDelete: {
    type: Boolean,
    dafault: false
  }
});

</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-inner-leave-to {
  transform: scale(0.8);
}
</style>
