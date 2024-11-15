<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="arrows-h" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold">Historial del Proyecto</h5>
      </div>
      <div class="text-right basis-2/12 flex justify-between items-center">
        <div>
          <!-- <Icon 
            name="plus" 
            class="text-gray-500 cursor-pointer hover:text-blue-300"
          /> -->
        </div>
        <Icon :name="isOpen ? 'angle-up' : 'angle-down'" class="text-gray-500" />
      </div>
    </div>

    <div v-if="isOpen" class="flex items-center justify-center p-2">
      <ul 
        v-if="deal"
        class="w-full"
      >
        <li class="flex flex-col px-2 pt-2 pb-2 pl-4 gap-2">
          
          <div v-if="deal.converted_to_opportunity" class="flex gap-1 flex-col text-gray-500 border-b-2 pb-2">
            <span class="font-semibold text-gray-600">
              Convertido a oportunidad el:
            </span>
            <span class="text-xs">
              {{ $date(deal.converted_to_opportunity).format() }}
            </span>
          </div>       

          <div v-if="deal.converted_to_quote" class="flex gap-1 flex-col text-gray-500 border-b-2 pb-2">
            <span class="font-semibold text-gray-600">
              Convertido a proyecto el:
            </span>
            <span class="text-xs">
              {{ $date(deal.converted_to_quote).format() }}
            </span>
          </div>

          <div v-if="deal.move_to_in_progress" class="flex gap-1 flex-col text-gray-500 border-b-2 pb-2">
            <span class="font-semibold text-gray-600">
              En proceso el:
            </span>
            <span class="text-xs">
              {{ $date(deal.move_to_in_progress).format() }}
            </span>
          </div>

          <div v-if="deal.stage_moved_at && deal.status != 'en proceso'" class="flex gap-1 flex-col text-gray-500 border-b-2 pb-2">
            <span class="font-semibold text-gray-600">
              {{ deal.status == 'ganado' ? 'Ganado' : 'Perdido' }} el:
            </span>
            <span class="text-xs">
              {{ $date(deal.stage_moved_at).format() }}
            </span>
          </div>

        </li>      
      </ul>
      <p v-else class="text-gray-500 my-4">{{ trans('global.labels.without_associated_contact') }}</p>

    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import $date from "@/helpers/date";

const props = defineProps({
  deal: {
    type: Object,
    default: null
  }
});

const isOpen = ref(true);

</script>

<style>

</style>