<template>
  <div class="bg-gray-100 flex" v-if="authStore.user && authStore.user.hasOwnProperty('id')">
      <aside class="relative bg-theme-600 h-screen w-16 hidden sm:block shadow-xl">
          <!-- <div class="p-6 border-b border-theme-600">
              <router-link class="text-white text-3xl font-semibold uppercase hover:text-gray-300" to="/panel/dashboard">
                  <template v-if="state.app.logo">
                      <img :src="state.app.logo" :alt="state.app.name"/>
                  </template>
                  <template v-else>
                      {{ state.app.name }}
                  </template>
              </router-link>
              <template v-if="state.headerLeftLink">
                  <a v-if="state.headerLeftLink.href" :href="state.headerLeftLink.href" class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
                      <Icon :name="state.headerLeftLink.icon" class="mr-3"/>
                      {{ state.headerLeftLink.name }}
                  </a>
                  <router-link v-else :to="state.headerLeftLink.to" class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
                      <Icon :name="state.headerLeftLink.icon" class="mr-3"/>
                      {{ state.headerLeftLink.name }}
                  </router-link>
              </template>
          </div> -->
          <nav class="text-white text-base">
              <Menu :state="state" :type="'desktop'"/>              
          </nav>

          <!-- <div class="absolute w-full bottom-0 bg-theme-500 text-white flex items-center justify-center py-4">
            <span>logo</span>
          </div> -->

          <template v-if="state.footerLeftLink">
              <a v-if="state.footerLeftLink.href" :href="state.footerLeftLink.href" class="absolute w-full bottom-0 bg-theme-800 text-white flex items-center justify-center py-4">
                  <Icon :name="state.footerLeftLink.icon" class="mr-3"/>
                  {{ state.footerLeftLink.name }}
              </a>
              <router-link v-else :to="state.footerLeftLink.to">
                  <Icon :name="state.footerLeftLink.icon" class="mr-3"/>
                  {{ state.footerLeftLink.name }}
              </router-link>
          </template>
      </aside>
      <div class="relative w-full flex flex-col h-screen overflow-y-hidden">
          <!-- Desktop Header -->
          <header class="w-full items-center bg-white py-2 px-6 hidden sm:flex">
              <!-- <div class="w-1/2"></div> -->
              <div class="relative w-1/2 flex" v-if="state.contentReady">

                <Button
                    v-if="showAddButton"
                    :label="trans('global.buttons.add')"
                    @click="handleAddButton"
                />

                <!-- <a class="flex cursor-pointer focus:outline-none align-middle" @click="state.isAddMenuOpen = !state.isAddMenuOpen">
                    <span class="relative pt-3 mr-2">{{ trans('global.buttons.add') }} <Icon :name="state.isAddMenuOpen ? 'angle-up' : 'angle-down'"/></span>
                </a> -->
                <!-- <button v-if="state.isAddMenuOpen" @click="state.isAddMenuOpen = false" class="h-full w-full fixed inset-0 cursor-pointer"></button> -->

                <div v-if="state.isAddMenuOpen" class="absolute w-42 bg-white rounded-lg shadow-lg py-2 mt-16 z-50">
                    <!-- <a href="#" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80" @click="toggleModal('CreatePersonModal')">
                        {{ trans('global.buttons.add_person') }}
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80" @click="toggleModal('CreateCompanyModal')">
                        {{ trans('global.buttons.add_company') }}
                    </a> -->
                    <a href="#" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80" @click="toggleModal('CreateLeadModal')">
                        {{ trans('global.buttons.lead') }}
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80" @click="toggleModal('CreateOportunidadModal')">
                        {{ trans('global.buttons.oportunidad') }}
                    </a>
                    <a href="#" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80" @click="toggleModal('CreateCotizadoModal')">
                        {{ trans('global.buttons.cotizado') }}
                    </a>
                </div>
                  
              </div>
              <div v-else class="relative w-1/2 flex">
                <a class="flex focus:outline-none align-middle">
                      <span class="relative pt-3 mr-2">{{ trans('global.phrases.loading') }} </span>
                </a>
              </div>

              <div class="relative w-1/2 flex justify-end">
                <div class="items-center mr-6 hidden md:flex">
                    <GlobalSearch />
                </div>
                
                <NotificationList />
                <PendingTasks />
            
                  <span class="text-white bg-theme-600 text-xs mr-[0.250rem] h-min lowercase self-center px-2 rounded-xl">{{ trans('users.labels.' + authStore.user.role) }}</span>
                  <a class="flex cursor-pointer focus:outline-none align-middle" @click="state.isAccountDropdownOpen = !state.isAccountDropdownOpen">
                      <span class="relative pt-3 mr-2">{{ authStore.user.name }} <Icon :name="state.isAccountDropdownOpen ? 'angle-up' : 'angle-down'"/></span>
                      <button class="relative z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none">
                          <img :alt="authStore.user.name" v-if="authStore.user.avatar_url" :src="authStore.user.avatar_url">
                          <AvatarIcon v-else/>
                      </button>
                  </a>
                  <button v-if="state.isAccountDropdownOpen" @click="state.isAccountDropdownOpen = false" class="h-full w-full fixed inset-0 cursor-pointer"></button>
                  <div v-if="state.isAccountDropdownOpen" class="absolute w-32 bg-white rounded-lg shadow-lg py-2 mt-16 z-50">
                      <router-link 
                        v-if="authStore.isMasterOrDirector()"
                        :to="{name: 'users.list'}" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80">
                          {{ trans('global.pages.users') }}
                      </router-link>

                      <router-link to="/panel/profile" class="block px-4 py-2 hover:bg-theme-800 hover:text-white hover:opacity-80">
                          {{ trans('global.pages.profile') }}
                      </router-link>
                      <a href="#" @click.prevent="onLogout" class="block px-4 py-2 border-t-[1px] border-gray-200 hover:bg-theme-800 hover:text-white hover:opacity-80">{{
                              trans('global.phrases.sign_out')
                          }}</a>
                  </div>
              </div>
          </header>

          <!-- Mobile Header & Nav -->
          <header class="w-full bg-theme-600 py-5 px-6 sm:hidden">
              <div class="flex items-center justify-between">
                  <router-link class="text-white text-3xl font-semibold uppercase hover:text-gray-300" to="/panel/customers/list">
                      {{ state.app.name }}
                  </router-link>
                  <button @click="state.isMobileMenuOpen = !state.isMobileMenuOpen" class="text-white text-3xl focus:outline-none">
                      <i v-if="!state.isMobileMenuOpen" class="fa fa-bars"></i>
                      <i v-else class="fa fa-times"></i>
                  </button>
              </div>
              <nav :class="state.isMobileMenuOpen ? 'flex': 'hidden'" class="flex flex-col pt-4 text-base text-white">
                  <Menu :state="state" :type="'mobile'"/>
                  
              </nav>
          </header>

          <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
              <main class="w-full flex-grow relative">
                  <router-view :key="route.path" v-if="state.contentReady" />
              </main>
              <!-- <footer class="w-full bg-white text-center text-sm p-4" v-html="trans('global.phrases.copyright')"></footer> -->
          </div>

      </div>
        <template  v-if="state.contentReady">
            <!-- <CreatePersonModal :modalActive="state.showCreatePersonModal" @close-modal="toggleModal('CreatePersonModal')"/> -->
            <CreateCompanyModal :modalActive="state.showCreateCompanyModal" @close-modal="toggleModal('CreateCompanyModal')"/>
            <CreateLeadModal :modalActive="state.showCreateLeadModal" @close-modal="toggleModal('CreateLeadModal')"/>
            <CreateOportunidadModal :modalActive="state.showCreateOportunidadModal" @close-modal="toggleModal('CreateOportunidadModal')"/>
            <CreateCotizadoModal :modalActive="state.showCreateCotizadoModal" @close-modal="toggleModal('CreateCotizadoModal')"/>

            <PendingOpportunityAlert />
        </template>
  </div>
  <template v-else>
      <router-view/>
  </template>
