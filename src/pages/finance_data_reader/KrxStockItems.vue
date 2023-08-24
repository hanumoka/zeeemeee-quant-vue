<template>
  <q-page>
    <section class="q-pa-xl">
      <div class="text-h4">KRX 종목리스트</div>
      <q-separator class="q-my-md" />
      <div class="q-pa-xs">
        <q-table
          flat
          bordered
          ref="tableRef"
          title="KRX 종목리스트"
          :rows="rows"
          :columns="columns"
          row-key="_id"
          v-model:pagination="pagination"
          :loading="loading"
          binary-state-sort
          @request="onRequest"
        >
          <template v-slot:top>
            <q-btn
              color="primary"
              :disable="loading"
              label="수집하기"
              @click="collectKrxStockItems"
            />
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
            <q-space />
            <div class="row q-gutter-xs col-xs-6">
              <div class="col" style="width: 200px">
                <q-select
                  dense
                  v-model="selectedCollectId"
                  :options="savedCollectIdList"
                  label="collectId"
                >
                  <template v-slot:append>
                    <q-icon
                      name="close"
                      @click.stop.prevent="selectedCollectId = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-3">
                <q-input
                  dense
                  debounce="300"
                  color="primary"
                  v-model.lazy="searchKeyword"
                >
                </q-input>
              </div>
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
const selectedCollectId = ref(null);

const collectIdToDelete = ref(null);

async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  loading.value = true;

  //1. 서버로부터 데이터를 가져온자.
  const params = {
    page,
    limit: rowsPerPage,
    allRows: rowsPerPage === 0 ? true : false,
    collect_id: selectedCollectId.value,
    search_keyword: searchKeyword.value,
    // sortBy,
    // descending,
    // filter,
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

const collectKrxStockItems = async () => {
  console.log('collectKrxStockItems');

  const apiResult = await api
    .post('/finance-data-reader/krx-itmes/_collect')
    .then(response => {
      console.log(response.data);
      $q.notify({
        message: '수집이 완료되었습니다.',
        color: 'positive',
        icon: 'cloud_done',
      });

      initPage();
    });
};

const getCollectIds = async () => {
  const apiResult = await api
    .get('/finance-data-reader/krx-items/collect-ids')
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
  tableRef.value.requestServerInteraction();
  savedCollectIdList.value = await getCollectIds();
};

const deleteData = async () => {
  console.log('deleteData');
  const params = {
    collect_id: collectIdToDelete.value,
  };
  const response = await api.delete('/finance-data-reader/krx-items', {
    params,
  });
  initPage();
};

onMounted(() => {
  console.log('onMounted');
  initPage();
});
</script>

<style lang="scss" scoped></style>
