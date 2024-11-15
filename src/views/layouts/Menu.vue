<template>
    <ul class="aside-menu">
        <!-- <li 
            class="logo" 
        >                 
            <img src="/assets/images/logo.png" class="w-10 h-10" alt="logo">

        </li> -->
        <li
            v-tooltip.right="trans('global.pages.home')"
            class="logo group hover:bg-theme-600"
        >
            <router-link :to="'/panel/customers/list'" class="flex items-center text-base text-white font-semibold rounded-lg group-hover:text-theme-300">
                <img src="/assets/images/logo.png" class="w-8 h-8" alt="logo">                        
            </router-link>                  
        </li> 
        <template v-for="item in $props.state.mainMenu">            
            <li v-if="item.hasOwnProperty('children') && item.children.length > 0 && isEnabled(item, $props.type)"
                class="hover:bg-theme-600" :class="isActive(item) ? 'bg-theme-800' : ''"    
            >
                <button @click.prevent="state.currentExpandedMenuItem  ? state.currentExpandedMenuItem = null : state.currentExpandedMenuItem = item" type="button" class="transition duration-75 group w-full flex items-center p-2 text-base font-normal text-white font-semibold rounded-lg hover:text-theme-300 hover:bg-theme-800 dark:hover:bg-theme-800">
                    <Icon :name="item.icon" class="mr-2 pl-2 -mt-1"/>
                    <!-- <span class="flex-1 text-left" v-html="item.name"></span> -->
                    <Icon :name="JSON.stringify(state.currentExpandedMenuItem) === JSON.stringify(item) ? 'angle-up' : 'angle-down'" class="mr-2 pl-2 -mt-1"/>
                </button>
                <ul id="dropdown-example" class="py-2 space-y-2" :class="JSON.stringify(state.currentExpandedMenuItem) === JSON.stringify(item) ? '' : 'hidden'">
                    <template v-for="subitem in item.children">
                        <template v-if="isEnabled(subitem, $props.type)">
                            <li v-if="subitem.hasOwnProperty('onClick')">
                                <router-link :to="subitem.to ? subitem.to : '#'" @click.prevent="subitem.onClick" class="flex items-center p-2 pl-11 w-full text-base font-normal text-white font-semibold rounded-lg hover:text-theme-300 hover:bg-theme-800 dark:hover:bg-theme-800" :class="isActive(subitem) ? 'bg-theme-800' : ''">
                                    {{ subitem.name }}
                                    <span class="sr-only" v-html="subitem.name"></span>
                                </router-link>
                            </li>
                            <li v-else>
                                <router-link :to="subitem.to ? subitem.to : '#'" class="flex items-center p-2 pl-11 w-full text-base font-normal text-white font-semibold rounded-lg hover:text-theme-300 hover:bg-theme-800 dark:hover:bg-theme-800" :class="isActive(subitem) ? 'bg-theme-800' : ''">
                                    {{ subitem.name }}
                                    <span class="sr-only" v-html="subitem.name"></span>
                                </router-link>
                            </li>
                        </template>
                    </template>

                </ul>
            </li>
            <li v-else-if="isEnabled(item, $props.type)" v-tooltip.right="item.name"
                class="group hover:bg-theme-600" :class="isActive(item) ? 'bg-theme-400' : ''"
            >
                <a v-if="item.hasOwnProperty('onClick') && !item.to" href="#" class="flex items-center p-2 text-base text-white font-semibold rounded-lg group-hover:text-theme-300" @click.prevent="item.onClick">
                    <Icon :name="item.icon" class="mr-2 pl-2 -mt-1"/>
                    <!-- <span class="ml-1" v-html="item.name"></span>
                    <span class="sr-only" v-html="item.name"></span> -->
                    <span v-if="item.hasOwnProperty('label') && item.label" class="inline-flex justify-center items-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" v-html="item.label"></span>
                </a>
                <router-link v-else :to="item.to ? item.to : '#'" class="flex items-center p-2 text-base text-white font-semibold rounded-lg group-hover:text-theme-300">
                    <Icon :name="item.icon" class="mr-2 pl-2 -mt-1"/>
                    <!-- <span class="ml-1" v-html="item.name"></span>
                    <span class="sr-only" v-html="item.name"></span> -->
                    <span v-if="item.hasOwnProperty('label') && item.label" class="inline-flex justify-center items-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" v-html="item.label"></span>
                </router-link>
            </li>            
        </template>        
        <!-- <li
            v-if="authStore.isDirector()"
            v-tooltip.right="'Scorecard'"
            class="group hover:bg-theme-600"
        >
            <router-link :to="{name: 'reports.scorecard'}" class="flex items-center p-2 text-base text-white font-semibold rounded-lg group-hover:text-theme-300">
                <Icon :name="'bar-chart'" class="mr-2 pl-2 -mt-1"/>                        
            </router-link>                  
        </li> 
        <VMenu
            v-else-if="can('view:reports')"
            placement="right"
        >
            
                <li
                    class="group hover:bg-theme-600"
                >
                    <a href="#" class="flex items-center p-2 text-base text-white font-semibold rounded-lg group-hover:text-theme-300">
                        <Icon :name="'bar-chart'" class="mr-2 pl-2 -mt-1"/>                        
                    </a>                  
                </li> 
            

            <template #popper >
                <ul>
                    <li class="py-2 px-4 border-b-[1px] border-gray-400 hover:bg-gray-200" >
                        <router-link :to="{name: 'reports.opportunities_best_customers'}">
                            {{ trans('deals.menu.opportunities_best_customers') }}
                        </router-link>  
                    </li>
                    <li class="py-2 px-4 border-b-[1px] border-gray-400 hover:bg-gray-200" >
                        <router-link :to="{name: 'reports.opportunities_best_sizes'}">
                            {{ trans('deals.menu.opportunities_best_sizes') }}
                        </router-link>  
                    </li>
                    <li class="py-2 px-4 border-b-[1px] border-gray-400 hover:bg-gray-200" >
                        <router-link :to="{name: 'reports.firm_quotes'}">
                            {{ trans('deals.menu.firm_quotes') }}
                        </router-link>  
                    </li>
                    <li class="py-2 px-4 border-b-[1px] border-gray-400 hover:bg-gray-200">
                        <router-link :to="{name: 'reports.scorecard'}">
                            {{ trans('global.menu.scorecard') }}
                        </router-link>  
                    </li>
                </ul>


                
            </template>
        </VMenu>  -->
    </ul>
