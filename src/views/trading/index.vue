<script setup>
import {NIcon, NButton, NTabs, NTabPane, NDataTable, NInput, NModal, useMessage, NSlider} from 'naive-ui'
import {Star16Regular, Star16Filled, CaretDown16Filled} from '@vicons/fluent'
import {provide, ref, onMounted} from 'vue'
import initTickerTape from '@/utils/initTickerTape.js'
import useCryptoWS from '@/hooks/useCryptoWS.js'
import OptionCard from './components/OptionCard.vue'
import {useTableColumns} from './model'
import { useRoute } from 'vue-router';

const route = useRoute();
const coin = route.query.coin;

const { t } = useI18n()
const {
  positionModal,
  profitModal,
  profitModalData,
  positionModalData,
  openProfitModal,
  openPositionModal,
  positionTableColumns,
  commissionTableColumns,
  commissionRecordTableColumns,
  positionRecordTableColumns,
} = useTableColumns(cancelOrder)

const available = ref('0.000')
const token = localStorage.getItem('accessToken');
const message = useMessage()
const {coinList, book15Data, tradeData} = useCryptoWS()
const searchValue = ref('')
const searchedCoinList = computed(() => {
  return coinList.value
      .map((item) => {
        // 判断是否在收藏列表中
        const isFavorite = myChoices.value.some((choice) => choice.symbol_name.replace('/', '') === item.instId);

        return {
          ...item,
          isFavorite,
        };
      })
      .filter((i) => i.instId.includes(searchValue.value.toUpperCase()))
      .sort((a, b) => b.lastPrice - a.lastPrice); // 按当前价格降序排列
});
const tickerTapRef = ref(null)
const tradingViewRef = ref(null)
const selectedCoin = ref(null)
const showSelect = ref(false)
const selectOptionRef = useTemplateRef('selectOptionRef')
const myChoices = ref([])
const websocket = ref(null)
let heartbeatInterval = null // 用于存储心跳包的定时器

const profitPercentage = ref(0); // 止盈百分比
const lossPercentage = ref(0);   // 止损百分比

// 用于切换价格模式的状态
const isLimitPrice = ref(true);

// 用户输入的限价价格
const inputPrice = ref('');
const currentPrice = computed(() => selectedCoin.value.lastPrice);

// 切换价格模式
function togglePriceMode() {
  isLimitPrice.value = !isLimitPrice.value;
  if (!isLimitPrice.value) {
    inputPrice.value = currentPrice.value; // 在切换为市价时，将价格设置为当前价格
  }
}

const quantityPercentage = ref(0); // 百分比

// 根据百分比计算平仓数量
const calculatedQuantity = computed(() => {
  return (quantityPercentage.value / 100 * positionModalData.value.available).toFixed(positionOperationCoin.value.volumePrecision);
});

// 计算预计盈亏 = (平仓价格 - 开仓均价) * 平仓数量
const expectedProfitLoss = computed(() => {
  const closePrice = isLimitPrice.value ? parseFloat(inputPrice.value || 0) : currentPrice.value;
  const openPrice = parseFloat(positionModalData.value.openPrice);
  const quantity = parseFloat(calculatedQuantity.value || 0);
  return ((closePrice - openPrice) * quantity).toFixed(8);
});

// 计算包含预计平仓手续费 = 预计盈亏 * 0.006
const estimatedClosingFee = computed(() => {
  return (expectedProfitLoss.value * 0.006).toFixed(8);
});

// 计算止盈价为 (1 + 百分比) * 开仓均价
const profitPrice = computed(() => {
  return ((1 + profitPercentage.value / 100) * profitModalData.value.openPrice).toFixed(2);
});

// 计算止损价为 (1 - 百分比) * 开仓均价
const lossPrice = computed(() => {
  return ((1 - lossPercentage.value / 100) * profitModalData.value.openPrice).toFixed(2);
});

const expectedProfit = computed(() => ((profitPrice.value - profitModalData.value.openPrice) * profitModalData.value.available).toFixed(2));
const expectedLoss = computed(() => ((lossPrice.value - profitModalData.value.openPrice) * profitModalData.value.available).toFixed(2));

// 计算选中的币种符号
const coinSymbol = computed(() => {
  if (selectedCoin.value && selectedCoin.value.symbol) {
    return selectedCoin.value.symbol.replace(/USDT$/, '') // 去掉结尾的 "USDT"
  }
  return ''
})

