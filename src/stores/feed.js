import {defineStore} from 'pinia';
import {useNoteStore} from "@/stores/notes";
import {useTaskStore} from "@/stores/tasks";


export const useFeedStore = defineStore("feed", {
  state: () => {
    return {
      feed: []
    }
  },
  getters: {
    getFeed: (state) => {
      const taskStore = useTaskStore();
      const noteStore = useNoteStore();

      const notes = noteStore.notes.map(note => {
        note.type = 'note';
        note.sort_date = note.created_at;
        return note;
      });

      const tasks = taskStore.completedTasks.map(task => {
        task.type = 'task';
        task.sort_date = task.due_date;
        return task;
      });

      const feed = [...notes, ...tasks].sort(function(a,b){
        return new Date(b.sort_date) - new Date(a.sort_date);
      });

      return feed;
    }
  }
});