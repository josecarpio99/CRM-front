<template>
  <div>
    <VSelect 
      class="global-search w-72 text-gray-500 shadow-sm"
      v-model="selectedItem" 
      :options="options" 
      id="global-search" 
      name="global-search"
      label="name"     
      placeholder="Buscar..."
      @search="handleSearch"
      @option:selected="handleSelect"
    >

      <template #no-options="{ search, searching, loading }">
        <span class="text-xs px-2">
          {{ search.length < 3 ? 'Buscar contacto, prospecto o proyecto' : 'No se encontraron resultados'  }}
        </span>
      </template>

      <template #option="{ type, name, id }">
        <span class="text-xs flex items-center" :key="type + '-' + id ">
          <Icon
            class="text-gray-400 mr-2"
            :name="getIconNameByType(type)"
          />
          {{ name }}
        </span>
      </template>
    </VSelect>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import router from "@/router";
import SearchService from "@/services/SearchService"
import Icon from "@/views/components/icons/Icon";
import {debounce} from "@/helpers/data";

const searchService = new SearchService();
const selectedItem = ref(null);
const options = reactive([]);

const handleSearch = debounce(function(search, loading) {
  if (search.length < 3) return;

  loading(true);

  searchService.search(search)
  .then((response) => {
    Object.assign(options, response.data.data);
  }).finally(() => {
    loading(false);
  })

}, 400);

function handleSelect() {
  let routeName = {
    lead: 'leads.show',
    cotizado: 'deals.cotizados.show',
    oportunidad: 'deals.oportunidades.show',
    customer: 'customers.show',
  }[selectedItem.value.type];

  router.push({name: routeName, params: {id: selectedItem.value.id }});
  
  selectedItem.value = null;  
}


function getIconNameByType(type) {
  return {
    lead: 'user-plus',
    cotizado: 'briefcase',
    oportunidad: 'briefcase',
    customer: 'building-o',
  }[type];
}
</script>

<style>
.global-search .vs__dropdown-menu {
  width: max-content;  
  min-width: 252px;
  max-width: 400px;
}

.global-search .vs__open-indicator {
  display: none;
}
</style>