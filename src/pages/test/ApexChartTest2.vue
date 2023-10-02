<template>
  <div class="q-pa-md">ApexChart 테스트</div>
  <!-- <div id="mixed-chart" style="width: 100%; height: 350px"></div> -->
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  //   const options = {
  //     series: [
  //       {
  //         name: 'candle',
  //         type: 'candlestick',
  //         data: [
  //           {
  //             x: new Date(1538778600000),
  //             y: [6629.81, 6650.5, 6623.04, 6633.33],
  //           },
  //           {
  //             x: new Date(1538780400000),
  //             y: [6632.01, 6643.59, 6620, 6630.11],
  //           },
  //           // ... more data
  //         ],
  //       },
  //       {
  //         name: 'MACD',
  //         type: 'line',
  //         data: [
  //           {
  //             x: new Date(1538778600000),
  //             y: 6629.81,
  //           },
  //           {
  //             x: new Date(1538780400000),
  //             y: 6632.01,
  //           },
  //           // ... more data
  //         ],
  //       },
  //     ],
  //     chart: {
  //       type: 'line',
  //       height: 350,
  //       id: 'mixed-chart',
  //     },
  //     xaxis: {
  //       type: 'datetime',
  //     },
  //     stroke: {
  //       width: [1, 2],
  //     },
  //     title: {
  //       text: 'CandleStick Chart with MACD Line',
  //       align: 'left',
  //     },
  //     markers: {
  //       size: 0,
  //       hover: {
  //         sizeOffset: 6,
  //       },
  //     },
  //   };
  //   const script = document.createElement('script');
  //   script.src = 'https://cdn.jsdelivr.net/npm/apexcharts';
  //   document.head.appendChild(script);
  //   script.onload = () => {
  //     const chart = new ApexCharts(
  //       document.querySelector('#mixed-chart'),
  //       options,
  //     );
  //     chart.render();
  //   };
});
</script>

<style></style>