// UUID 生成函数
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function initializeWebSocket() {
  if (!token) {
    message.error('请先登录')
    return
  }

  // 建立 WebSocket 连接
  websocket.value = new WebSocket('ws://wstest.keepbit.top/KBitClientServer/')

  websocket.value.onopen = () => {
    // 发送验证消息
    const authMessage = {
      MsgId: generateUUID(),
      PackageType: 1,
      AuthToken: `Bearer ${token}`,
    }
    websocket.value.send(JSON.stringify(authMessage))

    // 启动心跳包定时器，每隔20秒发送一次
    heartbeatInterval = setInterval(() => {
      const heartbeatMessage = {
        MsgId: generateUUID(),
        PackageType: 0,
        Data: 'Ping',
      }
      websocket.value.send(JSON.stringify(heartbeatMessage))
    }, 20000) // 20秒
  }

  websocket.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data && data?.PackageType === 1 && data.ErrMsg === 'Success') {
      // 如果验证通过，发送订阅消息
      const subscribeMessage = {
        MsgId: generateUUID(),
        PackageType: 4,
        args: [
          {instType: 'USDT-FUTURES', channel: 'orders'},
          {instType: 'USDT-FUTURES', channel: 'positions'},
          {instType: 'USDT-FUTURES', channel: 'accounts'},
        ],
      }
      websocket.value.send(JSON.stringify(subscribeMessage))
    } else if (data.PackageType === 6 && data.arg?.channel === 'positions') {
      // 处理 `positions` 数据，更新仓位列表
      positionData.value = data.data.map((item) => ({
        PosId: item.PosId,
        Symbol: item.Symbol,
        OpenPrice: item.OpenPrice,
        MarkPrice: item.MarkPrice,
        Available: item.Available,
        Locked: item.Locked,
        Size: item.Size,
        ProfitAndLoss: item.ProfitAndLoss,
        UnPnl: item.UnPnl,
        HoldSide: item.HoldSide,
        Margin: item.Margin,
        MarginRate: item.MarginRate,
        MarginAsset: item.MarginAsset,
        ClosingPrice: item.ClosingPrice,
        Leverage: item.Leverage,
        Profit: item.Profit,
        ProfitRate: item.ProfitRate,
        MarginMode: item.MarginMode,
      }))
    } else if (data.PackageType === 6 && data.arg?.channel === 'Accounts') {
      available.value = data.data[0].available // 更新 available 值
    }
  }

  websocket.value.onerror = (error) => {
    console.error('WebSocket 连接错误:', error)
  }

  websocket.value.onclose = () => {
    console.log('WebSocket 连接已关闭')
    clearInterval(heartbeatInterval) // 清理心跳包定时器
  }
}

provide('available', available)
provide('coinSymbol', coinSymbol)
// 在组件销毁时清理 WebSocket 和心跳包
onUnmounted(() => {
  if (websocket.value) {
    websocket.value.close() // 关闭 WebSocket 连接
  }
  clearInterval(heartbeatInterval) // 清理心跳包定时器
})

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

const operationCoin = ref(null); // 专用于仓位操作的币种数据

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
    {deep: true},
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
const positionData = ref([])
const commissionData = ref([])
const positionRecordData = ref([])
const filledOrdersData = ref([])
const fetchLiveOrders = async () => {
  if (!token) {
    message.error('请先登录')
    return
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/GetMyLiveOrders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('网络响应失败')
    }

    const data = await response.json() // 解析为 JSON

    if (data.Success) {
      commissionData.value = data.ResData // 将返回的数据赋值给 commissionData
    } else {
      message.error(data.ErrMsg || '加载数据失败')
    }
  } catch (error) {
    message.error('请求出错，请稍后重试')
  }
}
// 函数: 获取历史委托数据
const fetchFilledOrders = async () => {
  if (!token) {
    message.error('请先登录')
    return
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/GetMyFilledOrders', {
      headers: {Authorization: `Bearer ${token}`},
    })
    if (!response.ok) throw new Error('网络响应失败')

    const data = await response.json()
    if (data.Success) {
      filledOrdersData.value = data.ResData
    } else {
      message.error(data.ErrMsg || '加载数据失败')
    }
  } catch (error) {
    message.error('请求出错，请稍后重试')
  }
}

watch(
    () => coinList.value,
    (newCoinList) => {
      // 遍历 positionData，更新每个持仓对象的 MarkPrice、profit 和 profitRate 字段
      positionData.value.forEach((position) => {
        const matchedCoin = newCoinList.find((coin) => coin.instId === position.Symbol)
        if (matchedCoin) {
          const lastPrice = matchedCoin.lastPrice // 获取最新的标记价格

          // 更新 MarkPrice
          position.MarkPrice = lastPrice

          // 根据新的 MarkPrice 计算 profit 和 profitRate
          const profit =
              position.HoldSide === 0
                  ? (position.OpenPrice - lastPrice) * position.Available
                  : (lastPrice - position.OpenPrice) * position.Available

          const profitRate = parseFloat(((profit + position.ProfitAndLoss) / position.Margin) * 100).toFixed(2)

          // 更新 position 的 profit 和 profitRate 字段
          position.Profit = parseFloat(profit).toFixed(2)
          position.ProfitRate = parseFloat(profitRate).toFixed(2) + '%'
        }
      })
    },
    {deep: true},
)
// 将 positionData 提供给子组件
provide('positionData', positionData)
const fetchHistoryPositions = async () => {
  if (!token) {
    message.error('请先登录')
    return
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/GetMyHistoryPositions', {
      headers: {Authorization: `Bearer ${token}`},
    })

    if (!response.ok) throw new Error('网络响应失败')

    const data = await response.json()
    if (data.Success) {
      positionRecordData.value = data.ResData
    } else {
      message.error(data.ErrMsg || '加载数据失败')
    }
  } catch (error) {
    message.error('请求出错，请稍后重试')
  }
}
const marketData = JSON.parse(localStorage.getItem('marketData') || '{}');

