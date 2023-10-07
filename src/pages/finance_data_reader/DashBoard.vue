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
    <section>
      <div>
        <apexchart
          height="300"
          type="candlestick"
          :options="stockPriceChartOptions"
          :series="stockPriceSeriesData"
        ></apexchart>
      </div>
    </section>
    <section>
      <div>
        <apexchart
          height="300"
          type="area"
          :options="drawDownChartOptions"
          :series="drawDownSeriesData"
        ></apexchart>
      </div>
    </section>
    <section>
      <div>
        <apexchart
          height="300"
          type="line"
          :options="macdChartOptions"
          :series="macdSeriesData"
        ></apexchart>
        <!-- <div>
          <q-page padding>
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                  macdShortN(12) - macdLongN(26), Signal: macdSignalN(9),
                  Oscillator: MACD - Signal
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  비추세적일때, 하락추세일때 적합하지 않은 보조지표 상승추세에
                  매수를 하고 상승 추세가 꺼지는 시점에 매도를 하는데 적합한
                  보조지표
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  골든크로스: MACD 선이 시그널 선을 상향돌파할 때 발생하며, 이는
                  종목 가격의 상승세를 예상하는 긍정적인 신호로 해석될 수
                  있습니다.
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  데드크로스: MACD 선이 시그널 선을 하향돌파할 때 발생하며, 이는
                  종목 가격의 하락세를 예상하는 부정적인 신호로 해석될 수
                  있습니다.
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  오실레이터의: 절대값이 커지다가 작아지는 지점에서 매수/매도
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  오실레이터의: 반점이 되는 지점에서 매수/매도 (단기 매매방식,
                  종합적 판단 필요)
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <div>사는시점: MACD 선이 0선을 상향 돌파할때(상승국면)</div>
                  <div>사는시점: MACD 선이 SIGNAL 선을 상향 돌파할때</div>
                  <div>파는시점: MACD 선이 0선을 하향 돌파할때(하강국면)</div>
                  <div>파는시점: MACD 선이SIGNAL 선을 하향 돌파할때</div>
                  <div>
                    상승국면에서 MACD 선이 SIGNAL 선을 상향 돌파 하는 경우 가격
                    조정일 가능성이 있다.(거짓신호 일수도 있다.)
                  </div>
                  <div>
                    추천: 상승국면이면서 MACD선이 SIGNAL선을 상향돌파하는 경우
                    매수
                  </div>
                  <div>
                    추천: 주간차트, 일간차트 모두 MACD선이 SIGNAL선을
                    상향돌파하는 경우 매수(보수적 전략)
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-page>
        </div> -->
      </div>
    </section>
    <section>
      <div>
        <apexchart
          height="300"
          type="line"
          :options="rsiChartOptions"
          :series="rsiSeriesData"
        ></apexchart>
      </div>
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
    name: 'rsi',
    required: true,
    label: 'rsi',
    align: 'left',
    field: row => row.rsi,
  },
];

import { ref, onMounted, watch } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const stockPriceChartOptions = ref({
  chart: {
    type: 'candlestick',
    height: 150,
    width: '80%',
  },
  title: {
    text: 'Stock Price',
    align: 'left',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy',
    },
  },
});

const drawDownChartOptions = ref({
  chart: {
    type: 'area',
    height: 350,
  },
  title: {
    text: 'Draw Down',
    align: 'left',
  },
  subtitle: {
    text: '최고점 대비 감소울, Droawdown = ((최고점가격 - 현재가격) / 최고점가격) * 100',
    align: 'left',
    offsetY: 40,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(2); // 소수점 두 번째 자리까지 표시
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy',
    },
  },
  stroke: {
    curve: 'smooth',
    width: 1, // 선 두께 설정
    colors: ['#FF0000'], // 붉은색 설정
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      colorStops: [
        {
          offset: 0,
          color: '#FF7F7F', // 상단의 흐린 붉은색 설정
        },
        {
          offset: 100,
          color: '#FF0000', // 하단의 진한 붉은색 설정
        },
      ],
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
});

const macdChartOptions = ref({
  chart: {
    type: 'line',
    height: 350,
  },
  title: {
    text: 'MACD: 이동편균선의 수렴과 확산을 이용한 보조지표',
    align: 'left',
  },
  subtitle: {
    text: '장단기 이동편균을 활용하여 추가의 추세를 나타내주는 기술적 지표. 추세분석 선행 후 사용이 더 효과적',
    align: 'left',
    offsetY: 40,
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return parseInt(val); // 정수로 변환하여 반환
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'smooth',
    colors: ['#008FFB', '#00E396', '#FEB019'], // MACD, 시그널, 오실레이터에 대한 색상
    width: [2, 2, 1], // 선의 두께 설정
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy',
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'right',
  },
});

