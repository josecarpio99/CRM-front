<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  >
    <Panel :is-loading="isLoading">
      <div class="mb-6 pb-4 border-b-2">
        <h4 class="textl-lg font-semibold">Filtros</h4>

        <div class="flex flex-col gap-4 max-w-2xl sm:flex-row">

          <Dropdown  
            v-if="authStore.isMasterOrDirector()"
            class="w-full max-w-[16rem]"
            :label="trans('users.labels.branch')"
            name="branch" 
            :options="branches" 
            @input="handleBranchSelect"   
            v-model="branchSelected"            
          /> 

          <Dropdown  
            class="w-full max-w-[16rem]"
            :label="trans('global.labels.created_at')"
            name="date" 
            :options="datesFilter" 
            @input="handleDateSelect"   
            v-model="dateSelected"
          />  

          <Dropdown  
            class="w-full max-w-[16rem]"
            :label="trans('global.labels.adviser_in_charge')"
            selectLabel="name"
            name="owner" 
            :options="users" 
            @input="handleOwnerSelect"   
            v-model="ownerSelected"
          />         

        </div>
      </div>

      <div v-if="! isLoading">
        <div class="flex flex-col md:flex-row gap-6 justify-center items-center text-gray-500 mb-8">

          <div>            
            <h4 class="flex justify-center items-center text-center text-gray-600 font-bold mb-4">
              <span class="inline-block h-4 w-4 bg-green-300 mr-2"></span>
              Ganado
            </h4>
            <div class="flex gap-4">
              <div class="font-semibold">Cantidad: <span class="text-lg font-bold text-gray-600">{{dealStatusData?.won?.count }}</span></div>
            </div>
          </div>

          <div>            
            <h4 class="flex justify-center items-center text-center text-gray-600 font-bold mb-4">
              <span class="inline-block h-4 w-4 bg-red-300 mr-2"></span>
              Perdido
            </h4>
            <div class="flex gap-4">
              <div class="font-semibold">Cantidad: <span class="text-lg font-bold text-gray-600">{{dealStatusData?.lost?.count }}</span></div>
            </div>
          </div>

          <div>            
            <h4 class="flex justify-center items-center text-center text-gray-600 font-bold mb-4">
              <span class="inline-block h-4 w-4 bg-yellow-300 mr-2"></span>
              En Proceso
            </h4>
            <div class="flex gap-4">
              <div class="font-semibold">Cantidad: <span class="text-lg font-bold text-gray-600">{{dealStatusData?.inProgress?.count }}</span></div>
            </div>
          </div>

        </div>

        <div class="flex flex-col items-center lg:flex-row gap-4 max-w-lg mx-auto">       
  
          <div class="w-full">
            <Pie
              id="my-chart-id"
              :options="pieChart.chartOptions"
              :data="pieChart.chartData"
            />
          </div>        
  
        </div>

        <div class="mt-6">

          <h3 class="text-gray-600 font-semibold text-xl text-center mb-4">Hit Rate</h3>
          
          <div class="flex justify-center items-center gap-6">

            <div class="flex flex-col items-center gap-4">
              <!-- <h4 class="text-gray-500 font-semibold text-lg">Cantidad</h4> -->
              <span class="text-gray-600 font-semibold text-4xl">
                {{ dealStatusData?.hit_rate?.count.toFixed(2) + '%' }}
              </span>
            </div>
            <!-- <div class="flex flex-col items-center gap-4">
              <h4 class="text-gray-500 font-semibold text-lg">Valor</h4>
              <span class="text-gray-600 font-semibold text-4xl">
                {{ dealStatusData?.hit_rate?.amount.toFixed(2) + '%' }}
              </span>
            </div> -->
          </div>
        </div>

      </div>
    </Panel>
  </Page>
</template>

<script setup>
import {watch, onMounted, reactive, ref } from 'vue';
import {trans} from "@/helpers/i18n";
import Page from "@/views/layouts/Page";
import Panel from "@/views/components/Panel";
import ReportService from "@/services/ReportService";
import {getResponseError, prepareQuery} from "@/helpers/api";
import {useUsersStore} from "@/stores/users";
import {useAuthStore} from "@/stores/auth";
import {useAlertStore} from "@/stores";
import Dropdown from "@/views/components/input/Dropdown";
// import { branches } from "@/stub/statuses";
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { datesFilter } from "@/stub/date";

const reportService = new ReportService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const isLoading = ref(true);
const ownerSelected = ref(null);
const branchSelected = ref({id: null, label: 'TODAS'});
const dateSelected = ref(null);
const users = usersStore.userList;

const branches = ref([
  {
    id: null,
    label: 'TODAS',
  },  
  {
    id: 'NY',
    label: 'NY',
  },  
  {
    id: 'FL',
    label: 'FL',
  },  
  {
    id: 'TX',
    label: 'TX',
  },  
  {
    id: 'NC',
    label: 'NC',
  }
])


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, ArcElement, LinearScale)

const mainQuery = reactive({
  page: 1,
  limit: 'all',
  search: '',
  sort: '',
  filters: {
      type: {
          value: 'cotizado',
          comparison: '='
      },    
      name: {
          value: '',
          comparison: '='
      },    
      source: {
          value: '',
          comparison: '='
      },
      branch: {
          value: '',
          comparison: '='
      },
      owner: {
          value: '',
          comparison: '='
      },
      value: {
          value: '',
          comparison: '='
      },
      created_at: {
          value: '',
          comparison: '='
      }
  }
});

const page = reactive({
  id: 'deal_status_page',
  title: trans('global.menu.deal_status'),
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const pieChart = reactive({
  chartData: {
    labels: ['Ganado', 'Perdido', 'En Progreso'],
    datasets: [ { data: [] } ]
  },
  chartOptions: {
    responsive: true,
    layout: {
      padding: 20
    }
  }
});

const dealStatusData = ref(null);

function fetchPage(params) {
  isLoading.value = true;
  let query = prepareQuery(params);
  reportService
      .dealStatus(query)
      .then((response) => {
          dealStatusData.value = response.data.data;

          pieChart.chartData.datasets = [
            {
              data: [
                response.data.data.won.count,
                response.data.data.lost.count,
                response.data.data.inProgress.count
              ],
              backgroundColor: ['#86EFAC', '#FCA5A5', '#FDE047']
            },          
          ]
          isLoading.value = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          isLoading.value = false;
      });
}

function handleOwnerSelect(item) {
  mainQuery.filters.owner.value = ownerSelected.value?.id || null;
}

function handleBranchSelect(item) {
  mainQuery.filters.branch.value = branchSelected.value?.id || null;
}

function handleDateSelect(item) {
  mainQuery.filters.created_at.value = dateSelected.value?.id || null;
}

watch(mainQuery, (newTableState) => {  
  fetchPage(mainQuery);
});

onMounted(async () => { 
  fetchPage(mainQuery);
})

</script>