const getVolumePrecision = (symbol) => {
  const contracts = marketData.Contracts || [];
  const contract = contracts.find((c) => c.Symbol_name.replace('/', '') === symbol);
  return contract ? contract.VolumePlace : 0; // 默认精度为 0
};

const getPricePrecision = (symbol) => {
  const contracts = marketData.Contracts || [];
  const contract = contracts.find((c) => c.Symbol_name.replace('/', '') === symbol);
  return contract ? contract.PricePlace : 2; // 默认价格精度为 2
};

const updateCoinBookList = throttle((data) => {
  const askCount = showBuy.value ? 10 : 26; // 当只显示十条时使用10，否则26
  const bidCount = showSell.value ? 10 : 26;

  // 对 asks 按价格从高到低排序用于展示
  const sortedAsks = data.asks.slice().sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
  // 对 bids 按价格从高到低排序（买列表逻辑）
  const sortedBids = data.bids.slice().sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));

  // 取出指定条数的 asks 和 bids
  const displayedAsks = data.asks
      .slice()
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])) // 先按价格从低到高排序用于累计
      .slice(0, askCount)
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])); // 然后按价格从高到低排序用于展示

  const displayedBids = sortedBids.slice(0, bidCount); // 买列表保持默认从高到低

  // 获取当前交易对的精度
  const currentSymbol = selectedCoin.value?.symbol; // 假设当前交易对的 symbol 存储在 selectedCoin 中
  const volumePrecision = getVolumePrecision(currentSymbol);

  // 计算总量并应用精度
  totalAskVolume.value = displayedAsks.reduce((acc, ask) => acc + parseFloat(ask[1]), 0).toFixed(volumePrecision);
  totalBidVolume.value = displayedBids.reduce((acc, bid) => acc + parseFloat(bid[1]), 0).toFixed(volumePrecision);

  const totalVolume = parseFloat(totalAskVolume.value) + parseFloat(totalBidVolume.value);

  // 计算百分比比例
  percentageB.value = ((parseFloat(totalBidVolume.value) / totalVolume) * 100).toFixed(2);
  percentageS.value = ((parseFloat(totalAskVolume.value) / totalVolume) * 100).toFixed(2);

  // 卖列表累加从低价格开始累加并应用精度
  let cumulativeAskVolume = 0;
  const cumulativeAsks = displayedAsks
      .slice()
      .reverse() // 先按价格从低到高排列，用于正确的累加顺序
      .map((ask) => {
        cumulativeAskVolume += parseFloat(ask[1]);
        return [
          ...ask,
          cumulativeAskVolume.toFixed(volumePrecision), // 应用精度
          ((cumulativeAskVolume / parseFloat(totalAskVolume.value)) * 100).toFixed(2),
        ];
      })
      .reverse(); // 再恢复到高到低的展示顺序

  // 买列表累加并应用精度
  let cumulativeBidVolume = 0;
  const cumulativeBids = displayedBids.map((bid) => {
    cumulativeBidVolume += parseFloat(bid[1]);
    return [
      ...bid,
      cumulativeBidVolume.toFixed(volumePrecision), // 应用精度
      ((cumulativeBidVolume / parseFloat(totalBidVolume.value)) * 100).toFixed(2),
    ];
  });

  coinBook15List.value = {
    ...data,
    asks: cumulativeAsks,
    bids: cumulativeBids,
  };
}, 500);


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
    {immediate: true, deep: true},
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
        tradeList.value.unshift(...newTrades)
        tradeList.value.length = 30
      }
    },
    {immediate: true, deep: true},
)

const selectedPrice = ref(null) // 用于保存点击的价格

// 点击价格列表时调用的函数
function handlePriceClick(price) {
  selectedPrice.value = price
}

// 使用 provide 传递 selectedPrice
provide('selectedPrice', selectedPrice)
// 使用provide提供当前价格，供子组件使用
// 将 selectedCoin 的 lastPrice 设为一个 computed 引用，以便响应其变化
const currentOrderPrice = computed(() => selectedCoin.value?.lastPrice)
provide('currentOrderPrice', currentOrderPrice)

async function cancelOrder(Id) {
  if (!token) {
    message.error('请先登录')
    return
  }

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/CancelOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({OrderId: Id}),
    })

    const result = await response.json()

    if (result.Success) {
      message.success('撤单成功')
      fetchLiveOrders() // 重新获取订单列表
    } else {
      message.error(result.ErrMsg || '撤单失败')
    }
  } catch (error) {
    message.error('请求出错，请稍后重试')
    console.error('撤单请求出错:', error)
  }
}

