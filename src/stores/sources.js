import {defineStore} from 'pinia';
import SourceService from "@/services/SourceService";

export const useSourcesStore = defineStore("sources", {
  state: () => {
    return {
        sourceList: null
    }
  },
  actions: {
    async getSourceList() {
      const sourceService = new SourceService();
      this.sourceList = await sourceService.index().then(res => res.data);;
    }
  },
  getters: {
    sourcesForCustomers: (state) => {
      return state.sourceList.filter(source => source.id != 3);
    }
  }
});