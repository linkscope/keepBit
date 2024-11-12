import { images } from '@/views/home/model.js'

export default function useCryptoWS() {
  const coinList = ref([])
  const coinSpotList = ref([])
  const coinBook15List = ref([])
  const book15Data = ref({}); // 将 book15Data 定义为响应式 ref
  const tradeData = ref({}); // 将 book15Data 定义为响应式 ref
  const sortedCoinList = computed(() => {
    const sortedList = coinList.value.slice().sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    return {
      top: sortedList.slice(0, 3),
      bottom: sortedList.slice(-3),
      list: sortedList,
    }
  })

  const sortedByLastPriceCoinList = computed(() => {
    const sortedByLastPriceList = coinList.value.slice().sort((a, b) => b.lastPrice - a.lastPrice)
    return {
      topThree: sortedByLastPriceList.slice(0, 3),
      top: sortedByLastPriceList.slice(0, 7),
      bottom: sortedByLastPriceList.slice(-3),
      list: sortedByLastPriceList,
    }
  })

  const sortedCoinSpotList = computed(() => {
    const sortedSpotList = coinSpotList.value.slice().sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    return {
      top: sortedSpotList.slice(0, 3),
      bottom: sortedSpotList.slice(-3),
      list: sortedSpotList,
    }
  })

  const sortedByLastPriceCoinSpotList = computed(() => {
    const sortedByLastPriceSpotList = coinSpotList.value.slice().sort((a, b) => b.lastPrice - a.lastPrice)
    return {
      top: sortedByLastPriceSpotList.slice(0, 7),
      bottom: sortedByLastPriceSpotList.slice(-3),
      list: sortedByLastPriceSpotList,
    }
  })

  let socket = null
  let heartBeatInterval = 0
  const reconnectInterval = 5000 // 重连间隔

  // 心跳机制
  const startHeartbeat = () => {
    clearInterval(heartBeatInterval)
    heartBeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ op: 'ping' }))
        console.log('发送心跳包')
      }
    }, 20000)
  }

  // 处理文档可见性变化
  const visibilityListener = () => {
    if (document.visibilityState === 'visible') {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ op: 'ping' }))
      }
      startHeartbeat()
    }
  }

  // WebSocket 连接断开后尝试重连
  const connectWebSocket = () => {
    socket = new WebSocket('wss://ws.keepbit.top/v2/ws/public')

    socket.onopen = () => {
      console.log('WebSocket 连接已建立')
      socket.send(
        JSON.stringify({
          op: 'subscribe',
          args: [
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'BTCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'ETHUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'LTCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'DOGEUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'SOLUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'TRXUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'PEPEUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'XRPUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'ADAUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'BCHUSDT' },
            { instType: 'USDT-FUTURES', channel: 'ticker', instId: 'USDCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'BTCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'ETHUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'LTCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'DOGEUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'SOLUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'TRXUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'PEPEUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'XRPUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'ADAUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'BCHUSDT' },
            { instType: 'USDT-FUTURES', channel: 'books15', instId: 'USDCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'BTCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'ETHUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'LTCUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'DOGEUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'SOLUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'TRXUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'PEPEUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'XRPUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'ADAUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'BCHUSDT' },
            { instType: 'USDT-FUTURES', channel: 'trade', instId: 'USDCUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'BTCUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'ETHUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'LTCUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'DOGEUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'SOLUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'TRXUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'PEPEUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'XRPUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'ADAUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'BCHUSDT' },
            { instType: 'SPOT', channel: 'ticker', instId: 'USDCUSDT' },
          ],
        }),
      )
      startHeartbeat()
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data && data.arg && data.data && data.arg.channel === "ticker") {
        const ticker = data.data[0];
        const instId = data.arg.instId;
        const instType = data.arg.instType;
        const change24h = parseFloat(ticker.change24h);
        const priceChangePercent = (change24h * 100).toFixed(2);
        const coin = {
          instId,
          instType,
          lastPrice: parseFloat(ticker.lastPr),
          bidPrice: parseFloat(ticker.bidPr),
          askPrice: parseFloat(ticker.askPr),
          bidSize: parseFloat(ticker.bidSz),
          askSize: parseFloat(ticker.askSz),
          open24h: parseFloat(ticker.open24h),
          high24h: parseFloat(ticker.high24h),
          low24h: parseFloat(ticker.low24h),
          change24h,
          priceChangePercent: parseFloat(priceChangePercent),
          fundingRate: parseFloat(ticker.fundingRate),
          nextFundingTime: parseInt(ticker.nextFundingTime, 10),
          markPrice: parseFloat(ticker.markPrice),
          indexPrice: parseFloat(ticker.indexPrice),
          holdingAmount: parseFloat(ticker.holdingAmount),
          baseVolume: parseFloat(ticker.baseVolume),
          quoteVolume: parseFloat(ticker.quoteVolume),
          openUtc: parseFloat(ticker.openUtc),
          symbolType: parseInt(ticker.symbolType, 10),
          symbol: ticker.symbol,
          deliveryPrice: parseFloat(ticker.deliveryPrice),
          timestamp: parseInt(ticker.ts, 10),
          image: images[instId] || 'img/default.png'
        };
        if (instType === 'SPOT') {
          const findIndex = coinSpotList.value.findIndex((i) => i.instId === instId)
          if (~findIndex) {
            coinSpotList.value[findIndex] = coin
          } else {
            coinSpotList.value.push(coin)
          }
        } else if (instType === 'USDT-FUTURES') {
          const findIndex = coinList.value.findIndex((i) => i.instId === instId)
          if (~findIndex) {
            coinList.value[findIndex] = coin
          } else {
            coinList.value.push(coin)
          }
        }
      }
      else if (data && data.arg && data.data && data.arg.channel === "books15"){
        book15Data.value = data; // 更新 book15Data 的值
      }else if (data && data.arg && data.data && data.arg.channel === "trade"){
        tradeData.value = data; // 更新 book15Data 的值
      }
    }

    socket.onclose = (event) => {
      console.log('WebSocket 连接关闭', event)
      setTimeout(connectWebSocket, reconnectInterval) // 尝试重连
    }

    socket.onerror = (error) => {
      console.error('WebSocket 错误', error)
    }
  }

  onMounted(() => {
    connectWebSocket()
    document.addEventListener('visibilitychange', visibilityListener)
  })

  onUnmounted(() => {
    clearInterval(heartBeatInterval)
    socket.close() // 关闭连接
    document.removeEventListener('visibilitychange', visibilityListener)
  })

  return {
    coinList,
    sortedCoinList,
    coinSpotList,
    sortedCoinSpotList,
    sortedByLastPriceCoinList,
    sortedByLastPriceCoinSpotList,
    book15Data,
    tradeData
  }
}
