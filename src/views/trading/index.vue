<script setup>
import { NIcon, NButton, NTabs, NTabPane, NDataTable, NInput, useMessage  } from 'naive-ui'
import { Star16Regular, Star16Filled, CaretDown16Filled } from '@vicons/fluent'
import { ref, onMounted } from 'vue'
import initTickerTape from '@/utils/initTickerTape.js'
import useCryptoWS from '@/hooks/useCryptoWS.js'
import OptionCard from './components/OptionCard.vue'

const message = useMessage();
const { coinList, book15Data, tradeData } = useCryptoWS()
const tickerTapRef = ref(null)
const tradingViewRef = ref(null)
const selectedCoin = ref(null)
const showSelect = ref(false)
const selectOptionRef = useTemplateRef('selectOptionRef')
watch(showSelect, (val) => {
  const handleClickOutside = (e) => {
    if (selectOptionRef.value && !selectOptionRef.value.contains(e.target)) {
      showSelect.value = false
    }
  }

  if (val) {
    document.addEventListener('mousedown', handleClickOutside)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
  }
})

const orderType = ref('commission')
const showBuy = ref(true)
const showSell = ref(true)
const positionTableColumns = ref([
  {
    title: '合约',
    key: '合约',
    width: 100,
  },
  {
    title: '持仓方向',
    key: '持仓方向',
    width: 100,
  },
  {
    title: '持仓模式',
    key: '持仓模式',
    width: 100,
  },
  {
    title: '杠杆',
    key: '杠杆',
    width: 100,
  },
  {
    title: '收益(USDT)',
    key: '收益(USDT)',
    width: 100,
  },
  {
    title: '收益率',
    key: '收益率',
    width: 100,
  },
  {
    title: '持仓量',
    key: '持仓量',
    width: 100,
  },
  {
    title: '保证金(USDT)',
    key: '保证金(USDT)',
    width: 100,
  },
  {
    title: '保证金率',
    key: '保证金率',
    width: 100,
  },
  {
    title: '开仓均价',
    key: '开仓均价',
    width: 100,
  },
  {
    title: '标记价格',
    key: '标记价格',
    width: 100,
  },
  {
    title: '预估强平价',
    key: '预估强平价',
    width: 100,
  },
  {
    title: '操作',
    fixed: 'right',
    width: 80,
    render(row) {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0 8px',
          },
        },
        [
          h(
            NButton,
            {
              type: 'primary',
            },
            {
              default: () => '操作按钮',
            },
          ),
        ],
      )
    },
  },
])
const commissionTableColumns = ref([
  { title: '合约', key: 'Symbol', width: 100, align: 'center' },
  {
    title: '类型',
    key: 'OrderType',
    width: 100,
    align: 'center',
    render(row) {
      return row.OrderType === 'Limit' ? '限价' : '市价';
    }
  },
  {
    title: '杠杆',
    key: 'Leverage',
    width: 100,
    align: 'center',
    render(row) {
      return `${row.Leverage}X`;
    }
  },
  {
    title: '方向',
    key: 'Side',
    width: 100,
    align: 'center',
    render(row) {
      let sideText;
      let sideColor;

      switch (row.Side) {
        case 0:
          sideText = '开多';
          sideColor = 'green';
          break;
        case 1:
          sideText = '开空';
          sideColor = 'red';
          break;
        case 2:
          sideText = '平多';
          sideColor = 'red';
          break;
        case 3:
          sideText = '平空';
          sideColor = 'green';
          break;
        case 4:
          sideText = '单向持仓买';
          sideColor = 'black';
          break;
        case 5:
          sideText = '单向持仓卖';
          sideColor = 'black';
          break;
        default:
          sideText = '未知';
          sideColor = 'black';
      }

      return h('span', { style: { color: sideColor } }, sideText);
    }
  },
  { title: '委托数量', key: 'Quantity', width: 100, align: 'center' },
  { title: '已成交数量', key: 'QuantityFilled', width: 100, align: 'center' },
  { title: '委托价格', key: 'Price', width: 100, align: 'center' },
  { title: '创建时间', key: 'CreateTime', width: 100, align: 'center' },
  {
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center',
    render(row) {
      return h(
          NButton,
          { type: 'primary' },
          { default: () => '撤单' }
      );
    }
  }
]);
const positionRecordTableColumns = ref([
  { title: '合约', key: 'Symbol', width: 100, align: 'center' },
  {
    title: '持仓方向',
    key: 'HoldSide',
    width: 100,
    align: 'center',
    render(row) {
      const holdSideText = row.HoldSide === 'Long' ? '多头' : '空头';
      const color = row.HoldSide === 'Long' ? 'green' : 'red';
      return h('span', { style: { color } }, holdSideText);
    },
  },
  {
    title: '持仓模式',
    key: 'MarginMode',
    width: 100,
    align: 'center',
    render(row) {
      return row.MarginMode === 'isolated' ? '逐仓' : '全仓';
    },
  },
  {
    title: '持仓均价',
    key: 'OpenPrice',
    width: 100,
    align: 'center',
  },
  {
    title: '累计开仓数量',
    key: 'OpenTotal',
    width: 100,
    align: 'center',
  },
  {
    title: '已实现盈亏',
    key: 'Pnl',
    width: 100,
    align: 'center',
    render(row) {
      const color = parseFloat(row.Pnl) > 0 ? 'green' : 'red';
      return h('span', { style: { color } }, row.Pnl);
    },
  },
  {
    title: '净盈亏',
    key: 'NetProfit',
    width: 100,
    align: 'center',
    render(row) {
      const color = parseFloat(row.NetProfit) > 0 ? 'green' : 'red';
      return h('span', { style: { color } }, row.NetProfit);
    },
  },
  {
    title: '累计手续费',
    key: 'TotalFillFee',
    width: 100,
    align: 'center',
  },
  {
    title: '累计资金费用',
    key: 'TotalFunding',
    width: 100,
    align: 'center',
  },
  {
    title: '开仓时间',
    key: 'CreateTime',
    width: 150,
    align: 'center',
  },
  {
    title: '平仓时间',
    key: 'CloseTime',
    width: 150,
    align: 'center',
  },
]);