</template>

<script>
import {computed, onBeforeMount, reactive, onMounted, watch} from "vue";
import router from "@/router";
import {trans} from '@/helpers/i18n';
import Menu from "@/views/layouts/Menu";
import Icon from "@/views/components/icons/Icon";
import GlobalSearch from "@/views/components/GlobalSearch";
import PendingTasks from "@/views/components/PendingTasks";
import NotificationList from "@/views/components/NotificationList";
import Button from "@/views/components/input/Button.vue";
import CreatePersonModal from "@/views/pages/private/customers/modals/CreatePersonModal.vue";
import CreateCompanyModal from "@/views/pages/private/customers/modals/CreateCompanyModal.vue";
import CreateLeadModal from "@/views/pages/private/leads/modals/CreateLeadModal.vue";
import CreateOportunidadModal from "@/views/pages/private/deals/modals/CreateOportunidadModal.vue";
import CreateCotizadoModal from "@/views/pages/private/deals/modals/CreateCotizadoModal.vue";
import AvatarIcon from "@/views/components/icons/Avatar";
import PendingOpportunityAlert from "@/views/components/PendingOpportunityAlert";
import {useAuthStore} from "@/stores/auth";
import {useUsersStore} from "@/stores/users";
import {useCustomersStore} from "@/stores/customers";
import {useSourcesStore} from "@/stores/sources";
import {useGlobalStateStore} from "@/stores";
import {useRoute} from "vue-router";
import {useAlertStore} from "@/stores";
import {usePendingOpportunitiesStore} from "@/stores/pendingOpportunities";
import {getAbilitiesForRoute} from "@/helpers/routing";
import {roles} from "@/stub/roles";

