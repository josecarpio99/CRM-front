import {defineStore} from 'pinia';
import UserService from "@/services/UserService";

export const useUsersStore = defineStore("users", {
  state: () => {
    return {
        userList: null
    }
  },
  actions: {
    async getUserList() {
      const userService = new UserService();
      this.userList = await userService.list().then(res => res.data);
    }
  }
});