const commissionRecordTableColumns = ref([
  {
    title: '合约',
    key: 'Symbol',
    width: 100,
    align: 'center'
  },
  {
    title: '订单类型',
    key: 'OrderType',
    width: 100,
    align: 'center',
    render(row) {
      return row.OrderType === 'Limit' ? '限价' : '市价';
    }
  },
  {
    title: '开单方向',
    key: 'Side',
    width: 100,
    align: 'center',
    render(row) {
      let sideText;
      let sideColor;
      switch (row.TradeSide) {
        case 0:
          sideText = '开多';
          sideColor = 'green';
          break;
        case 1:
          sideText = '开空';
          sideColor = 'red';
          break;
        case 2:
          sideText = '平多';
          sideColor = 'red';
          break;
        case 3:
          sideText = '平空';
          sideColor = 'green';
          break;
        default:
          sideText = '未知';
          sideColor = 'black';
      }
      return h('span', { style: { color: sideColor } }, sideText);
    }
  },
  {
    title: '持仓模式',
    key: 'MarginMode',
    width: 100,
    align: 'center',
    render(row) {
      return row.MarginMode === 'isolated' ? '逐仓' : '全仓';
    }
  },
  {
    title: '杠杆',
    key: 'Leverage',
    width: 100,
    align: 'center',
    render(row) {
      return `${row.Leverage}X`;
    }
  },
  {
    title: '订单状态',
    key: 'Status',
    width: 100,
    align: 'center',
    render(row) {
      let orderStatus;
      switch (row.Status) {
        case 'New':
          orderStatus = "新建订单";
          break;
        case 'Partially_filled':
          orderStatus = "部分成交";
          break;
        case 'Filled':
          orderStatus = "全部成交";
          break;
        case 'Canceled':
          orderStatus = "已撤销";
          break;
        default:
          orderStatus = "未知";
      }
      return orderStatus;
    }
  },
  {
    title: '成交均价',
    key: 'AvgPrice',
    width: 100,
    align: 'center'
  },
  {
    title: '成交数量',
    key: 'QuantityFilled',
    width: 100,
    align: 'center'
  },
  {
    title: '委托价格',
    key: 'Price',
    width: 100,
    align: 'center'
  },
  {
    title: '委托数量',
    key: 'Quantity',
    width: 100,
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'CreateTime',
    width: 150, // 增加创建时间的宽度
    align: 'center'
  },
]);



