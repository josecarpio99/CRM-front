<template>
    <Transition name="top-menu">
        <div v-if="showTopMenu && $props.displayTopMenu" class="bg-gray-800/80 absolute top-0 right-0 bottom-0 left-0 z-50">
            <div class="bg-white p-10 pb-14">
                <div class="mb-12 flex items-center cursor-pointer">
                    <Icon 
                        @click="showTopMenu = false"
                        class="text-gray-500 text-lg hover:text-gray-700 cursor-pointer" 
                        name="remove" 
                    />
                    <h3 class="ml-8 text-gray-600 text-2xl">{{ trans('global.labels.work_center') }}</h3>
                </div>
                <slot name="top-menu" />
            </div>
        </div>
    </Transition>

    <div class="">
        <div 
            v-if="$props.title || $props.breadcrumbs.length > 0"
            class="flex flex-wrap justify-between py-6 px-8 pb-2 border-b-2 bg-white"
        >
            <div>
                <div class="flex ">
                    <span 
                        v-if="$props.showGoBack"
                        class="flex items-center mr-3"
                    >
                        <Icon
                            name="chevron-left"
                            class="text-gray-500 text-lg hover:text-gray-700 cursor-pointer"
                            v-tooltip.right="'Volver'"
                            @click="$router.go(-1)"
                        />
                    </span>

                    <span class="mr-2">
                        <Icon 
                            v-if="$props.displayTopMenu" 
                            name="bars" 
                            class="text-gray-500 text-lg hover:text-gray-700 cursor-pointer mr-2" 
                            @click="showTopMenu = true"
                        />
                    </span>
                    <h2 
                        class="group bold text-2xl mb-3"
                        :class="{hidden:showInput}"
                    >
                        
                        {{ $props.title }}

                        <span 
                            v-if="$props.titleEditable"
                            @click="handleTitleClick" 
                            class="cursor-pointer text-lg invisible align-middle text-gray-400 hover:text-gray-700 group-hover:visible"
                        >
                            <i class="fa fa-pencil"></i>
                        </span>

                        <Icon v-if="$props.titleIcon" :name="$props.titleIcon?.name" class="text-gray-500 ml-2" />                        
    
                    </h2>                    

                    <input 
                        v-if="$props.titleEditable" 
                        type="text" 
                        ref="inputElement" 
                        @blur="handleTitleBlur" 
                        @keypress.enter="handleTitleEnter"
                        v-model="titleInputValue" 
                        class="border text-xl border-gray focus:outline-none focus:ring focus:ring-transparent focus:border-gray-500" 
                        :class="`${showInput ? 'block' : 'hidden'}`"
                    >
                    <slot name="beside-title">
                                         
                    </slot>
                </div>
                <!-- Breadcrumbs -->
                <nav class="flex" aria-label="Breadcrumb" v-if="$props.breadcrumbs.length > 0">
                    <ol class="inline-flex items-center space-x-1 md:space-x-3">
                        <li class="inline-flex items-center">
                            <router-link :to="toUrl('/customers/list')" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                <i class="fa fa-home mr-3"></i>
                                {{ trans('global.pages.home') }}
                            </router-link>
                        </li>
                        <li v-for="(item, index) in $props.breadcrumbs" :aria-current="index < ($props.breadcrumbs.length -1) ? 'page' : ''">
                            <div class="flex items-center">
                                <i class="fa fa-angle-right"></i>
                                <router-link v-if="index < ($props.breadcrumbs.length -1)" :to="item.to" class="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white" v-html="item.name"/>
                                <span v-else class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400" v-text="item.name"></span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <slot name="page-actions">
                <div class="flex items-center" v-if="$props.actions.length > 0">                
                    <slot v-for="(action, j) in $props.actions" :name="'page-actions-'+action.id">
                        <Button v-if="action.hasOwnProperty('to') && action.to" :class="{'mr-3' : j < ($props.actions.length-1)}" :to="action.to" :title="action.name" :icon="action.hasOwnProperty('icon') ? action.icon : null" :theme="action.hasOwnProperty('theme') ? action.theme : null" :label="action.name"/>
                        <Button v-else @click="onPageActionClick({action: action})" :class="{'mr-3' : j < ($props.actions.length-1)}" :title="action.name" :icon="action.hasOwnProperty('icon') ? action.icon : null" :theme="action.hasOwnProperty('theme') ? action.theme : null" :label="action.name"/>
                    </slot>
                </div>
            </slot>
        </div>

        <slot :name="'under-top'" ></slot>
        <Alert class="px-6 pt-6" v-if="alertStore.showOnPage" />

        <slot name="filters"></slot>
        <div class="grid grid-cols-1" :class="$props.pagePadding ? 'p-6' : ''">
            <template v-if="isElementLoading">
                <div class="pt-10 pb-6 text-center">
                    <Spinner/>
                </div>
            </template>
            <slot v-else></slot>
        </div>
    </div>

    <div class="py-4"></div>
    <div v-if="$props.showFooter" class="w-full bg-white fixed bottom-0 text-center text-sm border-t-2 pl-16 py-6 pr-4">
        <slot :name="'footer'">
        </slot>
    </div>
