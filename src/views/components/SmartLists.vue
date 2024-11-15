<template>
  <h4 class="text-xl text-gray-600 mb-4">{{ trans('global.labels.smart_lists') }}</h4>
  <div v-if="props.items.length > 0">
    <div class="flex flex-wrap gap-4">
        <router-link 
        v-for="item in itemsToDisplay" 
        class="p-6 border-2 grow-0 rounded-sm basis-[31%]  hover:shadow-xl cursor-pointer"
        :class="{'border-blue-300': route.params.id == item.id}"
        :to="{name: props.routeName, params: {id: item.id}}"
        >                      
          <h4 class="text-2xl">{{ item.name }}</h4> 
        </router-link>  
    </div>

    <div 
      v-if="total > perPage"
      class="flex gap-1 justify-center items-center mt-6 text-gray-400"
    >
      <Icon 
        class="p-2"
        :class="{
          'cursor-default': currentPage == 1,
          'cursor-pointer': currentPage != 1,
          'hover:bg-gray-100': currentPage != 1,
        }"
        name="chevron-left" 
        @click="previousPage" 
      />

      <Icon 
        v-for="page in totalPagesArr()" 
        class="text-xs p-2"
        :class="{
          'cursor-default': currentPage == page + 1,
          'text-gray-500': currentPage == page + 1,
          'cursor-pointer': currentPage != page + 1,
          'hover:bg-gray-100': currentPage != page + 1,
        }"
        name="circle" 
        @click="currentPage = page + 1" 
       />

      <Icon 
        class="p-2" 
        :class="{
          'cursor-default': currentPage == totalPages,
          'cursor-pointer': currentPage != totalPages,
          'hover:bg-gray-100': currentPage != totalPages,
        }"
        @click="nextPage" 
        name="chevron-right" 
      />
    </div>
  </div>

  <div v-else class="flex items-center justify-center p-10">
    <span class="text-lg text-gray-500">{{ trans('global.phrases.no_records') }}</span>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {trans} from "@/helpers/i18n";
import Icon from "@/views/components/icons/Icon";

const props = defineProps({
  items: {
    type: Array
  },
  routeName: {
    type: String,
    required: true
  }
});

const route = useRoute();
let perPage = 6;
let currentPage = ref(1);
let total = computed(() => props.items.length);
let totalPages = computed(() => Math.ceil(props.items.length / perPage));
let itemsToDisplay = computed(() => paginate(props.items));

function paginate (items) {
  let from = (currentPage.value * perPage) - perPage;
  let to = (currentPage.value * perPage);

  return  items.slice(from, to);
}

function previousPage() {
  if (currentPage.value == 1) return;

  currentPage.value--;
}

function nextPage() {
  if (currentPage.value == totalPages.value) return;

  currentPage.value++;
}

function totalPagesArr() {
  return [...Array(totalPages.value).keys()];
}


</script>

<style lang="scss" scoped>

</style>