function handleInput(value) {
  const precision = positionOperationCoin.value.pricePrecision || 2;

  // 正则匹配，允许输入小数，最多限制到 precision 位
  const regex = new RegExp(`^\\d*(\\.\\d{0,${precision}})?$`);

  if (regex.test(value)) {
    inputPrice.value = value; // 符合规则，更新输入值
  } else {
    // 如果不符合规则，截断多余的小数位
    const truncatedValue = parseFloat(value).toFixed(precision);
    inputPrice.value = truncatedValue === 'NaN' ? '' : truncatedValue;
  }
}

function handleQuantityInput(value) {
  const precision = positionOperationCoin.value.volumePrecision || 3;
  const regex = new RegExp(`^\\d*(\\.\\d{0,${precision}})?$`);

  if (regex.test(value)) {
    calculatedQuantity.value = value;
  } else {
    const truncatedValue = parseFloat(value).toFixed(precision);
    calculatedQuantity.value = truncatedValue === 'NaN' ? '' : truncatedValue;
  }
}

async function confirmStopProfitLoss() {
  if (!token) {
    message.error('请先登录')
    return
  }
  const data = {
    Symbol: profitModalData.value.symbol,
    Side: profitModalData.value.direction === '多头' ? 'long' : 'short',
    TakeProfitPrice: profitPrice.value,
    StopLossPrice: lossPrice.value
  };

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/SetStopProfitLoss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.Success) {
      message.success('止盈/止损设置成功');
      profitModal.value = false;
    } else {
      message.error(result.ErrMsg || '止盈/止损设置失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
    console.error('设置止盈/止损请求出错:', error);
  }
}

// 发送平仓请求
async function sendCloseOrder() {
  const closePrice = isLimitPrice.value ? parseFloat(inputPrice.value) : currentPrice.value;
  const orderSide = positionModalData.value.direction === '多头' ? 2 : 3;

  const orderData = {
    Symbol: positionModalData.value.symbol,
    MarginMode: positionModalData.value.marginMode === '逐仓' ? 'isolated' : 'crossed',
    MarginAsset: 'USDT',
    OrderSide: orderSide,
    OrderType: isLimitPrice.value ? 0 : 1, // 0为限价，1为市价
    Quantity: calculatedQuantity.value,
    Price: isLimitPrice.value ? closePrice : "0.0",
    Leverage: parseInt(positionModalData.value.leverage),
    ReduceOnly: false
  };

  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/SendOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    if (result.Success) {
      message.success('平仓订单发送成功');
      positionModal.value = false; // 关闭模态框
    } else {
      message.error(result.ErrMsg || '平仓订单发送失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
    console.error('平仓请求出错:', error);
  }
}

// 从 API 获取收藏的币种数据
async function fetchMyChoices() {
  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/MyChoice/GetMyChoices', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    if (data.Success) {
      myChoices.value = data.ResData
    } else {
      console.error('获取数据失败:', data.ErrMsg)
    }
  } catch (error) {
    console.error('请求出错:', error)
  }
}