</template>

<script>

import {defineComponent} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores";
import Icon from "@/views/components/icons/Icon";
import {trans} from '@/helpers/i18n';
import {can} from '@/helpers/permissions';

export default defineComponent({
    name: "Menu",
    components: {
        Icon
    },
    props: {
        state: {
            type: Object,
            default: {},
        },
        type: {
            type: String,
            default: '',
        }
    },
    setup(props) {

        const router = useRouter();
        const authStore = useAuthStore();

        function isActive(obj) {

            let currentPath = router.currentRoute.value.path;
            let isActiveMainItem = obj.to === currentPath;
            let isActiveSubItem = false;
            if (obj.hasOwnProperty('children')) {
                for (let i in obj.children) {
                    if (obj.children[i].to === currentPath) {
                        isActiveSubItem = true;
                        break;
                    }
                }
            }
            return isActiveMainItem || isActiveSubItem;
        }

        function isEnabled(obj, type) {

            if (!obj) {
                return false;
            }            

            if (obj.hasOwnProperty('permission') && false !== obj.requiresRole) {
                return can(obj.permission);
            }   

            if (obj.hasOwnProperty('requiresRole') && false !== obj.requiresRole) {
                return authStore.hasAccessByRole(obj.requiresRole);
            }          

            let hasPermission = obj.hasOwnProperty('requiresAbility') && false !== obj.requiresAbility ? authStore.hasAbilities(obj.requiresAbility) : true;

            let totalEnabledSubItems = 0;
            if (obj.hasOwnProperty('children')) {
                for (let i in obj.children) {
                    if (isEnabled(obj.children[i], type)) {
                        totalEnabledSubItems++;
                    }
                }
            } else {
                totalEnabledSubItems = 1;
            }

            if (type === 'desktop') {
                return hasPermission && obj.showDesktop && totalEnabledSubItems > 0;
            } else if (type === 'mobile') {
                return hasPermission && obj.showMobile && totalEnabledSubItems > 0;
            }
            return false;
        }

        return {
            isEnabled,
            isActive,
            trans,
            authStore,
            can
        }
    }
});
</script>

<style>

.aside-menu li.logo, 
.aside-menu li a {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0px;
}

.aside-menu li.logo { 
    padding: 8px 0;
}

.aside-menu li.logo a{ 
    padding: 0;
}

</style>
