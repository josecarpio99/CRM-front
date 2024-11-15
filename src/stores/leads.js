import {defineStore} from 'pinia';
import { PAGE_LIMIT } from "@/stub/constans";

export const useLeadsStore = defineStore("leads", {
  state: () => {
    return {
      mainQuery: {
        page: 1,
        limit: PAGE_LIMIT,
        search: '',
        sort: '',
        filters: {
            search: {
                value: '',
                comparison: '='
            },  
            name: {
                value: '',
                comparison: '='
            },    
            company_name: {
                value: '',
                comparison: '='
            },    
            source: {
                value: '',
                comparison: '='
            },
            branch: {
                value: '',
                comparison: '='
            },    
            owner: {
                value: '',
                comparison: '='
            },
            creator: {
                value: '',
                comparison: '='
            },
            category: {
                value: '',
                comparison: '='
            },
            created_at: {
                value: '',
                comparison: '='
            },
        }
      }
    }
  },
});