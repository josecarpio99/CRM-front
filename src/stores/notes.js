import {defineStore} from 'pinia';
import NoteService from "@/services/NoteService";

export const useNoteStore = defineStore("notes", {
  state: () => {
    return {
      notes: []
    }
  },
  actions: {
    async update(payload) {
      const noteService = new NoteService();          
      let pos = this.notes.findIndex(
        (note) => note.id === payload.id
      )
      if (this.notes[pos]) {
        this.notes[pos].content = payload.content;  
      }

      return noteService.update(payload.id, {content: payload.content})
        .then(res => {
          return res;
        })
    },
    async delete(payload) {
      const noteService = new NoteService();
      this.notes = this.notes.filter(
        (note) => note.id !== payload.id
      );     
      
      return noteService.delete(payload.id)
        .then(res => {
          return res;
        })
    }
  },
  
});
