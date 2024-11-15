<template>
  <VDropdown 
    :auto-size="false"
    :triggers="[]"
    :shown="showDropdown"
    :prevent-overflow="false"
    :placement="'left-start'" 
    :skidding="-10"
    :distance="15"
    :arrow-padding="6"
    @hide="showDropdown = false"
  >
    <Icon 
      name="plus" 
      :class="['text-gray-500', 'cursor-pointer', 'hover:text-blue-300', props.iconClass]" 
      @click.stop="showDropdown = !showDropdown"
    />

    <template #popper>    
      <ContactForm 
        class="w-96 p-6"
        @submit="onContactFormSubmit"
      />
    </template>
  </VDropdown> 
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import ContactForm from "@/views/components/contact/ContactForm";
import Icon from "@/views/components/icons/Icon";

const props = defineProps({
  iconClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit']);

const showDropdown = ref(false);

function onContactFormSubmit(params) {
  showDropdown.value = false;

  emit('submit', params);
}
</script>