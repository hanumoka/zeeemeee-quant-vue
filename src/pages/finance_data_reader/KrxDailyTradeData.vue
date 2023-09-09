<template>
  <q-page>
    <section class="q-pa-xl">
      <div class="text-h4">KRX 거래정보수집</div>
      <q-separator class="q-my-md" />
      <div class="q-pa-xs">
        <q-table
          flat
          bordered
          ref="tableRef"
          title="KRX 거래정보수집"
          :rows="rows"
          :columns="columns"
          row-key="_id"
          v-model:pagination="pagination"
          :loading="loading"
          binary-state-sort
          @request="onRequest"
        >
          <template v-slot:top>
            <div class="q-pa-md row full-width">
              <div class="col row items-center">
                <q-select
                  dense
                  v-model="selectedKrxCollectId"
                  :options="savedKrxCollectIdList"
                  label="KrxCollectId"
                  style="width: 300px"
                  class="q-mr-md"
                >
                  <template v-slot:append>
                    <q-icon
                      name="close"
                      @click.stop.prevent="selectedKrxCollectId = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
                <q-btn
                  color="primary"
                  :disable="loading"
                  label="수집하기"
                  @click="collectKrxDailyTradeData"
                />
              </div>
              <div class="col row items-center">
                <q-input
                  class="q-ml-lg q-mr-md"
                  dense
                  debounce="300"
                  color="primary"
                  label="삭제할 collectId"
                  v-model="collectIdToDelete"
                >
                  <template v-slot:after>
                    <q-btn
                      v-if="rows.length !== 0"
                      color="negative"
                      :disable="loading"
                      label="삭제하기"
                      @click="deleteData"
                    />
                  </template>
                </q-input>
              </div>
            </div>

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
          </template>
        </q-table>
      </div>
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
    label: 'change',
    align: 'left',
    field: row => row.change,
  },
  {
    name: 'long',
    required: true,
    label: 'change',
    align: 'left',
    field: row => row.change,
  },
  {
    name: 'macd',
    required: true,
    label: 'change',
    align: 'left',
    field: row => row.change,
  },
  {
    name: 'signal',
    required: true,
    label: 'change',
    align: 'left',
    field: row => row.change,
  },
  {
    name: 'macd_oscillator',
    required: true,
    label: 'change',
    align: 'left',
    field: row => row.change,
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
// const filter = ref('');
const searchKeyword = ref(null);
const loading = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
});

const savedKrxCollectIdList = ref([]);
const selectedKrxCollectId = ref(null);

const savedKrxDailyTradeDataCollectIdList = ref([]);
const selectedKrxDailyTradeDataCollectId = ref(null);

const collectIdToDelete = ref(null);

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

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;

  //1. 서버로부터 데이터를 가져온자.
  const params = {
    page,
    limit: rowsPerPage,
    allRows: rowsPerPage === 0 ? true : false,
    collect_id: selectedKrxDailyTradeDataCollectId.value,
    start_date: startDate.value,
    end_date: endDate.value,
    search_keyword: searchKeyword.value,
    // sortBy,
    // descending,
    // filter,
  };

  const response = await api.get(
    '/finance-data-reader/krx-items/daily-trade-data/_paginate',
    {
      params,
    },
  );

  pagination.value.rowsNumber = response.data.totalItems;

  // clear out existing data and add new
  rows.value.splice(0, rows.value.length, ...response.data.items);

  // don't forget to update local pagination object
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  // ...and turn of loading indicator
  loading.value = false;
}

const collectKrxDailyTradeData = async () => {
  console.log('collectKrxDailyTradeData');

  const param = {
    collectId: selectedKrxCollectId.value,
  };

  const apiResult = await api
    .post('/finance-data-reader/krx-itmes/daily-trade-data/_collect', param)
    .then(response => {
      console.log(response.data);
      $q.notify({
        message: '수집이 진행중입니다.(대략 16분 소요)',
        color: 'positive',
        icon: 'cloud_done',
      });
    })
    .catch(error => {
      console.log(error);
      $q.notify({
        message: '수집이 실패하였습니다.' + error.message,
        color: 'negative',
        icon: 'cloud_done',
      });
    });
};

const getKrxItmesCollectIds = async () => {
  const apiResult = await api
    .get('/finance-data-reader/krx-items/collect-ids')
    .then(response => {
      console.log(response.data);
      return response.data;
    });

  return apiResult;
};

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
  // tableRef.value.requestServerInteraction();
  savedKrxCollectIdList.value = await getKrxItmesCollectIds();
  savedKrxDailyTradeDataCollectIdList.value =
    await getKrxItmesDailyTradeDataCollectIds();
};

const deleteData = async () => {
  console.log('deleteData');
  const params = {
    collect_id: collectIdToDelete.value,
  };
  const response = await api.delete(
    '/finance-data-reader/krx-items/daily-trade-data',
    {
      params,
    },
  );
  initPage();
};

onMounted(() => {
  console.log('onMounted');
  initPage();
});
</script>

<style lang="scss" scoped></style>