async function toggleFavorite(symbol) {
  if (!token) {
    message.error('请先登录');
    return;
  }

  // 确定符号名称和相关参数
  const symbolName = `${symbol.instId.slice(0, -4)}/${symbol.instId.slice(-4)}`; // 拼接成 BTC/USDT 格式
  const encodedSymbolName = encodeURIComponent(symbolName); // 对符号名称进行编码
  const baseTokenId = symbol.instId.slice(0, -4); // 基础币种，如 BTC
  const quoteTokenId = symbol.instId.slice(-4); // 报价币种，如 USDT
  const symbolType = 2; // 根据需求，symbol_type 固定为 2

  try {
    if (symbol.isFavorite) {
      // 取消收藏请求
      const response = await fetch(
          `https://test.keepbit.top/app_api/v1/MyChoice/DelBySymbolType?symbol=${encodedSymbolName}&type=${symbolType}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      const result = await response.json();
      if (result.Success) {
        symbol.isFavorite = false; // 更新收藏状态
        message.success('取消收藏成功');
        fetchMyChoices()
      } else {
        message.error(result.ErrMsg || '取消收藏失败');
      }
    } else {
      // 添加收藏请求
      const response = await fetch(
          `https://test.keepbit.top/app_api/v1/MyChoice/AddSymbol?symbol_type=${symbolType}&symbol_name=${encodedSymbolName}&base_token_id=${baseTokenId}&quote_token_id=${quoteTokenId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      const result = await response.json();
      if (result.Success) {
        symbol.isFavorite = true; // 更新收藏状态
        message.success('收藏成功');
        fetchMyChoices()
      } else {
        message.error(result.ErrMsg || '收藏失败');
      }
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
    console.error('请求错误:', error);
  }
}

provide('marketData', marketData);

watch(
    [coinList, () => profitModalData.value.symbol], // 同时监听 coinList 和 profitModalData.symbol
    ([newCoinList, newSymbol], [oldCoinList, oldSymbol]) => {

      if (newSymbol) {
        // 在 coinList 中查找对应的币种
        const foundCoin = newCoinList.find((coin) => coin.instId === newSymbol);
        operationCoin.value = foundCoin || null; // 如果没找到则设置为 null
      }
    },
    {immediate: true, deep: true} // 深度监听 coinList 并确保初次加载时触发
);
const positionOperationCoin = ref(null); // 专用于 positionModal 的操作币种
watch(
    [coinList, () => positionModalData.value?.symbol], // 同时监听 coinList 和 positionModalData.symbol
    ([newCoinList, newSymbol], [oldCoinList, oldSymbol]) => {

      if (newSymbol) {
        // 在 coinList 中查找对应的币种
        const foundCoin = newCoinList.find((coin) => coin.instId === newSymbol);
        if (foundCoin) {
          const symbol = foundCoin.instId;
          positionOperationCoin.value = {
            ...foundCoin,
            pricePrecision: getPricePrecision(symbol), // 动态获取价格精度
            volumePrecision: getVolumePrecision(symbol), // 动态获取数量精度
          };
        } else {
          positionOperationCoin.value = null;
        }
        console.log(positionOperationCoin.value.volumePrecision)
      }
    },
    {immediate: true, deep: true} // 深度监听 coinList 并确保初次加载时触发
);
let hasSwitchedCoin = false; // 用于标志是否已经切换过币种
onMounted(() => {
  if (tickerTapRef.value) {
    tickerTapRef.value.appendChild(initTickerTape())
  }
  if (!document.getElementById('tradingview-js')) {
    const script = document.createElement('script');
    script.id = 'tradingview-js';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (selectedCoin.value) {
        const symbol = selectedCoin.value.instId.replace('/', '');
        updateTradingView(symbol);
      }
    };
    document.body.appendChild(script);
  } else {
    // 如果脚本已加载且 `selectedCoin` 存在，初始化 TradingView
    if (selectedCoin.value) {
      const symbol = selectedCoin.value.instId.replace('/', '');
      updateTradingView(symbol);
    }
  }

  if (token) {
    fetchLiveOrders();
    fetchFilledOrders();
    fetchHistoryPositions();
    initializeWebSocket();
    fetchMyChoices();
  }

  watch(
      () => coinList.value,
      (newCoinList) => {
        // 如果 coinList 有数据且尚未切换过币种
        if (newCoinList.length > 0 && coin && !hasSwitchedCoin) {
          const targetCoin = newCoinList.find((item) => item.instId === (coin.toUpperCase() + "USDT"));
          if (targetCoin) {
            selectedCoin.value = targetCoin;
            message.success(`已切换到币种 ${coin}`);
            hasSwitchedCoin = true; // 标记为已切换
          }
        }
      },
      { immediate: true, deep: true } // 确保监听初始值，并深度监听 coinList
  );
});

// 监听 selectedCoin 的 instId 变化
watch(
    () => selectedCoin.value?.instId,
    (newInstId, oldInstId) => {
      if (newInstId && newInstId !== oldInstId) {
        const symbol = newInstId.replace('/', ''); // 将币对格式化为符合 TradingView 的格式
        updateTradingView(symbol);
      }
    },
    {immediate: true} // 立即触发以初始化视图
);

function updateTradingView(symbol) {
  if (typeof TradingView === 'undefined') {
    console.error('TradingView 未定义，请确保脚本已正确加载');
    return;
  }

  const containerId = 'tradingview_12345';

  // 清除之前的 TradingView widget
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }

  // 初始化新的 TradingView widget
  new TradingView.widget({
    width: '100%',
    height: 600,
    symbol: `BITGET:${symbol}PERP`,
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
    container_id: containerId,
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
  });
}

defineProps({
  positionData: Array,
  commissionData: Array,
  positionRecordData: Array,
  filledOrdersData: Array,
  positionTableColumns: Array,
  commissionTableColumns: Array,
  positionRecordTableColumns: Array,
  commissionRecordTableColumns: Array,
});

const positionTabText = computed(() => {
  return `${t('trading.position')} (${positionData.value?.length || 0})`; // for ref() usage
});

const commissionTabText = computed(() => {
  return `${t('trading.entrustOrder')} (${commissionData.value?.length || 0})`;
});

const positionRecordTabText = computed(() => {
  return `${t('trading.historyPosition')} (${positionRecordData.value?.length || 0})`;
});

const commissionRecordTabText = computed(() => {
  return `${t('trading.historyEntrust')} (${filledOrdersData.value?.length || 0})`;
});
</script>

