<template>
  <Page 
    :title="page.title" 
    :titleIcon="page.titleIcon" 
    :breadcrumbs="page.breadcrumbs" 
    :pagePadding="false" 
    :is-loading="page.loading"
    :show-go-back="true"
    @action="onPageAction"
  >  
    <template #beside-title>
      <div v-if="customer && customer.star" class="flex items-center ml-2">
        <StarToggle :modelValue="customer.star" iconClass="h-6 w-6" :clickable="false" class="text-center" />
      </div>

      <div class="flex items-center ml-6" v-if="customer">
        <slot v-for="(action, j) in page.actions" :name="'page-actions-'+action.id">
            <Button v-if="action.hasOwnProperty('to') && action.to" :class="{'mr-3' : j < (page.actions.length-1)}" class="py-[.375rem]" :to="action.to" :title="action.name" :icon="action.hasOwnProperty('icon') ? action.icon : null" :theme="action.hasOwnProperty('theme') ? action.theme : null" :label="action.name"/>
            <Button v-else @click="onPageAction({action: action})" :class="{'mr-3' : j < (page.actions.length-1)}" class="py-[.375rem]" :title="action.name" :icon="action.hasOwnProperty('icon') ? action.icon : null" :theme="action.hasOwnProperty('theme') ? action.theme : null" :label="action.name"/>
        </slot>
      </div>
    </template>

    <Panel v-if="customer" :borderRounded="false" :bodyPadding="false" >
      <div class="flex w-full max-h-[70vh]">
        <div class="basis-full border-r-2 overflow-auto pt-4 pr-4 pl-10">

          <!-- <div v-if="customer.company_name" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.company_name') }}</h4>
            <span>{{ customer.company_name }}</span>
          </div> -->

          <div v-if="customer.owner" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.owner') }}</h4>
            <div class="flex w-fit items-center bg-gray-100 p-2 pl-0 rounded-2xl">
              <CircleAvatarIcon class="w-8 h-8" :avatarUrl="customer.owner?.avatar_url" :user="customer.owner" />            
              <span>{{ customer.owner.name }}</span>
            </div>
          </div>

          <div v-if="customer.creator && can('view:created_by')" class="mb-6">
            <h4 class="font-semibold">{{ trans('global.labels.created_by') }}</h4>
            <div class="flex w-fit items-center bg-gray-100 p-2 pl-0 rounded-2xl">
              <CircleAvatarIcon class="w-8 h-8" :avatarUrl="customer.creator?.avatar_url" :user="customer.creator" />            
              <span>{{ customer.creator.name }}</span>
            </div>
          </div>

          
          <div class="mb-6">
            <h4 class="font-semibold mb-2">Total Ganado</h4>
            <ValueField :value="totalValueWon" :large="true" />
          </div>  
          

          <!-- <div v-if="customer.customer_status" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.customer_status') }}</h4>
            <span>{{ customer.customer_status }}</span>
          </div>

          <div v-if="customer.potential_customer_status" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.potential_customer_status') }}</h4>
            <span>{{ customer.potential_customer_status }}</span>
          </div> -->

          <div v-if="customer.category" class="mb-6">
            <h4 class="font-semibold mb-2">{{ trans('customers.labels.category') }}</h4>
            <DealCategoryField :value="customer?.category?.name" />
          </div>

          <div v-if="customer.source" class="mb-6">
            <h4 class="font-semibold mb-2">{{ trans('deals.labels.source') }}</h4>
            <SourceField :value="customer?.source?.name" />
          </div> 

          <div v-if="customer.razon_social" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.razon_social') }}</h4>
            <span>{{ customer.razon_social }}</span>
          </div>

          <div v-if="customer.name" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.name') }}</h4>
            <span>{{ customer.name }}</span>
          </div>

          <div v-if="customer.mobile" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.mobile') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'phone'" 
              />
              <span>{{ customer.mobile }}</span>
            </div>
          </div>

          <div v-if="customer.email" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.email') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'envelope-o'" 
              />
              <span>{{ customer.email }}</span>
            </div>
          </div>

          <div v-if="customer.created_at" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.created_at') }}</h4>
            <div class="flex items-center">
              <Icon 
                class="mr-2 align-middle text-gray-500" 
                :name="'globe-w'" 
              />
              <span>{{ $date(customer.created_at).format() }}</span>
            </div>
          </div>

          <div v-if="customer.city" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.city') }}</h4>
            <span class="whitespace-normal">{{ customer.city }}</span>
          </div>

          <div v-if="customer.logo" class="mb-8">
            <h4 class="font-semibold">{{ trans('global.labels.logo') }}</h4>
            <img class="img h-20" :src="customer.logo.img_url" alt="Logo">
          </div>       

          <!-- <div v-if="customer.origin" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.origin') }}</h4>
            <span>{{ customer.origin }}</span>
          </div>

          <div v-if="customer.position" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.position') }}</h4>
            <span>{{ customer.position }}</span>
          </div>

          <div v-if="customer.sector" class="mb-6">
            <h4 class="font-semibold">{{ trans('customers.labels.sector') }}</h4>
            <span>{{ customer.sector.name }}</span>
          </div> -->

        </div>
        <div class="basis-[120%] border-r-2 overflow-auto pt-2 px-4">
          <Note @submit="onNoteSubmit" />          
          <ListFeed />
        </div>
        <div class="basis-9/12 overflow-auto pt-2 px-4">
          <ContactsList 
            :contacts="customer.contacts"
            @submit="onContactSubmit" 
            @update="onContactUpdate" 
          />
          <!-- <ActiveOpportunities :deals="customer.activeOpportunities" />
          <ActiveQuotes :deals="customer.activeQuotes" /> -->
          <ActiveDeals :deals="customer.activeDeals" />
          <ActiveDeals
            :title="'Proyectos Ganados'"
            :deals="customer.wonDeals" 
          />
          <Task @submit="onTaskSubmit" />
          <CustomerProjects :projects="customer.projects" />
          
          <Document 
            @submit="onDocumentSubmit" 
            :documents="documentStore.mediaFiles"
            :is-loading="isLoadingDocument"
          />
        </div>
      </div>
    </Panel>

  </Page>
  <CreateOportunidadModal v-if="customer" :customer_id="customer.id" :modalActive="showCreateOportunidadModal" @close-modal="toggleModal('showCreateOportunidadModal')"/>
  <CreateCotizadoModal v-if="customer" :customer_id="customer.id" :modalActive="showCreateCotizadoModal" @close-modal="toggleModal('showCreateCotizadoModal')"/>

  <!-- <EditPersonModal v-if="customer" :show-delete="true" :modalActive="showEditPersonModal" :customer="customer" @updated="onModalUpdate" @close-modal="toggleModal" @delete="onModalDelete" /> -->
  <EditCompanyModal v-if="customer" :show-delete="can('view:delete')" :modalActive="showEditCompanyModal" :customer="customer" @updated="onModalUpdate" @close-modal="toggleModal('showEditCompanyModal')" @delete="onModalDelete" />

