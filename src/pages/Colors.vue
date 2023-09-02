<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-center">
      <div>날짜 범위:</div>
      <q-input
        v-model="dateRangeDisplay"
        readonly
        v-on:click="showCalendar = !showCalendar"
      />

      <q-popup-proxy v-if="showCalendar">
        <q-date
          v-model="startDate"
          mask="YYYY-MM-DD"
          :max="endDate"
          :popup-content-class="'date-popup-content'"
        />
        <q-date
          v-model="endDate"
          mask="YYYY-MM-DD"
          :min="startDate"
          :popup-content-class="'date-popup-content'"
        />
      </q-popup-proxy>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const startDate = ref('');
const endDate = ref('');
const dateRangeDisplay = ref('');
const showCalendar = ref(false);

watch([startDate, endDate], () => {
  if (startDate.value && endDate.value) {
    dateRangeDisplay.value = `${startDate.value} - ${endDate.value}`;
    showCalendar.value = false;
  }
});
</script>

<style>
.date-popup-content {
  width: 320px;
  height: 340px;
}
</style>
