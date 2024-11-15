<template>

  <template v-if="feedStore.getFeed.length > 0" v-for="item in feedStore.getFeed">
    <CompletedTaskItem v-if="item.type == 'task'" :task="item" />
    <NoteItem v-else-if="item.type == 'note'" :note="item" />
  </template>
  
  <template v-else>
    <div class="px-2 py-6 text-gray-500 border-y-2 mb-2 border-gray-100">
      <p>Todas las notas y tareas completadas se mostraran en esta sección</p>
    </div>
  </template>
  
</template>

<script setup>
import {useFeedStore} from "@/stores/feed";
import CompletedTaskItem from "@/views/components/task/CompletedTaskItem";
import NoteItem from "@/views/components/NoteItem";

const feedStore = useFeedStore();

</script>

<style>

</style>