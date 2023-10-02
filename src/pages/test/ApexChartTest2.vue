<template>
  <div class="q-pa-md">ApexChart 테스트</div>
  <div>
    <apexchart type="bar" :options="options" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
const options = {
  chart: {
    id: 'apexchart-example',
  },
  xaxis: {
    categories: ['Category 1', 'Category 2'],
  },
};

const series = [
  {
    name: 'Series 1',
    data: [30, 40],
  },
];
</script>

<style></style>
