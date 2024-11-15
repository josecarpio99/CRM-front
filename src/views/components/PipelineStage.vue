<template>
  <div class="inline-block w-full">
    <span>{{ stage.label }}</span>
    <div class="flex gap-[2px]">
      <span 
        class="h-2 basis-full rounded-sm"
        :class="classForStage('Oportunidad')"
      ></span>     
      <span 
        class="h-2 basis-full rounded-sm"
        :class="classForStage('Cotizado')"
      ></span>     
      <span 
        class="h-2 basis-full rounded-sm"
        :class="classForStage('Ganado y por entregar')"
      ></span>     
      <span 
        class="h-2 basis-full rounded-sm"
        :class="classForStage('Ganado')"
      ></span>     
     
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { dealStages } from "@/stub/statuses";

const props = defineProps({
  stageId: {
    required: true,
    type: [Number]
  }
});

const stage = computed(() => {
  return dealStages.find(stage => stage.id == props.stageId);
});

function classForStage(stageStr) {
  if (stage.value.label == 'Perdido') {
    return 'bg-red-500';    
  }

  if (stage.value.label == 'No cualificado') {
    return 'bg-gray-300';    
  }

  if (
    stageStr == 'Oportunidad' || 
    stage.value.label == 'Ganado'
    ) {
    return 'bg-green-500';
  }

  if (stageStr == 'Cotizado') {
    if (['Cotizado', 'Ganado y por entregar'].includes(stage.value.label)) {
      return 'bg-green-500';      
    }
  }

  if (stageStr == 'Ganado y por entregar') {
    if (stage.value.label == stageStr) {
      return 'bg-green-500';      
    }
  }

  return 'bg-gray-300';
}

</script>