import {defineStore} from 'pinia';
import DocumentService from "@/services/DocumentService";

export const useDocumentStore = defineStore("docuemnts", {
  state: () => {
    return {
      documents: []
    }
  },
  getters: {
    mediaFiles: (state) => state.documents.filter(document => document.collection_name == 'files'),
    mediaProfitability: (state) => state.documents.filter(document => document.collection_name == 'profitability'),
    mediaClient: (state) => state.documents.filter(document => document.collection_name == 'client'),
  },
  actions: {
    async update(payload) {
      const documentService = new DocumentService();          
      let pos = this.documents.findIndex(
        (document) => document.id === payload.id
      )
      if (this.documents[pos]) {
        this.documents[pos].name = payload.name;  
        this.documents[pos].file_name = payload.file_name;  
        this.documents[pos].url = payload.url;  
      }

      return documentService.update(payload.id, {name: payload.name})
        .then(res => {
          return res;
        })
    },
    async delete(payload) {
      const documentService = new DocumentService();
      this.documents = this.documents.filter(
        (document) => document.id !== payload.id
      );     
      
      return documentService.delete(payload.id)
        .then(res => {
          return res;
        })
    }
  }
});
