<template>
  <q-page>
    <section class="q-pa-xl">
      <div class="text-h4">Job 관리</div>
      <q-separator class="q-my-md" />
      <div class="q-pa-xs">
        <q-table
          flat
          bordered
          ref="tableRef"
          title="Job 내역"
          :rows="rows"
          :columns="columns"
          row-key="_id"
          v-model:pagination="pagination"
          :loading="loading"
          binary-state-sort
          @request="onRequest"
        >
          <template v-slot:top>
            <q-space />
            <div class="row q-gutter-xs col-xs-6">
              <div class="col" style="width: 200px">
                <q-select
                  dense
                  v-model="selectedJobType"
                  :options="jobTypeList"
                  label="jobType"
                >
                  <template v-slot:append>
                    <q-icon
                      name="close"
                      @click.stop.prevent="selectedJobType = null"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
              <!-- <div class="col-3">
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="searchKeyword"
                >
                </q-input>
              </div> -->
              <div class="col-2">
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
    name: '_id',
    required: true,
    label: '_id',
    align: 'left',
    field: row => row._id,
  },
  {
    name: 'jobType',
    required: true,
    label: 'jobType',
    align: 'left',
    field: row => row.jobType,
  },
  {
    name: 'jobProgressStatusType',
    required: true,
    label: 'jobProgressStatusType',
    align: 'left',
    field: row => row.jobProgressStatusType,
  },
  {
    name: 'numberOfTargets',
    required: true,
    label: 'numberOfTargets',
    align: 'left',
    field: row => row.numberOfTargets,
  },
  {
    name: 'numberOfSuccess',
    required: true,
    label: 'numberOfSuccess',
    align: 'left',
    field: row => row.numberOfSuccess,
  },
  {
    name: 'startedDate',
    required: true,
    label: 'startedDate',
    align: 'left',
    field: row => row.startedDate,
  },
  {
    name: 'finishedDate',
    required: true,
    label: 'finishedDate',
    align: 'left',
    field: row => row.finishedDate,
  },
  {
    name: 'createdAt',
    required: true,
    label: 'createdAt',
    align: 'left',
    field: row => row.createdAt,
  },
];

import { ref, onMounted } from 'vue';
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

const savedCollectIdList = ref([]);
const jobTypeList = ref([
  'FDR_COLLECT_KRX_ITEMS',
  'FDR_COLLECT_KRX_ITEMS_DAILY_TRADE_DATA',
]);
const selectedJobType = ref(null);

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;

  //1. 서버로부터 데이터를 가져온자.
  const params = {
    page,
    limit: rowsPerPage,
    allRows: rowsPerPage === 0 ? true : false,
    jobType: selectedJobType.value,
  };

  const response = await api.get('/job/fdr/start-collecting/jobs/_paginate', {
    params,
  });

  console.log(response);

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

// const collectKrxStockItems = async () => {
//   console.log('collectKrxStockItems');

//   const apiResult = await api
//     .post('/task/fdr/start-collecting/FDR_COLLECT_KRX_ITEMS')
//     .then(response => {
//       console.log(response.data);
//       $q.notify({
//         message: '수집이 완료되었습니다.',
//         color: 'positive',
//         icon: 'cloud_done',
//       });

//       initPage();
//     });
// };

// const getCollectIds = async () => {
//   const apiResult = await api
//     .get('/finance-data-reader/krx-items/collect-ids')
//     .then(response => {
//       console.log(response.data);
//       return response.data;
//     });

//   return apiResult;
// };

const fetch = async () => {
  console.log('fetch');
  tableRef.value.requestServerInteraction();
};

const initPage = async () => {
  console.log('initPage');
  tableRef.value.requestServerInteraction();
};

onMounted(() => {
  console.log('onMounted');
  initPage();
});
</script>

<style lang="scss" scoped></style>
