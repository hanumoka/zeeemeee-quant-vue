<template>
  <q-page>
    <section class="q-pa-xl">
      <div class="text-h4">KRX 종목수집</div>
      <q-separator class="q-my-md" />
      <div class="q-pa-xs">
        <q-table
          flat
          bordered
          ref="tableRef"
          title="KRX 종목수집"
          :rows="rows"
          :columns="columns"
          row-key="_id"
          v-model:pagination="pagination"
          :loading="loading"
          binary-state-sort
          @request="onRequest"
        >
          <template v-slot:top>
            <!-- <q-space /> -->
            <div class="row q-gutter-xs col-xs-6">
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
              <div class="col-4">
                <q-input
                  ref="qInputRef"
                  dense
                  color="primary"
                  label="searchKeyword"
                  :model-value="searchKeyword"
                >
                </q-input>
                <div>{{ searchKeyword }}</div>
              </div>
              <div class="col-3">
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
    name: 'isuCd',
    required: true,
    label: 'isuCd',
    align: 'left',
    field: row => row.isuCd,
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
    name: 'dept',
    required: false,
    label: 'dept',
    align: 'left',
    field: row => row.dept,
  },
  {
    name: 'close',
    required: false,
    label: 'close',
    align: 'left',
    field: row => row.close,
  },
  {
    name: 'changeCode',
    required: false,
    label: 'changeCode',
    align: 'left',
    field: row => row.changeCode,
  },
  {
    name: 'changes',
    required: false,
    label: 'changes',
    align: 'left',
    field: row => row.changes,
  },
  {
    name: 'changesRatio',
    required: false,
    label: 'changesRatio',
    align: 'left',
    field: row => row.changesRatio,
  },
  {
    name: 'open',
    required: false,
    label: 'open',
    align: 'left',
    field: row => row.open,
  },
  {
    name: 'high',
    required: false,
    label: 'high',
    align: 'left',
    field: row => row.high,
  },
  {
    name: 'low',
    required: false,
    label: 'low',
    align: 'left',
    field: row => row.low,
  },
  {
    name: 'volume',
    required: false,
    label: 'volume',
    align: 'left',
    field: row => row.volume,
  },
  {
    name: 'amount',
    required: false,
    label: 'amount',
    align: 'left',
    field: row => row.amount,
  },
  {
    name: 'marcap',
    required: false,
    label: 'marcap',
    align: 'left',
    field: row => row.marcap,
  },
  {
    name: 'stocks',
    required: false,
    label: 'stocks',
    align: 'left',
    field: row => row.stocks,
  },
  {
    name: 'marketId',
    required: false,
    label: 'marketId',
    align: 'left',
    field: row => row.marketId,
  },
  {
    name: 'collectingDate',
    required: false,
    label: 'collectingDate',
    align: 'left',
    field: row => row.collectingDate,
  },
];

import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const tableRef = ref();
const qInputRef = ref();

const rows = ref([]);
// const filter = ref('');
const searchJobId = ref(null);
const searchKeyword = ref(null);
const loading = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
});

// const savedJobIdList = ref([]);
// const selectedJobId = ref(null);

// const collectIdToDelete = ref(null);

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;

  //1. 서버로부터 데이터를 가져온자.
  const params = {
    page,
    limit: rowsPerPage,
    allRows: rowsPerPage === 0 ? true : false,
    // collect_id: selectedJobId.value,
    searchJobId: searchJobId.value,
    searchKeyword: searchKeyword.value,
  };

  const response = await api.get('/finance-data-reader/krx-items/_paginate', {
    params,
  });

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

const fetch = async () => {
  console.log('fetch');
  tableRef.value.requestServerInteraction();
};

const initPage = async () => {
  console.log('initPage');
  tableRef.value.requestServerInteraction();
};

const onInput = ({ target: { value } }) => {
  searchKeyword.value = value;
};

onMounted(() => {
  console.log('onMounted');

  const el = qInputRef.value.getNativeElement();
  el.addEventListener('input', e => {
    console.log('input', e.target.value);
    searchKeyword.value = e.target.value;
  });

  initPage();
});
</script>

<style lang="scss" scoped></style>