export default {
  name: "app",
  components: {
      AvatarIcon,
      Menu,
      Icon,
      CreatePersonModal,
      CreateCompanyModal,
      CreateLeadModal,
      CreateOportunidadModal,
      CreateCotizadoModal,
      Button,
      PendingOpportunityAlert,
      GlobalSearch,
      PendingTasks,
      NotificationList
  },
  setup() {

      const alertStore = useAlertStore();
      const usersStore = useUsersStore();
      const customersStore = useCustomersStore();
      const sourcesStore = useSourcesStore();
      const authStore = useAuthStore();
      const pendingOpportunitiesStore = usePendingOpportunitiesStore();
      const globalStateStore = useGlobalStateStore();
      const route = useRoute();

      const showAddButton = computed(() => ['deals', 'customers', 'leads'].some((word) => route.name.startsWith(word) || route.name == 'users.list' ));
      
      const isLoading = computed(() => {
          var value = false;
          for(var i in globalStateStore.loadingElements) {
              if(globalStateStore.loadingElements[i]){
                  value = true;
                  break;
              }
          }
          return value || globalStateStore.isUILoading;
      })

      const state = reactive({
          mainMenu: [
            //   {
            //       name: trans('global.pages.home'),
            //       icon: 'home',
            //       showDesktop: true,
            //       showMobile: true,
            //       requiresAbility: false,
            //       to: '/panel/dashboard',
            //   },
              {
                  name: trans('global.pages.leads'),
                  icon: 'user-plus',
                  showDesktop: true,
                  showMobile: true,
                  requiresAbility: false,
                  permission : 'view:leads',
                  to: '/panel/leads/list',
              },
              {
                  name: trans('global.pages.wallet'),
                  icon: 'building-o',
                  showDesktop: true,
                  showMobile: true,
                  requiresAbility: false,
                  to: '/panel/customers/list',
              },
            //   {
            //       name: trans('deals.menu.oportunidades'),
            //       icon: 'sign-in',
            //       showDesktop: true,
            //       showMobile: true,
            //       requiresAbility: false,
            //       to: '/panel/deals/oportunidades/list',
            //   },
            //   {
            //       name: trans('deals.menu.cotizados'),
            //       icon: 'dollar',
            //       showDesktop: true,
            //       showMobile: true,
            //       requiresAbility: false,
            //       to: '/panel/deals/cotizados/list',
            //   },           
              {
                  name: trans('global.pages.publicity'),
                  icon: 'briefcase',
                  showDesktop: true,
                  showMobile: true,
                  requiresAbility: false,
                //   permission: 'view:deals',
                  to: '/panel/deals/publicidad/list',
              },           
              {
                  name: trans('global.menu.reports'),
                  icon: 'bar-chart',
                  showDesktop: true,
                  showMobile: true,
                  requiresAbility: false,
                  to: '/panel/reportes/lista',
              },           
            //   {
            //       name: trans('global.pages.users'),
            //       icon: 'user',
            //       showDesktop: true,
            //       showMobile: true,
            //       requiresRole: roles.SUPERADMIN,
            //       to: '/panel/users/list',
            //       children: [
            //           {
            //               name: trans('global.phrases.all_records'),
            //               icon: '',
            //               showDesktop: true,
            //               showMobile: true,
            //               requiresRole: roles.SUPERADMIN,
            //               to: '/panel/users/list',
            //           },
            //           {
            //               name: trans('global.buttons.add_new'),
            //               icon: '',
            //               showDesktop: true,
            //               showMobile: true,
            //               requiresRole: roles.SUPERADMIN,
            //               to: '/panel/users/create',
            //           }
            //       ]
            //   },                
              {
                  name: trans('global.phrases.sign_out'),
                  icon: 'sign-out',
                  showDesktop: false,
                  showMobile: true,
                  showIfRole: false,
                  onClick: onLogout,
                  to: '',
              }
          ],            
          isAccountDropdownOpen: false,
          isAddMenuOpen: false,
          isMobileMenuOpen: false,
          showCreatePersonModal: false,
          showCreateCompanyModal: false,
          showCreateLeadModal: false,
          showCreateOportunidadModal: false,
          showCreateCotizadoModal: false,
          contentReady: false,
          currentExpandedMenuItem: null,
          app: window.AppConfig,
      });    

      function onLogout() {
          authStore.logout()
      }

      function toggleModal(key) {
        alertStore.clear();
        state.isAddMenuOpen = false;
        if (key === 'CreatePersonModal') {
            state.showCreatePersonModal = !state.showCreatePersonModal;            
        }
        if (key === 'CreateCompanyModal') {
            state.showCreateCompanyModal = !state.showCreateCompanyModal;
        }
        if (key === 'CreateLeadModal') {
            state.showCreateLeadModal = !state.showCreateLeadModal;
        }
        if (key === 'CreateOportunidadModal') {
            state.showCreateOportunidadModal = !state.showCreateOportunidadModal;
        }
        if (key === 'CreateCotizadoModal') {
            state.showCreateCotizadoModal = !state.showCreateCotizadoModal;
        }

        if (
            state.showCreateCompanyModal == true || 
            state.showCreateLeadModal == true || 
            state.showCreateOportunidadModal == true || 
            state.showCreateCotizadoModal == true || 
            state.showCreatePersonModal == true
        ) {
            alertStore.showOnPage = false;
        } else {
            alertStore.showOnPage = true;
        }
      }

      function handleAddButton() {
        if (route.name.startsWith('customers')) {
            toggleModal('CreateCompanyModal');
        }

        if (route.name.startsWith('lead')) {
            toggleModal('CreateLeadModal');
        }

        if (route.name.startsWith('deals')) {
            let type = (route.name.split('.'))[1]
            if (type == 'oportunidades') {                
                toggleModal('CreateOportunidadModal');
            } else {
                toggleModal('CreateCotizadoModal');
            }
        }

        if (route.name.startsWith('users')) {
            router.push({name: 'users.create'})
        }
      }

      async function loadData() {
        if (!usersStore.userList) {
            await usersStore.getUserList();            
        }
        if (!customersStore.customerList) {
            await customersStore.getCustomerList();            
        }
        if (!sourcesStore.sourceList) {
            await sourcesStore.getSourceList();         
        }       
        
        state.contentReady = true;

        // if (authStore.user.role === roles.ADVISOR) {
        //     pendingOpportunitiesStore.setIntervalFn();
        // }
      }  

      onBeforeMount(async () => {        
          if (route.query.hasOwnProperty('verified') && route.query.verified) {
              alertStore.success(trans('global.phrases.email_verified'));
          }        
      });
      

    //   onMounted(async () => {
    //     if (authStore.user.role === roles.ADVISOR) {
    //         const interval = setInterval(async () => {
    //             await pendingOpportunitiesStore.getPendingOpportunities();
    //             console.log(pendingOpportunitiesStore.data);
    //         }, 2000);
    //     }
    //   })

      watch(authStore, (newState) => {
        if (authStore.loggedIn) {
            loadData();
        }
      })

      return {
          state,
          authStore,
          usersStore,
          customersStore,
          sourcesStore,
          globalStateStore,
          trans,
          onLogout,
          isLoading,
          toggleModal,
          alertStore,
          route,
          showAddButton,
          handleAddButton
      }
  }
};
</script>
