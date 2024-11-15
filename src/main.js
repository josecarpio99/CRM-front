window.AppConfig = {
  name: 'CRM',
  // logo: 'logo',
  url: import.meta.env.VITE_APP_BASE_URL,
  csrf: '{{ csrf_token() }}',
  defaultLocale: 'en',
  defaultTimezone: 'America/Mexico_City',  
}


import {createApp} from 'vue'
import { createPinia } from 'pinia'       

import router from "@/router";
import i18n from "@/plugins/i18n";
import App from "@/App";
import vSelect from 'vue-select';
import ToastPlugin from 'vue-toast-notification';
import {  
  // Directives
  VTooltip,
  // Components
  Dropdown,
  Tooltip,
  Menu
} from 'floating-vue';

import "./styles/icons.css";
import "./styles/main.css";
import 'floating-vue/dist/style.css'
import 'vue-select/dist/vue-select.css';
import 'vue-toast-notification/dist/theme-default.css';

const app = createApp(App)

app.use(createPinia());

app.use(router);
app.use(i18n);
app.use(ToastPlugin);

app.directive('tooltip', VTooltip);
app.component('VDropdown', Dropdown);
app.component('VTooltip', Tooltip);
app.component('VMenu', Menu);
app.component('VSelect', vSelect);

app.mount('#app');




