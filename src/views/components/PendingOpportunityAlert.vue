<template>
  <Modal :is-showing="pendingOpportunitiesStore.showModal" @close="pendingOpportunitiesStore.showModal = false;" class="max-w-xl">
    
    <div 
      v-if="deal"
      class="flex flex-col justify-center items-center bg-white border-red-500 border-2 px-4 py-8"
    >
      <div class="mb-4">
        <Icon class="text-yellow-500 text-6xl" name="exclamation-circle" />
      </div>

      <div class="mb-8">
        <h3 class="text-2xl uppercase text-gray-700 font-bold">
          {{ 
          pendingOpportunitiesStore.count > 1 
            ? `Tienes ${pendingOpportunitiesStore.count} proyectos asignados` 
            : 'Nuevo proyecto asignado' 
          }}
        </h3>
      </div>

      <div>
        <router-link :to="{name: 'deals.cotizados.show', params: {id: deal.id}}">
          <Button
            class="uppercase font-semibold"
            :label="'Ir al Proyecto'"
            @click="pendingOpportunitiesStore.showModal = false"
          />
        
        </router-link> 
      </div>
    </div>
  </Modal>

  <div 
    v-if="pendingOpportunitiesStore.showAlert"
    class="absolute right-6 bottom-10 animate-bounce cursor-pointer"
    @click="pendingOpportunitiesStore.showModal = true"
  >    
    <Icon class="text-red-500 text-6xl" name="exclamation-circle" />
  </div>
</template>

<script setup>
import {reactive, ref, computed} from 'vue';
import Modal from "@/views/components/Modal";
import Icon from "@/views/components/icons/Icon";
import Button from "@/views/components/input/Button.vue";
import {trans} from '@/helpers/i18n';
import {usePendingOpportunitiesStore} from "@/stores/pendingOpportunities";

const pendingOpportunitiesStore = usePendingOpportunitiesStore();
const deal = computed(() => pendingOpportunitiesStore.first);

</script>