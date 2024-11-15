<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  >
    <Panel :is-loading="isLoading">

      <div class="mb-6 pb-4 border-b-2">
        <h4 class="textl-lg font-semibold">Filtros</h4>

        <div class="flex flex-col gap-4 max-w-xl sm:flex-row">

          <Dropdown  
            class="w-full max-w-[16rem]"
            :label="'Asesor'"
            selectLabel="name"
            name="owner" 
            :options="users" 
            v-model="ownerSelected"
          />

          <TextInput
            class="  w-64"
            type="date" 
            name="since-input" 
            label="Desde:"
            v-model="mainQuery.start_date"
            :max="dayjs().format('YYYY-MM-DD')"
          />  

          <TextInput
            class="  w-64"
            type="date" 
            name="until-input" 
            label="Hasta:"
            v-model="mainQuery.end_date"
            :max="dayjs().format('YYYY-MM-DD')"
          /> 

          <div class="flex items-end">
            <Button
              class="mb-1"
              @click="handleFilter"
              :loading="isLoading"
              :disabled="isLoading || !ownerSelected"
              :label="'Filtrar'"
            />

          </div>

        </div>
      </div>

      <div v-if="! isLoading">       

        <div class="flex flex-col items-center lg:flex-row gap-4 max-w-[1000px] mx-auto" v-if="data">
  
          <div class="w-full">
            <Pie
              id="my-chart-id"
              :options="pieChart.chartOptions"
              :data="pieChart.chartData"
            />
          </div>        
  
        </div>

        <div v-else >
          <p class="text-center text-gray-600 text-lg">Selecciona un asesor para mostrar su reporte</p>
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
import ValueField from "@/views/components/ValueField";
import { branches } from "@/stub/statuses";
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js'
import dayjs from 'dayjs';
import TextInput from "@/views/components/input/TextInput";
import Button from '@/views/components/input/Button.vue';

const reportService = new ReportService();
const alertStore = useAlertStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const isLoading = ref(false);
const ownerSelected = ref(null);
const users = usersStore.userList;

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, ArcElement, LinearScale)

const mainQuery = reactive({
  'start_date': dayjs().startOf('week').format('YYYY-MM-DD'),
  'end_date': dayjs().format('YYYY-MM-DD'),
});

const page = reactive({
  id: 'user_report_page',
  title: 'Reporte Individual por Asesor',
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const pieChart = reactive({
  chartData: {
    labels: ['Prospección', 'Publicidad - Guardia', 'Recompra'],
    datasets: [ { data: [] } ]
  },
  chartOptions: {
    responsive: true,
    layout: {
      padding: 20
    }
  }
});

const data = ref(null);

function handleFilter() {
  fetchPage(mainQuery);
}

function fetchPage(params) {
  isLoading.value = true;

  // remove null values from params
  let query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== null)
  );
  
  reportService
      .userReport(ownerSelected.value.id, query)
      .then((response) => {
          data.value = response.data;

          pieChart.chartData.datasets = [
            {
              data: [
                data.value.deal_sources.prospeccion.count,
                data.value.deal_sources.publicidad.count,
                data.value.deal_sources.recompra.count
              ],
              backgroundColor: ['#86EFAC', '#FDE047', '#93C5FD']
            },          
          ]
          isLoading.value = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          isLoading.value = false;
      });
}

</script>