<template>
  <div ref="tickerTapRef" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
  </div>
  <div class="lg:flex">
    <div class="w-0 flex-1">
      <div class="flex flex-col gap-x-2 lg:flex-row">
        <div class="flex-1">
          <div class="flex flex-col lg:flex-row items-center lg:h-[70px] bg-white">
            <div class="flex items-center w-full lg:w-auto px-2">
              <div class="relative">
                <div
                    class="h-16 w-[200px] border border-slate-200 rounded-md flex items-center gap-x-2 px-2 box-border"
                    @click="showSelect = !showSelect"
                >
                  <img class="size-[40px]" :src="selectedCoin?.image"/>
                  <div class="flex-1">
                    <div class="text-lg font-bold">{{ selectedCoin?.instId }}</div>
                    <div class="text-xs text-slate-400">{{ t('trading.perpetual') }}</div>
                  </div>
                  <NIcon>
                    <CaretDown16Filled/>
                  </NIcon>
                </div>
                <div
                    v-show="showSelect"
                    ref="selectOptionRef"
                    class="bg-white absolute top-[70px] w-[250px] lg:w-[300px] z-10 shadow-md"
                >
                  <div class="p-2">
                    <NInput v-model:value="searchValue" size="small" :placeholder=" t('strategy.searchAlias') "/>
                  </div>
                  <div
                      class="px-2 py-1 flex items-center gap-x-2 hover:bg-slate-200"
                      v-for="item of searchedCoinList"
                      :key="item.instId"
                      @click="
                      () => {
                        selectedCoin = item
                        showSelect = false
                      }
                    "
                  >
                    <NIcon class="text-lg" :class="{ 'text-yellow-300': item.isFavorite }"
                           @click.stop="toggleFavorite(item)">
                      <component :is="item.isFavorite ? Star16Filled : Star16Regular"/>
                    </NIcon>
                    <img class="size-[30px]" :src="item.image"/>
                    <div class="flex-1">{{ item.instId }}</div>
                    <div class="text-xs">
                      ${{ item.lastPrice }}|
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
        color: selectedCoin?.lastPrice > selectedCoin?.markPrice ? '#5ac820' : 'red',
      }"
                >
                  ${{ selectedCoin?.lastPrice ? selectedCoin.lastPrice : 'N/A' }}
                </div>
                <div class="text-xs">≈ ${{ selectedCoin?.lastPrice ? selectedCoin.lastPrice : 'N/A' }}</div>
              </div>

              <!-- 24h 涨跌幅 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">{{ $t('trading.change24h') }}</div>
                <div class="text-xs font-bold" :style="{ color: selectedCoin?.change24h > 0 ? '#5ac820' : 'red' }">
                  {{
                    selectedCoin?.change24h
                        ? (selectedCoin.change24h > 0 ? '+' : '') + selectedCoin.priceChangePercent + '%'
                        : 'N/A'
                  }}
                </div>
              </div>

              <!-- 24h 最高价 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">{{ $t('trading.high24h') }}</div>
                <div class="text-xs">{{ selectedCoin?.high24h ? selectedCoin.high24h : 'N/A' }}</div>
              </div>

              <!-- 24h 最低价 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">{{ $t('trading.low24h') }}</div>
                <div class="text-xs">{{ selectedCoin?.low24h ? selectedCoin.low24h : 'N/A' }}</div>
              </div>

              <!-- 24h 成交量 -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">{{ $t('trading.volume24h') }}</div>
                <div class="text-xs">
                  {{ selectedCoin?.baseVolume ? (selectedCoin.baseVolume / 1000).toFixed(2) + 'k' : 'N/A' }}
                </div>
              </div>

              <!-- 24h 成交额 (USDT) -->
              <div class="flex-1 text-center">
                <div class="text-xs text-slate-400">{{ $t('trading.volumeQuote24h') }}</div>
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
          <OptionCard class="block lg:hidden"/>
          <div class="flex-1 lg:flex-auto lg:w-[300px] bg-white flex flex-col">
            <div class="flex gap-x-2">
              <NButton
                  size="tiny"
                  :type="orderType === 'commission' ? 'primary' : 'default'"
                  @click="orderType = 'commission'"
              >{{ $t('trading.entrustOrder') }}
              </NButton>
              <NButton size="tiny" :type="orderType === 'newest' ? 'primary' : 'default'" @click="orderType = 'newest'">
                {{ $t('trading.latestDeal') }}
              </NButton>
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

              <!-- 卖出列表（asks） -->
              <div v-if="showSell" class="flex-1 text-red-500 space-y-2">
                <div class="flex text-xs text-slate-400 mt-2">
                  <div class="flex-1">{{ $t('trading.priceUSDT') }}</div>
                  <div class="flex-1">{{ $t('trading.quantity') }}</div>
                  <div class="hidden lg:block flex-1 text-right">{{ $t('trading.total') }}</div>
                </div>
                <div
                    v-for="(ask, index) in showBuy ? coinBook15List.asks.slice(0, 10) : coinBook15List.asks.slice(0, 26)"
                    :key="`ask-${index}`"
                    class="flex text-xs text-red-500 relative"
                    @click="handlePriceClick(parseFloat(ask[0]))"
                >
                  <div class="flex-1 z-10">{{ parseFloat(ask[0]) }}</div>
                  <div class="flex-1 z-10">{{ parseFloat(ask[1]) }}</div>
                  <div class="hidden lg:block flex-1 z-10 text-right">{{ ask[2] }}</div>
                  <!-- 显示累加总数 -->
                  <div class="absolute -top-0.5 -bottom-0.5 right-0 bg-red-200" :style="{ width: `${ask[3]}%` }"></div>
                </div>
              </div>

              <!-- 当前价格 -->
              <div class="flex items-center">
                <div
                    class="flex-1 text-sm lg:text-4xl font-bold"
                    :style="{ color: selectedCoin?.lastPrice < selectedCoin?.markPrice ? '#ef4444' : '#5ac820' }"
                    @click="handlePriceClick(selectedCoin?.lastPrice)"
                >
                  {{ selectedCoin?.lastPrice }}
                </div>
                <div
                    class="flex-1 text-xs lg:text-xl"
                    @click="handlePriceClick(selectedCoin?.markPrice)"
                >
                  ${{ selectedCoin?.markPrice }}
                </div>
              </div>

              <!-- 买入列表（bids） -->
              <div v-if="showBuy" class="flex-1 space-y-2">
                <div
                    v-for="(bid, index) in showSell ? coinBook15List.bids.slice(0, 10) : coinBook15List.bids.slice(0, 26)"
                    :key="`bid-${index}`"
                    class="flex text-xs text-green-500 relative"
                    @click="handlePriceClick(parseFloat(bid[0]))"
                >
                  <div class="flex-1 z-10">{{ parseFloat(bid[0]) }}</div>
                  <div class="flex-1 z-10">{{ parseFloat(bid[1]) }}</div>
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
                <div class="text-green-500 border border-green-500 size-6 text-center leading-6">{{ $t('trading.buyTag') }}</div>
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
                <div class="text-rose-500 border border-rose-500 size-6 text-center leading-6">{{ $t('trading.sellTag') }}</div>
              </div>
            </template>

            <div v-else class="h-[530px] lg:h-[650px] overflow-hidden">
              <!-- 表头 -->
              <div class="flex text-xs text-slate-400 mt-2">
                <div class="flex-1">{{ $t('trading.priceUSDT') }}</div>
                <div class="flex-1">{{ $t('trading.quantity') }}</div>
                <div class="flex-1 hidden lg:block">{{ $t('trading.time') }}</div>
              </div>

              <!-- 显示时间最新的 30 条交易记录 -->
              <div v-for="(trade, index) in tradeList" :key="index" class="flex gap-y-2 p-1 text-xs">
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
                  {{ new Date(parseInt(trade.ts)).toLocaleTimeString('en-US', {hour12: false}) }}
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
          <NTabPane name="position" :tab="positionTabText">
            <div style="max-height: 400px; overflow-y: auto">
              <NDataTable size="small" :columns="positionTableColumns" :data="positionData" :bordered="false"/>
            </div>
          </NTabPane>

          <NTabPane :name="'commission'" :tab="commissionTabText">
            <div style="max-height: 400px; overflow-y: auto">
              <NDataTable size="small" :columns="commissionTableColumns" :data="commissionData" :bordered="false"/>
            </div>
          </NTabPane>

          <NTabPane name="positionRecord" :tab="positionRecordTabText">
            <div style="max-height: 400px; overflow-y: auto">
              <NDataTable
                  size="small"
                  :columns="positionRecordTableColumns"
                  :data="positionRecordData"
                  :bordered="false"
              />
            </div>
          </NTabPane>

          <NTabPane :name="'commissionRecord'" :tab="commissionRecordTabText">
            <div style="max-height: 400px; overflow-y: auto">
              <NDataTable
                  size="small"
                  :columns="commissionRecordTableColumns"
                  :data="filledOrdersData"
                  :bordered="false"
              />
            </div>
          </NTabPane>
        </NTabs>
      </div>
    </div>
    <OptionCard class="hidden lg:block" @orderSuccess="fetchLiveOrders"/>
  </div>

  <NModal v-model:show="positionModal">
    <div class="bg-white rounded-md w-full lg:w-[600px] p-4 space-y-4">
      <div class="flex items-center justify-between">
        <div class="font-bold text-xl">{{ $t('trading.closePosition') }}</div>
        <img class="size-4" src="/close.png" @click="positionModal = false"/>
      </div>
      <div class="text-xl font-bold">{{ positionModalData.symbol }}</div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.direction') }}</div>
        <div class="font-bold">{{ positionModalData.direction }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.marginMode') }}</div>
        <div class="font-bold">{{ positionModalData.marginMode }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.leverage') }}</div>
        <div class="font-bold">{{ positionModalData.leverage }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.currentPrice') }}</div>
        <div class="font-bold">{{ positionOperationCoin?.lastPrice || 'N/A' }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.openPrice') }}</div>
        <div class="font-bold">{{ positionModalData.openPrice }}</div>
      </div>
      <div class="flex items-center justify-between text-sm gap-x-4">
        <div class="text-slate-500 w-24">{{ $t('trading.price') }}</div>
        <NInput
            v-if="isLimitPrice"
            style="flex: 1"
            v-model:value="inputPrice"
            :placeholder="t('trading.enterPrice')"
            @input="handleInput"
            :maxlength="20"
        />
        <NInput
            v-else
            style="flex: 1"
            placeholder="{{ $t('trading.marketPrice') }}" disabled
        />
        <NButton @click="togglePriceMode">{{ isLimitPrice ? $t('trading.limitPrice') : $t('trading.marketPrice') }}</NButton>
      </div>
      <div class="flex items-center justify-between text-sm gap-x-4">
        <div class="text-slate-500 w-24">{{ $t('trading.quantity') }}({{ positionModalData.symbol.replace('USDT', '') }})</div>
        <NInput
            style="flex: 1"
            v-model:value="calculatedQuantity"
            placeholder=""
            @input="handleQuantityInput"
        />
      </div>
      <NSlider v-model:value="quantityPercentage" :step="1" :show-tooltip="false" :format-tooltip="(v) => `${v}%`"/>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.available') }}</div>
        <div class="font-bold">{{ positionModalData.available }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.estimatedProfitLoss') }}</div>
        <div class="font-bold">{{ expectedProfitLoss }} USDT</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.closingFee') }}</div>
        <div class="font-bold">{{ estimatedClosingFee }} USDT</div>
      </div>
      <NButton type="primary" block @click="sendCloseOrder">{{ $t('trading.confirm') }}</NButton>
    </div>
  </NModal>

  <NModal v-model:show="profitModal">
    <div class="bg-white rounded-md w-full lg:w-[600px] p-4 space-y-4">
      <div class="flex items-center justify-between">
        <div class="font-bold text-xl">{{ $t('trading.takeProfitStopLoss') }}</div>
        <img class="size-4" src="/close.png" @click="profitModal = false"/>
      </div>
      <div class="text-xl font-bold">{{ profitModalData.symbol }}</div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.direction') }}</div>
        <div class="font-bold">{{ profitModalData.direction }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.marginMode') }}</div>
        <div class="font-bold">{{ profitModalData.marginMode }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.leverage') }}</div>
        <div class="font-bold">{{ profitModalData.leverage }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.currentPrice') }}</div>
        <div class="font-bold">{{ operationCoin?.lastPrice || 'N/A' }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.openPrice') }}</div>
        <div class="font-bold">{{ profitModalData.openPrice }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.markPrice') }}</div>
        <div class="font-bold">{{ operationCoin?.markPrice || 'N/A' }}</div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <div class="text-slate-500">{{ $t('trading.estimatedLiquidationPrice') }}</div>
        <div class="font-bold">{{ profitModalData.estimatedLiquidationPrice }} USDT</div>
      </div>
      <div class="flex items-center justify-between text-sm gap-x-4">
        <div class="text-slate-500 w-24">{{ $t('trading.stopProfit') }}(USDT)</div>
        <NInput style="flex: 1" :value="profitPrice" placeholder="{{ $t('trading.triggerPrice') }}"/>
      </div>
      <NSlider v-model:value="profitPercentage" :max="200" :step="1" :show-tooltip="false"
               :format-tooltip="(v) => `${v}%`"/>
      <div class="text-sm text-slate-500">
        {{ t('trading.closeAtBestPrice', {
        profitPrice,
        available: profitModalData.available,
        symbol: profitModalData.symbol.replace('USDT', ''),
        expectedProfit,
        profitPercentage
      }) }}
      </div>
      <div class="flex items-center justify-between text-sm gap-x-4">
        <div class="text-slate-500 w-24">{{ $t('trading.stopLoss') }}(USDT)</div>
        <NInput style="flex: 1" :value="lossPrice" placeholder="{{ $t('trading.triggerPrice') }}"/>
      </div>
      <NSlider v-model:value="lossPercentage" :max="100" :step="1" :show-tooltip="false"
               :format-tooltip="(v) => `${v}%`"/>
      <div class="text-sm text-slate-500">
        {{ t('trading.closeAtBestPriceWhenLoss', {
        lossPrice,
        available: profitModalData?.available || 0,
        symbol: profitModalData?.symbol?.replace('USDT', '') || '',
        expectedLoss,
        lossPercentage
      }) }}
      </div>
      <NButton type="primary" block @click="confirmStopProfitLoss">{{ $t('trading.confirm') }}</NButton>
    </div>
  </NModal>

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