</template>

<script setup>
import {reactive, ref, computed, onBeforeMount, onMounted} from "vue";
import router from "@/router";
import {useRoute} from "vue-router";
import toast from '@/helpers/toast';
import {trans} from "@/helpers/i18n";
import {toUrl} from "@/helpers/routing";
import alertHelpers from "@/helpers/alert";
import {can} from "@/helpers/permissions";
import $date from "@/helpers/date";
import CustomerService from "@/services/CustomerService";
import NoteService from "@/services/NoteService";
import TaskService from "@/services/TaskService";
import DocumentService from "@/services/DocumentService";
import ContactService from "@/services/ContactService";
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";
import {useTaskStore} from "@/stores/tasks";
import {useNoteStore} from "@/stores/notes";
import {useFeedStore} from "@/stores/feed";
import {useDocumentStore} from "@/stores/document";
import Panel from "@/views/components/Panel";
import Note from "@/views/components/Note";
import Document from "@/views/components/Document";
import ActiveOpportunities from "@/views/components/ActiveOpportunities";
import ActiveQuotes from "@/views/components/ActiveQuotes";
import ActiveDeals from "@/views/components/ActiveDeals";
import CustomerProjects from "@/views/components/CustomerProjects";
import Task from "@/views/components/task/Task";
import ListFeed from "@/views/components/ListFeed";
import Page from "@/views/layouts/Page";
import CreateOportunidadModal from "@/views/pages/private/deals/modals/CreateOportunidadModal.vue";
import CreateCotizadoModal from "@/views/pages/private/deals/modals/CreateCotizadoModal.vue";
import EditPersonModal from "@/views/pages/private/customers/modals/EditPersonModal.vue";
import EditCompanyModal from "@/views/pages/private/customers/modals/EditCompanyModal.vue";
import Icon from "@/views/components/icons/Icon";
import CircleAvatarIcon from "@/views/components/icons/CircleAvatar";
import Button from "@/views/components/input/Button";
import StarToggle from "@/views/components/input/StarToggle";
import DealCategoryField from "@/views/components/DealCategoryField";
import SourceField from "@/views/components/SourceField";
import ContactsList from "@/views/components/contact/ContactsList.vue";
import ValueField from "@/views/components/ValueField";

const authStore = useAuthStore();
const alertStore = useAlertStore();
const taskStore = useTaskStore();
const noteStore = useNoteStore();
const feedStore = useFeedStore();
const documentStore = useDocumentStore();

const customerService = new CustomerService();
const noteService = new NoteService();
const taskService = new TaskService();
const documentService = new DocumentService();
const contactService = new ContactService();

