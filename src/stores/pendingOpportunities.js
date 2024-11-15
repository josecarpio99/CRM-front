import {defineStore} from 'pinia';
import DealService from "@/services/DealService";

export const usePendingOpportunitiesStore = defineStore("pendingOpportunities", {
  state: () => {
    return {
      data: [],
      showModal: false,
      showAlert: false,
      interval: null,
      intervalSound: null
    }
  },
  actions: {
    async getPendingOpportunities() {
      const dealService = new DealService();
      this.data = await dealService.getPendingOpportunities().then(res => res.data.data);
    },
    setIntervalFn() {
      this.interval = setInterval(async () => {
          if (this.first) return;

          await this.getPendingOpportunities();

          if (this.first) {
              if (this.showAlert == false) {
                  this.showModal = true;                        
              }

              this.showAlert = true;
              this.setIntervanSound();
          } else {
            this.showAlert = false;
            this.showModal = false;
          }              
      }, 12000);      
    },
    setIntervanSound() {
      this.intervalSound = setInterval(function () {
        (new Audio('/assets/sounds/tip_sound.wav')).play();
      }, 3000);
    },
    stopIntervalFn() {
      clearInterval(this.interval);
      clearInterval(this.intervalSound);
    },
    answered(id) {
      this.data = this.data.filter(item => item.id != id);

      if (this.isEmpty) {
        this.showAlert = false;
        this.showModal = false;
        if (this.intervalSound) {
          clearInterval(this.intervalSound);
        }
      }
    }
  },
  getters: {
    isEmpty: (state) => {
      return state.data.length == 0;
    },
    count: (state) => {
      return state.data.length;
    },
    first(state) {
      return state.data[0] ?? null;
    },
  }
});