</template>

<script>
import {computed, defineComponent, ref, watch} from "vue";
import {trans} from "@/helpers/i18n";
import {toUrl} from "@/helpers/routing";
import Button from "@/views/components/input/Button";
import Alert from "@/views/components/Alert";
import Spinner from "@/views/components/icons/Spinner";
import Icon from "@/views/components/icons/Icon";
import {useGlobalStateStore} from "@/stores";
import {storeToRefs} from "pinia";
import {useAlertStore} from "@/stores";

export default defineComponent({
    name: "Page",
    components: {Alert, Button, Spinner, Icon},
    props: {
        id: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        titleEditable: {
            type: Boolean,
            default: false,
        },
        titleIcon: {
            type: Object,
            default: null,
        },
        breadcrumbs: {
            type: Array,
            default: []
        },
        actions: {
            type: Array,
            default: []
        },
        titleActions: {
            type: Array,
            default: []
        },
        pagePadding: {
            type: Boolean,
            default: true
        },
        showFooter: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        displayTopMenu: {
            type: Boolean,
            default: false
        },
        showGoBack: {
            type: Boolean,
            default: false
        }  
    },
    emits: ['action', 'title-change'],
    setup(props, {emit}) {

        const alertStore = useAlertStore();
        const showTopMenu = ref(false);
        const titleInputValue = ref(props.title);
        const showInput = ref(false);
        const inputElement = ref();

        function onPageActionClick(data) {
            emit('action', data);
        }

        const isElementLoading = computed(() => {
            return useGlobalStateStore().loadingElements[props.id] || props.isLoading;
        });

        watch(() => props.title, (newValue) => {  
            titleInputValue.value = newValue;
        });

        function handleTitleClick()
        {
            showInput.value = true            
            setTimeout(()=>{
                (inputElement.value).focus()
            }, 200)  
            
        }

        function handleTitleBlur()
        {        
            showInput.value = false;
            titleInputValue.value = props.title;    
        }

        function handleTitleEnter()
        {
            showInput.value = false
            emit('title-change', {
                value: titleInputValue.value
            })
        }

        return {
            trans,
            toUrl,
            onPageActionClick,
            isElementLoading,
            alertStore,
            showTopMenu,
            titleInputValue,
            showInput,
            inputElement,
            handleTitleEnter,
            handleTitleClick,
            handleTitleBlur
        }
    }
})
</script>

<style>
.top-menu-enter-active,
.top-menu-leave-active {
  transition: transform 0.3s ease;
}

.top-menu-enter-from,
.top-menu-leave-to {
  transform: translateY(-100%);
}
</style>
