<template>
    <main class="bg-white flex items-center justify-center min-h-screen">
        <div class="bg-gray-50 border-4 flex rounded-2xl shadow-lg w-1/2 max-w-lg items-center">
            <div class="w-full px-8 md:px-16 py-8">
                <slot></slot>
            </div>
            <!-- <div class="md:block hidden w-1/2">
                <img :alt="AppConfig.name" class="rounded-2xl" src="/assets/images/login.jpg">
            </div> -->
        </div>
    </main>
</template>

<script>

import {defineComponent} from 'vue'
import {trans} from '@/helpers/i18n';

export default defineComponent({
    name: "Auth",
    setup() {

        let AppConfig = window.AppConfig;

        return {
            trans,
            AppConfig
        }
    }
});
</script>