watch(
  coinList,
  (val) => {
    if (val.length) {
      // 如果selectedCoin已选择，则更新为coinList中的对应数据
      if (selectedCoin.value) {
        const updatedCoin = val.find((coin) => coin.instId === selectedCoin.value.instId)
        if (updatedCoin) {
          selectedCoin.value = updatedCoin
        }
      } else {
        // 如果selectedCoin还没有选择，则设置默认的初始值
        selectedCoin.value = val.find((coin) => coin.instId === 'BTCUSDT')
      }
    }
  },
  { deep: true },
)
// 自定义节流函数，每隔 delay 毫秒执行一次
function throttle(fn, delay) {
  let lastCall = 0
  return function (...args) {
    const now = new Date().getTime()
    if (now - lastCall >= delay) {
      lastCall = now
      return fn(...args)
    }
  }
}

// 初始化 refs
const totalAskVolume = ref(0)
const totalBidVolume = ref(0)
const percentageB = ref(0)
const percentageS = ref(0)
const coinBook15List = ref({
  asks: [],
  bids: [],
})
const positionData = ref([]);
const commissionData = ref([]);
const positionRecordData = ref([]);
const filledOrdersData = ref([]);
const fetchLiveOrders = async () => {
  const token = localStorage.getItem('accessToken'); // 从本地存储获取 token
  if (!token) {
    message.error('请先登录');
    return;
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/GetMyLiveOrders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('网络响应失败');
    }

    const data = await response.json(); // 解析为 JSON

    if (data.Success) {
      commissionData.value = data.ResData; // 将返回的数据赋值给 commissionData
    } else {
      message.error(data.ErrMsg || '加载数据失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
  }
};
// 函数: 获取历史委托数据
const fetchFilledOrders = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    message.error('请先登录');
    return;
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/GetMyFilledOrders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('网络响应失败');

    const data = await response.json();
    if (data.Success) {
      filledOrdersData.value = data.ResData;
    } else {
      message.error(data.ErrMsg || '加载数据失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
  }
};
const fetchHistoryPositions = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    message.error('请先登录');
    return;
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/GetMyHistoryPositions', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('网络响应失败');

    const data = await response.json();
    if (data.Success) {
      positionRecordData.value = data.ResData;
    } else {
      message.error(data.ErrMsg || '加载数据失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
  }
};

// 节流的更新函数，用于更新总数和百分比条比例
const updateCoinBookList = throttle((data) => {
  // 对 asks 从高到低排序并取出前 20 项
  const sortedAsks = data.asks.slice().sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
  const lastTwentyAsks = sortedAsks.slice(0, 26)
  totalAskVolume.value = lastTwentyAsks.reduce((acc, ask) => acc + parseFloat(ask[1]), 0)

  // 对 bids 从高到低排序并取出前 20 项
  const sortedBids = data.bids.slice().sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
  const firstTwentyBids = sortedBids.slice(0, 26)
  totalBidVolume.value = firstTwentyBids.reduce((acc, bid) => acc + parseFloat(bid[1]), 0)

  // 计算百分比
  const totalVolume = totalAskVolume.value + totalBidVolume.value
  percentageB.value = ((totalBidVolume.value / totalVolume) * 100).toFixed(2)
  percentageS.value = ((totalAskVolume.value / totalVolume) * 100).toFixed(2)

  // 更新 coinBook15List 数据，包含排序后的 `asks` 和 `bids`
  let cumulativeAskVolume = 0
  const cumulativeAsks = lastTwentyAsks
    .slice()
    .reverse()
    .map((ask) => {
      cumulativeAskVolume += parseFloat(ask[1])
      return [...ask, cumulativeAskVolume.toFixed(2), ((cumulativeAskVolume / totalAskVolume.value) * 100).toFixed(2)]
    })
    .reverse()

  let cumulativeBidVolume = 0
  const cumulativeBids = firstTwentyBids.map((bid) => {
    cumulativeBidVolume += parseFloat(bid[1])
    return [...bid, cumulativeBidVolume.toFixed(2), ((cumulativeBidVolume / totalBidVolume.value) * 100).toFixed(2)]
  })

  coinBook15List.value = {
    ...data,
    asks: cumulativeAsks,
    bids: cumulativeBids,
  }
}, 500) // 每 0.5 秒最多执行一次

// 监听 book15Data 和 selectedCoin 的变化，使用节流函数更新
watch(
  [book15Data, selectedCoin],
  () => {
    if (
      book15Data.value &&
      selectedCoin.value &&
      book15Data.value.arg?.instId === selectedCoin.value.instId &&
      book15Data.value.data &&
      book15Data.value.data[0]
    ) {
      const data = book15Data.value.data[0]
      updateCoinBookList(data) // 使用节流后的更新函数
    }
  },
  { immediate: true, deep: true },
)

// 初始化 tradeList，存储最近的交易记录

const tradeList = ref([])

watch(
  [tradeData, selectedCoin],
  () => {
    if (
      tradeData.value &&
      selectedCoin.value &&
      tradeData.value.arg?.instId === selectedCoin.value.instId &&
      tradeData.value.data &&
      tradeData.value.data.length > 0
    ) {
      // 获取最新的交易数据
      const newTrades = tradeData.value.data

      // 每次更新时，创建一个新列表并只保留前 30 条数据
      tradeList.value = [...newTrades, ...tradeList.value].slice(0, 30)

      // 调试：查看更新后的 tradeList
      console.log('Updated Trade List:', tradeList.value)
    }
  },
  { immediate: true, deep: true },
)
onMounted(() => {
  if (tickerTapRef.value) {
    tickerTapRef.value.appendChild(initTickerTape())
  }
  if (tradingViewRef.value) {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      new TradingView.widget({
        width: '100%',
        height: 600,
        symbol: 'BITGET:BTCUSDTPERP',
        interval: '1',
        timezone: 'Asia/Shanghai',
        theme: 'light',
        style: '1',
        locale: 'zh_CN',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        withdateranges: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        allow_symbol_change: false,
        studies: ['Volume@tv-basicstudies'],
        container_id: 'tradingview_12345',
        overrides: {
          volumePaneSize: 'medium',
          'paneProperties.vertGridProperties.color': '#363c4e',
          'paneProperties.horzGridProperties.color': '#363c4e',
          'scalesProperties.textColor': '#AAA',
          'mainSeriesProperties.candleStyle.upColor': '#26a69a',
          'mainSeriesProperties.candleStyle.downColor': '#ef5350',
          'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
          'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
          'mainSeriesProperties.showPriceLine': true,
          'mainSeriesProperties.priceLineColor': '#ff0000',
          'mainSeriesProperties.priceLineWidth': 1,
          'priceScaleProperties.percentage': true,
          'priceScaleProperties.autoScale': true,
        },
      })
    }
    tradingViewRef.value.appendChild(script)
  }
  fetchLiveOrders();
  fetchFilledOrders();
  fetchHistoryPositions();
})
</script>