const route = useRoute();
const showEditCompanyModal = ref(false);
const showCreateOportunidadModal = ref(false);
const showCreateCotizadoModal = ref(false);
const isLoadingDocument = ref(false);

let customer = null;
const totalValueWon = computed(() => {
  return customer.wonDeals.reduce((acc, project) => {
    return acc + project.value
  }, 0)
})

const page = reactive({
    id: 'show_customer',
    title: null,    
    filters: false,
    breadcrumbs: [
        {
            name: trans('global.pages.wallet'),
            to: toUrl('/customers/list'),

        },
        {
            name: trans('global.labels.company'),
            active: true,
        }
    ], 
    loading: true,
    actions: [
      {
        id: 'edit',
        name: trans('global.actions.edit'),
        type: 'button'
      },
      {
        id: 'add_project',
        name: trans('deals.labels.create_project'),
        theme: 'outline',
        type: 'button'
      },
      // {
      //   id: 'add_cotizado',
      //   name: trans('deals.labels.add_cotizado'),
      //   theme: 'outline',
      //   type: 'button'
      // },
    ]
});

function onNoteSubmit({content}) {
  if(!content) {
    toast.error(trans('global.phrases.empty_value'));
    return;
  }

  noteService.store({
    note_type: 'customer',
    id: customer.id,
    user_id: authStore.user.id,
    content,
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();     
      fetchRecord();
    }
  });
}

function onTaskSubmit({content, due_at, owner}) { 
  taskService.store({
    content: content,
    due_at: due_at,
    owner_id: owner.id,
    task_type: 'customer',
    id: customer.id,
    user_id: authStore.user.id
  }).then(res => {
    if (res.status == 200 || res.status == 201) {
      authStore.getCurrentUser();
      toast.success();
      fetchRecord();
    }
  });
}

function onDocumentSubmit({file}) {
  isLoadingDocument.value = true;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", 'customer');
  formData.append("model_id", customer.id);
  formData.append("collection", 'files');
  documentService.store(formData, {'Content-type': 'multipart/form-data'}
  ).then(res => {
    if (res.status == 200 || res.status == 201 || res.status == 204) {
      toast.success();  
      isLoadingDocument.value = false;
      fetchRecord();
    }
  });
}

function onPageAction(data) {
  switch(data.action.id) {
    case 'edit':
      toggleModal('showEditCompanyModal');
      break;
    case 'add_project':
      toggleModal('showCreateCotizadoModal');
      break;
    // case 'add_oportunidad':
    //   toggleModal('showCreateOportunidadModal');
    //   break;
  }
}

function toggleModal(key) {
  alertStore.clear();
  // showEditCompanyModal.value = !showEditCompanyModal.value;  
  
  if (key === 'showEditCompanyModal') {
      showEditCompanyModal.value = !showEditCompanyModal.value;            
  }
  if (key === 'showCreateOportunidadModal') {
      showCreateOportunidadModal.value = !showCreateOportunidadModal.value;
  }
  if (key === 'showCreateCotizadoModal') {
      showCreateCotizadoModal.value = !showCreateCotizadoModal.value;
  }

  // if (customer.is_company == 1) {
  //   showEditCompanyModal.value = !showEditCompanyModal.value;      
  // } else {
  //   showEditPersonModal.value = !showEditPersonModal.value;
  // }      

  if (
    showEditCompanyModal.value == true ||
    showCreateCotizadoModal.value == true ||
    showCreateOportunidadModal.value == true
  ) {
      alertStore.showOnPage = false;
  } else {
      alertStore.showOnPage = true;
  }
}

function onModalUpdate() {
  fetchRecord();
}

function onModalDelete() {
  alertHelpers.confirmDanger(function () {
    customerService.delete(customer.id).then(function (response) {
      toast.success(trans('global.phrases.delete_success'));
      router.push({name: 'customers.list'});
    });
  });
}

function onContactUpdate(params) {
  let data = {
    ...params.data,
    contact_type: 'customer',
    id: customer.id
  }

  contactService.update(params.id, data).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      fetchRecord();
    }
  })
}

function onContactSubmit(params) {

  contactService.store(
    {
      name: params.name,
      email: params.email,
      phone: params.phone,
      phone2: params.phone2,
      email2: params.email2,
      id: customer.id,
      contact_type: 'customer',
    }
  ).then(res => {
    if (res.status == 200 || res.status == 201) {
      toast.success();
      fetchRecord();
    }
  })
}

async function fetchRecord() {
  page.loading = true;
  customerService.find(route.params.id).then((response) => {
    customer = response.data.data;
    taskStore.tasks = customer.tasks;
    noteStore.notes = customer.notes;
    documentStore.documents = customer.media;
    page.title = customer.company_name;
    if (customer.is_company) {
      page.titleIcon = {name: 'building-o'}
    }
    page.loading = false;
  });
}

onBeforeMount(async () => {
  await fetchRecord();
});
</script>

<style lang="scss" scoped>

</style>