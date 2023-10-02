<template>
  <q-page>
    <section class="q-pa-xl">
      <div class="text-h4">FDR 대시보드</div>
      <q-separator class="q-my-md" />
      <div class="q-pa-xs">
        <q-table
          flat
          bordered
          dense
          ref="tableRef"
          title="FDR 대시보드"
          :rows="rows"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          binary-state-sort
          @request="onRequest"
        >
          <template v-slot:top>
            <div class="q-pa-md row full-width">
              <div class="col-4">
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  label="jobId"
                  v-model.lazy="searchJobId"
                >
                </q-input>
              </div>
              <div class="col row items-center">
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model="dateRangeDisplay"
                  readonly
                  v-on:click="showCalendar = !showCalendar"
                  label="날짜 범위"
                  style="width: 250px"
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
              <div class="col row items-center">
                <q-input
                  ref="qInputRef"
                  dense
                  color="primary"
                  v-model.lazy="searchKeyword"
                >
                </q-input>
                <q-btn
                  color="primary"
                  :disable="loading"
                  label="조회"
                  @click="fetch"
                />
              </div>
            </div>

            <div class="q-pa-md row full-width">
              <div class="col row items-center">
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="macdShortN"
                  label="macdShortN"
                >
                </q-input>
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="macdLongN"
                  label="macdNongN"
                >
                </q-input>
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="macdSignalN"
                  label="macdSignalN"
                >
                </q-input>
              </div>
            </div>
          </template>
        </q-table>
      </div>
      max_draw_down: {{ max_draw_down }}
    </section>
  </q-page>
</template>

<script setup>
const columns = [
  {
    name: 'code',
    required: true,
    label: 'code',
    align: 'left',
    field: row => row.code,
  },
  {
    name: 'name',
    required: true,
    label: 'name',
    align: 'left',
    field: row => row.name,
  },
  {
    name: 'market',
    required: true,
    label: 'market',
    align: 'left',
    field: row => row.market,
  },
  {
    name: 'date',
    required: true,
    label: 'date',
    align: 'left',
    field: row => {
      const date = new Date(row.date);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
  {
    name: 'open',
    required: true,
    label: 'open',
    align: 'left',
    field: row => row.open,
  },
  {
    name: 'high',
    required: true,
    label: 'high',
    align: 'left',
    field: row => row.high,
  },
  {
    name: 'low',
    required: true,
    label: 'low',
    align: 'left',
    field: row => row.low,
  },
  {
    name: 'close',
    required: true,
    label: 'close',
    align: 'left',
    field: row => row.close,
  },
  {
    name: 'volume',
    required: true,
    label: 'volume',
    align: 'left',
    field: row => row.volume,
  },
  {
    name: 'change',
    required: true,
    label: 'change',
    align: 'left',
    field: row => row.change,
  },
  {
    name: 'short',
    required: true,
    label: 'short',
    align: 'left',
    field: row => row.short,
  },
  {
    name: 'long',
    required: true,
    label: 'long',
    align: 'left',
    field: row => row.long,
  },
  {
    name: 'macd',
    required: true,
    label: 'macd',
    align: 'left',
    field: row => row.macd,
  },
  {
    name: 'signal',
    required: true,
    label: 'signal',
    align: 'left',
    field: row => row.signal,
  },
  {
    name: 'macdOscillator',
    required: true,
    label: 'macdOscillator',
    align: 'left',
    field: row => row.macdOscillator,
  },
  {
    name: 'dailyReturn',
    required: true,
    label: 'dailyReturn',
    align: 'left',
    field: row => row.dailyReturn,
  },
  {
    name: 'cumReturn',
    required: true,
    label: 'cumReturn',
    align: 'left',
    field: row => row.cumReturn,
  },
  {
    name: 'maxCumReturn',
    required: true,
    label: 'maxCumReturn',
    align: 'left',
    field: row => row.maxCumReturn,
  },
  {
    name: 'drawDown',
    required: true,
    label: 'drawDown',
    align: 'left',
    field: row => row.drawDown,
  },
  {
    name: 'collectingDate',
    required: false,
    label: 'collectingDate',
    align: 'left',
    field: row => row.collectingDate,
  },
];

import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const tableRef = ref();
const qInputRef = ref();

const rows = ref([]);

const max_draw_down = ref(0);

const searchJobId = ref(null);
const searchKeyword = ref(null);
const loading = ref(false);

const startDate = ref(null);
const endDate = ref(null);
const dateRangeDisplay = ref('');
const showCalendar = ref(false);

const macdShortN = ref(12);
const macdLongN = ref(26);
const macdSignalN = ref(9);

watch([startDate, endDate], () => {
  if (startDate.value && endDate.value) {
    dateRangeDisplay.value = `${startDate.value} - ${endDate.value}`;
    showCalendar.value = false;
  }
});

async function onRequest(props) {
  // const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;

  //1. 서버로부터 데이터를 가져온자.
  const params = {
    searchJobId: searchJobId.value,
    startDate: startDate.value,
    endDate: endDate.value,
    searchKeyword: searchKeyword.value,
    macdShortN: macdShortN.value,
    macdLongN: macdLongN.value,
    macdSignalN: macdSignalN.value,
  };

  const response = await api.get('/finance-data-reader/dashboard', {
    params,
  });

  console.log(response.data);

  // // clear out existing data and add new
  rows.value.splice(0, rows.value.length, ...response.data.dataList);
  max_draw_down.value = response.data.maxDrawDown;
  // ...and turn of loading indicator
  loading.value = false;
}

const fetch = async () => {
  console.log('fetch');
  tableRef.value.requestServerInteraction();
};

onMounted(() => {
  console.log('onMounted');
  const el = qInputRef.value.getNativeElement();
  el.addEventListener('input', e => {
    console.log('input', e.target.value);
    searchKeyword.value = e.target.value;
  });
});
</script>

<style lang="scss" scoped></style>