<template>
  <div ref="tickerTapRef" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
  </div>
  <div class="lg:flex">
    <div class="flex-1">
      <div class="flex flex-col gap-x-2 lg:flex-row">
        <div class="flex-1">
          <div class="flex flex-col lg:flex-row items-center lg:h-[70px] bg-white">
            <div class="flex items-center w-full lg:w-auto px-2">
              <div class="relative">
                <div
                  class="h-16 w-[200px] border border-slate-200 rounded-md flex items-center gap-x-2 px-2 box-border"
                  @click="showSelect = !showSelect"
                >
                  <img class="size-[40px]" :src="selectedCoin?.image" />
                  <div class="flex-1">
                    <div class="text-lg font-bold">{{ selectedCoin?.instId }}</div>
                    <div class="text-xs text-slate-400">{{ selectedCoin?.symbol }}</div>
                  </div>
                  <NIcon>
                    <CaretDown16Filled />
                  </NIcon>
                </div>
                <div
                  v-show="showSelect"
                  ref="selectOptionRef"
                  class="bg-white absolute top-[70px] w-[250px] lg:w-[300px] z-10 shadow-md"
                >
                  <div class="p-2">
                    <NInput size="small" placeholder="搜索别名" />
                  </div>
                  <div
                    class="px-2 py-1 flex items-center gap-x-2 hover:bg-slate-200"
                    v-for="item of coinList"
                    :key="item.instId"
                    @click="
                      () => {
                        selectedCoin = item
                        showSelect = false
                      }
                    "
                  >
                    <NIcon class="text-lg text-yellow-300">
                      <!--              <Star16Regular />-->
                      <Star16Filled />
                    </NIcon>
                    <img class="size-[30px]" :src="item.image" />
                    <div class="flex-1">{{ item.instId }}</div>
                    <div class="text-xs">
                      ${{ item.lastPrice.toFixed(2) }}|
                      <span
                        :style="{
                          color: item.change24h > 0 ? '#5ac820' : 'red',
                        }"
                        >{{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 lg:flex-1 lg:flex items-center">
              <!-- 当前价格 -->
              <div class="flex-1 text-center">
                <div
                  class="text-2xl font-bold"
                  :style="{
                    color: selectedCoin?.change24h > 0 ? '#5ac820' : 'red',
                  }"
                >
                  ${{ selectedCoin?.lastPrice ? selectedCoin.lastPrice : 'N/A' }}
                </div>
                <div class="text-xs">≈ ${{ selectedCoin?.markPrice ? selectedCoin.markPrice : 'N/A' }}</div>
              </div>

              <!-- 24h 涨跌幅 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">24h涨跌幅</div>
                <div class="text-xs font-bold" :style="{ color: selectedCoin?.change24h > 0 ? '#5ac820' : 'red' }">
                  {{
                    selectedCoin?.change24h
                      ? (selectedCoin.change24h > 0 ? '+' : '') + selectedCoin.change24h + '%'
                      : 'N/A'
                  }}
                </div>
              </div>

              <!-- 24h 最高价 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">24h最高价</div>
                <div class="text-xs">{{ selectedCoin?.high24h ? selectedCoin.high24h.toFixed(2) : 'N/A' }}</div>
              </div>

              <!-- 24h 最低价 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">24h最低价</div>
                <div class="text-xs">{{ selectedCoin?.low24h ? selectedCoin.low24h.toFixed(2) : 'N/A' }}</div>
              </div>

              <!-- 24h 成交量 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">24h成交量</div>
                <div class="text-xs">
                  {{ selectedCoin?.baseVolume ? (selectedCoin.baseVolume / 1000).toFixed(2) + 'k' : 'N/A' }}
                </div>
              </div>

              <!-- 24h 成交额 (USDT) -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">24h成交额(USDT)</div>
                <div class="text-xs">
                  {{ selectedCoin?.quoteVolume ? (selectedCoin.quoteVolume / 1000000).toFixed(2) + 'M' : 'N/A' }}
                </div>
              </div>
            </div>
          </div>
          <div ref="tradingViewRef" class="tradingview-widget-container">
            <div id="tradingview_12345"></div>
          </div>
        </div>
        <div class="flex relative">
          <OptionCard class="block lg:hidden" />
          <div class="flex-1 lg:flex-auto lg:w-[300px] bg-white flex flex-col">
            <div class="flex gap-x-2">
              <NButton
                size="tiny"
                :type="orderType === 'commission' ? 'primary' : 'default'"
                @click="orderType = 'commission'"
                >委托订单</NButton
              >
              <NButton size="tiny" :type="orderType === 'newest' ? 'primary' : 'default'" @click="orderType = 'newest'"
                >最新成交</NButton
              >
            </div>
            <template v-if="orderType === 'commission'">
              <div class="flex gap-x-2 items-center">
                <img
                  class="size-[22px]"
                  src="/both_trading.png"
                  @click="
                    () => {
                      showSell = true
                      showBuy = true
                    }
                  "
                />
                <img
                  class="size-[22px]"
                  src="/only_buy.png"
                  @click="
                    () => {
                      showSell = true
                      showBuy = false
                    }
                  "
                />
                <img
                  class="size-[22px]"
                  src="/only_sell.png"
                  @click="
                    () => {
                      showSell = false
                      showBuy = true
                    }
                  "
                />
              </div>
              <div class="flex text-xs text-slate-400 mt-2">
                <div class="flex-1">价格(USDT)</div>
                <div class="flex-1">数量</div>
                <div class="hidden lg:block flex-1">总数</div>
              </div>

              <!-- 卖出列表（asks） -->
              <div v-if="showSell" class="flex-1 text-red-500 space-y-2">
                <div
                  v-for="(ask, index) in showBuy ? coinBook15List.asks.slice(0, 10) : coinBook15List.asks.slice(0, 26)"
                  :key="`ask-${index}`"
                  class="flex text-xs text-red-500 relative"
                >
                  <div class="flex-1 z-10">{{ parseFloat(ask[0]).toFixed(2) }}</div>
                  <div class="flex-1 z-10">{{ parseFloat(ask[1]).toFixed(2) }}</div>
                  <div class="hidden lg:block flex-1 z-10 text-right">{{ ask[2] }}</div>
                  <!-- 显示累加总数 -->
                  <div class="absolute -top-0.5 -bottom-0.5 right-0 bg-red-200" :style="{ width: `${ask[3]}%` }"></div>
                </div>
              </div>

              <!-- 当前价格 -->
              <div class="flex items-center">
                <div class="flex-1 text-red-500 text-sm lg:text-4xl font-bold">
                  {{ selectedCoin?.lastPrice }}
                </div>
                <div class="flex-1 text-xs lg:text-xl">${{ selectedCoin?.markPrice }}</div>
              </div>

              <!-- 买入列表（bids） -->
              <div v-if="showBuy" class="flex-1 space-y-2">
                <div
                  v-for="(bid, index) in showSell ? coinBook15List.bids.slice(0, 10) : coinBook15List.bids.slice(0, 26)"
                  :key="`bid-${index}`"
                  class="flex text-xs text-green-500 relative"
                >
                  <div class="flex-1 z-10">{{ parseFloat(bid[0]).toFixed(2) }}</div>
                  <div class="flex-1 z-10">{{ parseFloat(bid[1]).toFixed(2) }}</div>
                  <div class="hidden lg:block flex-1 z-10 text-right">{{ bid[2] }}</div>
                  <!-- 显示累加总数 -->
                  <div
                    class="absolute -top-0.5 -bottom-0.5 right-0 bg-green-200"
                    :style="{ width: `${bid[3]}%` }"
                  ></div>
                </div>
              </div>
              <div class="h-[70px] lg:hidden"></div>
              <div class="lg:px-2 flex gap-x-2 mt-4 lg:mt-0 absolute lg:static left-2 bottom-0 right-2">
                <!-- B 标签 -->
                <div class="text-green-500 border border-green-500 size-6 text-center leading-6">B</div>
                <div class="flex-1">
                  <!-- 进度条容器 -->
                  <div class="flex h-[20px] w-full">
                    <!-- 绿色部分，代表买入（B） -->
                    <div :style="{ width: `${percentageB}%` }" class="bg-green-200 h-full"></div>
                    <!-- 红色部分，代表卖出（S） -->
                    <div :style="{ width: `${percentageS}%` }" class="bg-red-200 h-full"></div>
                  </div>
                  <!-- 百分比显示 -->
                  <div class="flex items-center justify-between mt-1">
                    <div class="text-green-500">{{ percentageB }}%</div>
                    <div class="text-rose-500">{{ percentageS }}%</div>
                  </div>
                </div>
                <!-- S 标签 -->
                <div class="text-rose-500 border border-rose-500 size-6 text-center leading-6">S</div>
              </div>
            </template>

            <div v-else class="h-[530px] lg:h-[650px] overflow-hidden">
              <!-- 表头 -->
              <div class="flex text-xs text-slate-400 mt-2">
                <div class="flex-1">价格(USDT)</div>
                <div class="flex-1">数量</div>
                <div class="flex-1 hidden lg:block">时间</div>
              </div>

              <!-- 显示时间最新的 30 条交易记录 -->
              <div
                v-for="(trade, index) in tradeList.reverse()"
                :key="`${trade.ts}-${trade.tradeId}`"
                class="flex gap-y-2 p-1 text-xs"
              >
                <!-- 价格，根据买卖方向动态设置颜色 -->
                <div
                  class="flex-1"
                  :class="{ 'text-green-500': trade.side === 'buy', 'text-red-500': trade.side === 'sell' }"
                >
                  {{ parseFloat(trade.price).toFixed(2) }}
                </div>
                <!-- 成交数量 -->
                <div class="flex-1">{{ parseFloat(trade.size).toFixed(8) }}</div>
                <!-- 成交时间，格式化为 HH:mm:ss -->
                <div class="flex-1 hidden lg:block">
                  {{ new Date(parseInt(trade.ts)).toLocaleTimeString('en-US', { hour12: false }) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4">
        <NTabs
            default-value="position"
            size="small"
            animated
            pane-wrapper-style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <NTabPane name="position" :tab="'仓位(' + (positionData?.length || 0) + ')'">
            <div style="max-height: 400px; overflow-y: auto;">
              <NDataTable size="small" :columns="positionTableColumns" :data="positionData" :bordered="false" />
            </div>
          </NTabPane>
          <NTabPane :name="'commission'" :tab="'委托(' + (commissionData?.length || 0) + ')'">
            <div style="max-height: 400px; overflow-y: auto;">
              <NDataTable size="small" :columns="commissionTableColumns" :data="commissionData" :bordered="false" />
            </div>
          </NTabPane>
          <NTabPane name="positionRecord" :tab="'历史仓位(' + (positionRecordData?.length || 0) + ')'">
            <div style="max-height: 400px; overflow-y: auto;">
              <NDataTable size="small" :columns="positionRecordTableColumns" :data="positionRecordData" :bordered="false" />
            </div>
          </NTabPane>
          <NTabPane :name="'commissionRecord'" :tab="'历史委托(' + (filledOrdersData?.length || 0) + ')'">
            <div style="max-height: 400px; overflow-y: auto;">
              <NDataTable size="small" :columns="commissionRecordTableColumns" :data="filledOrdersData" :bordered="false" />
            </div>
          </NTabPane>
        </NTabs>
      </div>
    </div>
    <OptionCard class="hidden lg:block" />
  </div>
</template>
<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px; /* 设置滚动条宽度 */
  height: 8px; /* 设置水平滚动条高度 */
}

::-webkit-scrollbar-track {
  background: #f0f0f0; /* 滚动条背景颜色 */
  border-radius: 10px; /* 使滚动条背景更圆滑 */
}

::-webkit-scrollbar-thumb {
  background-color: #c1c1c1; /* 滚动条颜色 */
  border-radius: 10px; /* 滚动条的圆角 */
  border: 2px solid #f0f0f0; /* 为滚动条增加内边框 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1a1; /* 滚动条悬停颜色 */
}
</style>
