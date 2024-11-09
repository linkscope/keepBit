import { images } from '@/views/home/model.js'

export default function useCryptoWS() {
  const coinList = ref([])
  const coinSpotList = ref([])
  const sortedCoinList = computed(() => {
    const sortedList = coinList.value.sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    return {
      top: sortedList.slice(0, 3),
      bottom: sortedList.slice(-3),
      list: sortedList,
    }
  })
  const sortedByLastPriceCoinList = computed(() => {
    const sortedByLastPriceList = coinList.value.sort((a, b) => b.lastPrice - a.lastPrice)
    return {
      topThree: sortedByLastPriceList.slice(0, 3),
      top: sortedByLastPriceList.slice(0, 7),
      bottom: sortedByLastPriceList.slice(-3),
      list: sortedByLastPriceList,
    }
  })
  const sortedCoinSpotList = computed(() => {
    const sortedSpotList = coinSpotList.value.sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    return {
      top: sortedSpotList.slice(0, 3),
      bottom: sortedSpotList.slice(-3),
      list: sortedSpotList,
    }
  })
  const sortedByLastPriceCoinSpotList = computed(() => {
    const sortedByLastPriceSpotList = coinSpotList.value.sort((a, b) => b.lastPrice - a.lastPrice)
    return {
      top: sortedByLastPriceSpotList.slice(0, 7),
      bottom: sortedByLastPriceSpotList.slice(-3),
      list: sortedByLastPriceSpotList,
    }
  })
  let socket = null
  let heartBeatInterval = 0
  const startHeartbeat = () => {
    clearInterval(heartBeatInterval)
    heartBeatInterval = setInterval(function () {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ op: 'ping' }))
        console.log('发送心跳包')
      }
    }, 20000)
  }
  const visibilityListener = () => {
    if (document.visibilityState === 'visible') {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ op: 'ping' }))
      }
      startHeartbeat()
    }
  }

  onMounted(() => {
    socket = new WebSocket('wss://ws.keepbit.top/v2/ws/public')
    socket.onopen = () => {
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
            { instType: 'SPOT', channel: 'ticker', instId: 'USDCUSDT' }
          ],
        }),
      )
      startHeartbeat()
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data && data.arg && data.data) {
        const ticker = data.data[0]
        const instId = data.arg.instId
        const instType = data.arg.instType
        const change24h = parseFloat(ticker.change24h)
        const priceChangePercent = (change24h * 100).toFixed(2)
        if (instType === "SPOT") {
          const coin = {
            instId,
            lastPrice: parseFloat(ticker.lastPr),
            priceChangePercent: parseFloat(priceChangePercent),
            volume: parseFloat(ticker.baseVolume),
            change24h,
            image: images[instId] || 'img/default.png',
          }
          const findIndex = coinSpotList.value.findIndex((i) => i.instId === instId)
          if (~findIndex) {
            coinSpotList.value[findIndex] = coin
          } else {
            coinSpotList.value.push(coin)
          }
        }else if(instType === "USDT-FUTURES") {
          const coin = {
            instId,
            lastPrice: parseFloat(ticker.lastPr),
            priceChangePercent: parseFloat(priceChangePercent),
            volume: parseFloat(ticker.baseVolume),
            change24h,
            image: images[instId] || 'img/default.png',
          }

          const findIndex = coinList.value.findIndex((i) => i.instId === instId)
          if (~findIndex) {
            coinList.value[findIndex] = coin
          } else {
            coinList.value.push(coin)
          }
        }
      }
    }

    document.addEventListener('visibilitychange', visibilityListener)
  })
  onUnmounted(() => {
    clearInterval(heartBeatInterval)
    document.removeEventListener('visibilitychange', visibilityListener)
  })

  return {
    coinList,
    sortedCoinList,
    coinSpotList,
    sortedCoinSpotList,
    sortedByLastPriceCoinList,
    sortedByLastPriceCoinSpotList
  }
}
