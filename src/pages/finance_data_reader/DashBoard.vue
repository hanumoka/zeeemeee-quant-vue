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
              <div class="col row items-center q-mr-md">
                <q-select
                  dense
                  v-model="selectedKrxDailyTradeDataCollectId"
                  :options="savedKrxDailyTradeDataCollectIdList"
                  label="collectId"
                  style="width: 300px"
                >
                  <template v-slot:append>
                    <q-icon
                      name="close"
                      @click.stop.prevent="
                        selectedKrxDailyTradeDataCollectId = ''
                      "
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
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
                  dense
                  debounce="300"
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
                  v-model.lazy="macd_short_n"
                  label="macd_short_n"
                >
                </q-input>
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="macd_long_n"
                  label="macd_long_n"
                >
                </q-input>
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="macd_signal_n"
                  label="macd_signal_n"
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
    name: 'collectId',
    required: true,
    label: 'collectId',
    align: 'left',
    field: row => row.collectId,
  },
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
const rows = ref([]);

const max_draw_down = ref(0);

// const filter = ref('');
const searchKeyword = ref(null);
const loading = ref(false);
// const pagination = ref({
//   sortBy: 'desc',
//   descending: false,
//   page: 1,
//   rowsPerPage: 10,
//   rowsNumber: null,
// });

// const savedKrxCollectIdList = ref([]);
// const selectedKrxCollectId = ref(null);

const savedKrxDailyTradeDataCollectIdList = ref([]);
const selectedKrxDailyTradeDataCollectId = ref(null);

// const collectIdToDelete = ref(null);

const startDate = ref('');
const endDate = ref('');
const dateRangeDisplay = ref('');
const showCalendar = ref(false);

const macd_short_n = ref(12);
const macd_long_n = ref(26);
const macd_signal_n = ref(9);

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
    // page,
    // limit: rowsPerPage,
    // allRows: rowsPerPage === 0 ? true : false,
    collect_id: selectedKrxDailyTradeDataCollectId.value,
    start_date: startDate.value,
    end_date: endDate.value,
    search_keyword: searchKeyword.value,
    macd_short_n: macd_short_n.value,
    macd_long_n: macd_long_n.value,
    macd_signal_n: macd_signal_n.value,
    // sortBy,
    // descending,
    // filter,
  };

  const response = await api.get('/finance-data-reader/dashboard', {
    params,
  });

  console.log(response.data);

  // pagination.value.rowsNumber = response.data.size();

  // // clear out existing data and add new
  rows.value.splice(0, rows.value.length, ...response.data.dataList);
  max_draw_down.value = response.data.maxDrawDown;

  // // don't forget to update local pagination object
  // pagination.value.page = page;
  // pagination.value.rowsPerPage = rowsPerPage;
  // pagination.value.sortBy = sortBy;
  // pagination.value.descending = descending;

  // ...and turn of loading indicator
  loading.value = false;
}

const getKrxItmesDailyTradeDataCollectIds = async () => {
  const apiResult = await api
    .get('/finance-data-reader/krx-items/daily-trade-data/collect-ids')
    .then(response => {
      console.log(response.data);
      return response.data;
    });
  return apiResult;
};

const fetch = async () => {
  console.log('fetch');
  tableRef.value.requestServerInteraction();
};

const initPage = async () => {
  console.log('initPage');
  savedKrxDailyTradeDataCollectIdList.value =
    await getKrxItmesDailyTradeDataCollectIds();
};

onMounted(() => {
  console.log('onMounted');
  initPage();
});
</script>

<style lang="scss" scoped></style>
