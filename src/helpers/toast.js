import {useToast} from 'vue-toast-notification';
import {trans} from "@/helpers/i18n";

const toast = (function() {
  const toast = useToast({position: 'top-right'});

  return {
    success(msg = '') {
      if (msg == '') {
        msg = trans('global.alerts.success')
      }
      toast.success(msg);
    },

    error(msg = 'Error') {      
      toast.error(msg);
    }
  }
})();


export default toast;