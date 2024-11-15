<template>
  <Page 
    :title="page.title" 
    :showFooter="page.showFooter"
    :is-loading="page.isLoading"
  >
    <Panel :is-loading="isLoading">

      <div class="mb-6 pb-4 border-b-2">
        <h4 class="textl-lg font-semibold">Filtros</h4>

        <div class="flex justify-between">
          <div class="flex flex-col gap-4 max-w-xl sm:flex-row">
  
            <Dropdown  
              class="w-full min-w-48 md:min-w-80"
              :label="'Asesor'"
              selectLabel="name"
              name="owner" 
              :options="users" 
              v-model="ownerSelected"
            />
  
            <!-- <TextInput
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
            />  -->
  
            <div class="flex items-end">
              <Button
                class="mb-1"
                @click="handleFilter"
                :loading="isLoading"
                :disabled="isLoading || !ownerSelected"
                :label="'Buscar'"
              />
  
            </div>
  
          </div>
  
          
          <Button
              class="ml-auto h-12 flex items-center"
              icon="fa fa-file-pdf-o"
              theme="danger"
              @click="generatePdf"
              :loading="isLoading"
              :disabled="isLoading || !data"
              :label="'Generar PDF'"
            />

        </div>
      </div>

      <div v-if="! isLoading" class="bg-gray-100 p-6">       

        <div class=" max-w-4xl mx-auto" v-if="data" id="report-wrapper">
  
          <header class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
              <CircleAvatar class="!w-16 !h-16" :avatarUrl="data.user.avatar_url" :user="data.user" />
              <div class="flex gap-4 text-gray-600 uppercase tracking-wider font-semibold">
                <span>{{ data.user.name }}</span>
                <span>-</span>
                <span>{{ data.user.branch }}</span>
                <span>-</span>
                <span>{{  dayjs().format('DD-MM-YYYY') }}</span>
                <template v-if="data.manager">
                  <span>-</span>
                  <span>{{ data.manager.name }}</span>
                </template>
              </div>
            </div>
            <div class="flex items-center">
              <!-- get the image src from public directory -->
              <img src="/assets/images/logo.png" class="h-16" alt="logo">
              <img >
            </div>
          </header>

          <div class="grid grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="PROYECTOS ACTIVOS" 
              :value="data.active_deals.count" 
              :subValue="money_format(data.active_deals.value, 0)" 
            />
            <StatCard title="PROYECTOS EN ROJO" :value="data.warning_deals.count" />
            <StatCard title="ROA" :value="`$${limitDecimals(data.roa, 0)}`" trend="up" color="green-500" />
            <StatCard title="HIT RATE" :value="`${limitDecimals(data.hit_rate, 0)}%`" trend="down" color="green-500" />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <SummaryTable title="RESUMEN DE VENTA" :data="data.sales" />
            <SummaryTable title="PROYECTOS COTIZADOS" :data="data.deals_quoted" />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <SummaryTable 
              title="PROSPECTOS" 
              :data="[
                {
                  period: 'Dados de alta',
                  count: data.leads.count,
                },
                {
                  period: 'Tareas vigentes',
                  count: data.leads.task_count,
                },
              ]" 
            />
            <SummaryTable 
              title="CLIENTES EN CARTERA" 
              :data="[
                {
                  period: 'Dados de alta',
                  count: data.customers.count,
                },
                {
                  period: 'Tareas vigentes',
                  count: data.customers.task_count,
                },
              ]"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <TopProjects :projects="data.top_deals" />
              <div class="w-64 mx-auto mt-12">
                <StatCard 
                  title="PROMEDIO MENSUAL DE VENTA"  
                  :value="`$${money_format(data.average_monthly_sales, 0)}`"
                />
              </div>
            </div>
            <PieChart 
              :data="[
                data.deal_sources.prospeccion.count,
                data.deal_sources.publicidad.count,
                data.deal_sources.recompra.count
              ]"
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
import TopProjects from './Partials/TopProjects.vue';
import SummaryTable from './Partials/SummaryTable.vue';
import StatCard from './Partials/StatCard.vue';
import PieChart from './Partials/PieChart.vue';
import {money_format, limitDecimals} from "@/helpers/data";
import CircleAvatar from "@/views/components/icons/CircleAvatar";
import html2pdf from 'html2pdf.js';

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
  // 'start_date': '2024-01-01',
  'end_date': dayjs().format('YYYY-MM-DD'),
});

const page = reactive({
  id: 'user_report_page',
  title: 'Radiografía Asesores',
  toggleFilters: false,
  showFooter: false,
  isLoading: false
});

const data = ref(null);

function handleFilter() {
  fetchPage(mainQuery);
}

const toDataUrl = async function (url) {
  try {
    const response = await fetch(url, {
      // contentType: 'image/jpeg',
    });    
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload  = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw {
      status: error.status,
      statusText: error.statusText,
    };
  }
};

function fetchPage(params) {
  isLoading.value = true;

  // remove null values from params
  // let query = Object.fromEntries(
  //   Object.entries(params).filter(([key, value]) => value !== null)
  // );
  
  reportService
      .userReport(ownerSelected.value.id)
      .then((response) => {
          data.value = response.data;

          if (data.value.user.avatar_url) {
            toDataUrl(data.value.user.avatar_url)
              .then((dataUrl) => {
                data.value.user.avatar_url = dataUrl;
            })
          }

          isLoading.value = false;
      })
      .catch((error) => {
          alertStore.error(getResponseError(error));
          isLoading.value = false;
      });
}

function generatePdf() {
  const element = document.getElementById('report-wrapper');  

  let filename = `${ownerSelected.value.name.toLowerCase().split(' ').join('-')}-radiografia-${dayjs().format('DD-MM-YYYY')}.pdf`;
  let img = element.querySelector('.avatar-img');

  html2pdf()
    .set({
      margin: [.5,.3,0,.3],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCors: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    })
    .from(element)
    .save()
    // .toPdf()
    // .get('pdf')
    // .then((pdf) => {
    //   const newwindow  = window.open(pdf.output('bloburl', { filename: filename }), '_blank');
    // });
}

</script>