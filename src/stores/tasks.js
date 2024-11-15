import {defineStore} from 'pinia';
import TaskService from "@/services/TaskService";

export const useTaskStore = defineStore("tasks", {
  state: () => {
    return {
      tasks: []
    }
  },
  actions: {
    async markAsCompleted(payload) {
      const taskService = new TaskService();
      return taskService.update(payload.id, payload)
        .then(res => {
          return res;
        })
    },
    async markAsInComplete(id) {
      const taskService = new TaskService();

      let pos = this.tasks.findIndex(
        (task) => task.id === id
      )
      
      if (this.tasks[pos]) {
        this.tasks[pos].done = false;
        this.tasks[pos].done_by = null;
      }

      return taskService.update(id, {
        done: false,
        done_by: null
      })
        .then(res => {
          return res;
        })
    },
    async update(payload) {
      const taskService = new TaskService();          
      let pos = this.tasks.findIndex(
        (task) => task.id === payload.id
      )
      if (this.tasks[pos]) {
        this.tasks[pos].content = payload.content;       
        this.tasks[pos].due_at = payload.due_at;       
        this.tasks[pos].owner.id = payload.owner.id;       
        this.tasks[pos].owner.name = payload.owner.name;       
      }

      return taskService.update(payload.id, {...payload, owner_id: payload.owner.id})
        .then(res => {
          return res;
        })
    },
    async delete(payload) {
      const taskService = new TaskService();
      this.tasks = this.tasks.filter(
        (task) => task.id !== payload.id
      );     
      
      return taskService.delete(payload.id)
        .then(res => {
          return res;
        })
    }
  },
  getters: {
    completedTasks: (state) => state.tasks.filter(task => task.done),
    inCompletedTasks: (state) => state.tasks.filter(task => !task.done),
  }
 

});