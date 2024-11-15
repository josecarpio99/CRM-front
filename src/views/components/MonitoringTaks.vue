<template>
  <div class="rounded-md border-2 mt-2">
    <div class="flex items-center border-b-[1px] py-2 pl-4 pr-6 cursor-pointer hover:bg-gray-100"
      @click="isOpen = !isOpen">
      <Icon name="list-ul" class="basis-1/12 text-gray-500 cursor-pointer" />
      <div class="basis-full">
        <h5 class="font-semibold whitespace-normal ml-1">Buenas Prácticas De Atención de Leads</h5>
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
        v-if="tasks && tasks.length > 0" 
        class="w-full"
      >
        <li class="flex flex-col px-2 pt-2 pb-2 pl-4 gap-2" v-for="task in tasks">
          <p 
            @click="handleTaskUpdate(task)"
            class="text-gray-600 text-xs whitespace-normal cursor-pointer hover:text-blue-500" 
            :class="task.done ? 'line-through' : ''" 
            :title="task.done ? 'Marcar como incompleto' : 'Marcar como completado'"
          >
            <Icon name="square-o" class="text-gray-500 mr-1" v-if="!task.done"  />
            {{ task.content }}
          </p>
        </li>      
      </ul>

      <p v-else class="text-gray-500 my-4">...</p>

    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {trans} from '@/helpers/i18n';
import Icon from "@/views/components/icons/Icon";
import $date from "@/helpers/date";

const props = defineProps({
  tasks: {
    type: [Array, Object],
    default: [
      {content: 'Videollamada / Visita Inicial y Presentar Semblanza Corporativa.', done: 0},
      {content: 'Levantamiento de Necesidades Completo en Visita o Videollamada.', done: 0},
      {content: 'Grupo de WhatsApp con Gerente o Director.', done: 0},
      {content: 'Compartir Referencia de Proyectos Similares.', done: 0},
      {content: 'Compartir Póliza de Garantía y Catálogo Digital.', done: 0},
      {content: 'Otorgar Descuento "Especial".', done: 0},
      {content: 'Presentación de Propuesta en Showroom, Visita o Videoconferencia. (Idealmente en Showroom)', done: 0},
    ]
  }
});

const emit = defineEmits(['update']);

const defaultTasks = [
  {content: 'Videollamada / Visita Inicial y Presentar Semblanza Corporativa.', done: 0},
  {content: 'Levantamiento de Necesidades Completo en Visita o Videollamada.', done: 0},
  {content: 'Grupo de WhatsApp con Gerente o Director.', done: 0},
  {content: 'Compartir Referencia de Proyectos Similares.', done: 0},
  {content: 'Compartir Póliza de Garantía y Catálogo Digital.', done: 0},
  {content: 'Otorgar Descuento "Especial".', done: 0},
  {content: 'Presentación de Propuesta en Showroom, Visita o Videoconferencia. (Idealmente en Showroom)', done: 0},
]

const tasks = ref(props.tasks || defaultTasks);

const isOpen = ref(true);

const handleTaskUpdate = (task) => {
  task.done = task.done ? 0 : 1;
  console.log(props.tasks)
  
  emit('update', tasks.value)
}
</script>

<style>

</style>