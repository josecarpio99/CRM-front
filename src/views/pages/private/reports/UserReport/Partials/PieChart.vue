<script setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const props = defineProps({
  data: {
    type: Array,
    default: () => [0, 0, 0]
  }
})

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  labels: props.data.map((value, index) => `${['Prospección', 'Publicidad', 'Recompra'][index]}: ${value}`),
  datasets: [{
    data: props.data,
    backgroundColor: ['#86EFAC', '#FDE047', '#93C5FD']
  }]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};
</script>

<template>
  <div class="p-0 pt-0 text-gray-500 lg:w-[310px] mt-[-6px] mx-auto">
    <h3 class="text-lg font-medium mb-2 text-center">Origen de Proyectos</h3>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>