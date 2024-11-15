import {createI18n} from 'vue-i18n'
import es from '@/locales/es/messages.json'

// function loadLocaleMessages() {
//     const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
//     const messages = {};
//     locales.keys().forEach((key) => {
//         const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//         if (matched && matched.length > 1) {
//             const matched = key.match(/([A-Za-z0-9-_]+)\//i);
//             const matchedModule = key.match(/([A-Za-z0-9-_]+)\./i);
//             if (matched && matched.length > 1 && matched && matchedModule.length > 1) {
//                 const locale = matched[1];
//                 const module = matchedModule[1];
//                 if (!messages[locale]) messages[locale] = {};
//                 messages[locale][module] = locales(key);
//             }
//         }
//     });
//     return messages;
// }




// let defaultLocale = window.AppConfig.defaultLocale;
let defaultLocale = 'es';
let messages = {'es': es}
const i18n = createI18n({
    locale: localStorage.locale ?? defaultLocale,
    fallbackLocale: defaultLocale,
    messages,
    legacy: false,
    globalInjection: true
})

export default i18n;