const rsiChartOptions = ref({
  chart: {
    id: 'rsi',
    height: 350,
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  title: {
    text: 'RSI',
    align: 'left',
  },
  // subtitle: {
  //   text: '장단기 이동편균을 활용하여 추가의 추세를 나타내주는 기술적 지표. 추세분석 선행 후 사용이 더 효과적',
  //   align: 'left',
  //   offsetY: 40,
  // },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 10,
    labels: {
      formatter: function (val) {
        return val.toFixed(0);
      },
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  stroke: {
    width: 2,
    colors: ['#4287f5'], // 그래프 선 색상
  },
  markers: {
    size: 0,
  },
  tooltip: {
    shared: true,
    y: {
      formatter: function (val) {
        return val.toFixed(2);
      },
    },
  },
  annotations: {
    yaxis: [
      {
        y: 30,
        borderColor: '#FF0000',
        label: {
          borderColor: '#FF0000',
          style: {
            color: '#FFF',
            background: '#FF0000',
          },
          text: '30',
        },
      },
      {
        y: 70,
        borderColor: '#00FF00',
        label: {
          borderColor: '#00FF00',
          style: {
            color: '#FFF',
            background: '#00FF00',
          },
          text: '70',
        },
      },
    ],
  },
});
const volumeChartOptions = ref({});

const $q = useQuasar();

const tableRef = ref();
const qInputRef = ref();

const rows = ref([]);

const max_draw_down = ref(0);

const searchJobId = ref(null);
const searchKeyword = ref('삼성전자');
const loading = ref(false);

const currentDate = new Date();
const fiveYearsAgo = new Date(currentDate);

fiveYearsAgo.setFullYear(currentDate.getFullYear() - 1);

const formatDate = date => {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const startDate = ref(formatDate(fiveYearsAgo));
const endDate = ref(formatDate(currentDate));

const dateRangeDisplay = ref(`${startDate.value} - ${endDate.value}`);
const showCalendar = ref(false);

const macdShortN = ref(12);
const macdLongN = ref(26);
const macdSignalN = ref(9);

const stockPriceSeriesData = ref([]);
const drawDownSeriesData = ref([]);
const macdSeriesData = ref([]);
const rsiSeriesData = ref([]);
const volumeSeriesData = ref([]);

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

  try {
    const response = await api.get('/finance-data-reader/dashboard', {
      params,
    });

    console.log(JSON.stringify(response.data.dataList));

    rows.value.splice(0, rows.value.length, ...response.data.dataList);
    max_draw_down.value = response.data.maxDrawDown;

    const candlestickData = {
      name: 'candlestick',
      data: [],
    };

    const drawDownData = {
      name: 'Draw Down',
      data: [],
    };

    const macdData = {
      name: 'MACD',
      type: 'line',
      data: [],
    };

    const signalData = {
      name: 'Signal',
      type: 'line',
      data: [],
    };

    const oscillatorData = {
      name: 'Oscillator',
      type: 'column',
      data: [],
    };

    const rsiData = {
      name: 'rsi',
      type: 'line',
      data: [],
    };

    response.data.dataList.forEach(item => {
      const x = new Date(item.date).getTime();
      const ohlc = [item.open, item.high, item.low, item.close];
      candlestickData.data.push({ x, y: ohlc });

      drawDownData.data.push({ x, y: item.drawDown });

      const macd = item.macd;
      macdData.data.push({ x, y: macd });

      const signal = item.signal;
      signalData.data.push({ x, y: signal });

      const oscillator = item.macdOscillator;
      oscillatorData.data.push({ x, y: oscillator });

      const rsi = item.rsi;
      rsiData.data.push({ x, y: rsi });
    });

    stockPriceSeriesData.value = [candlestickData];
    drawDownSeriesData.value = [drawDownData];
    macdSeriesData.value = [macdData, signalData, oscillatorData];
    console.log(JSON.stringify(rsiData));
    rsiSeriesData.value = [rsiData];
  } catch (error) {
    console.log(error);
    $q.notify({
      color: 'negative',
      message: '데이터 조회에 실패했습니다.',
    });
  } finally {
    loading.value = false;
  }
} //

const fetch = async () => {
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
