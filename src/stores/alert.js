import {defineStore} from 'pinia';

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => {
        return {
            messages: [],
            type: null,
            showOnPage: true
        }
    },
    actions: {
        success(message) {
            this.alert(message, 'success');            
        },
        error(message) {
            this.alert(message, 'error');            

        },
        push(message) {
            if (Array.isArray(message) || (typeof message === 'object' && message != null)) {
                for (let i in message) {
                    this.messages.push(message[i]);
                }
            } else {
                this.messages.push(message);
            }
        },
        clear() {
            this.messages = [];
            this.type = null;
        },
        isSuccess() {
            return this.type === 'success';
        },
        isError() {
            return this.type === 'error';
        },
        hasAlert() {
            return this.messages.length > 0 && this.type != null;
        },
        hasMultiple() {
            return (Array.isArray(this.messages.length) && this.messages.length > 1) || ((typeof this.messages === 'object' && this.messages != null)  &&Object.keys(this.messages).length > 1);
        },
        alert(message, type) {
            this.clear();
            this.push(message);
            this.type = type;
            if (type === 'success') {
                setTimeout(() => {
                    this.clear();
                }, 2000);
            }
        }
    }
});
