import { images } from '@/views/home/model.js'

export default function useCryptoWS() {
  const coinList = ref([])
  const sortedCoinList = computed(() => {
    const sortedList = coinList.value.sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    return {
      top: sortedList.slice(0, 3),
      bottom: sortedList.slice(-3),
      list: sortedList,
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
        const change24h = parseFloat(ticker.change24h)
        const priceChangePercent = (change24h * 100).toFixed(2)
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

    document.addEventListener('visibilitychange', visibilityListener)
  })
  onUnmounted(() => {
    clearInterval(heartBeatInterval)
    document.removeEventListener('visibilitychange', visibilityListener)
  })

  return {
    coinList,
    sortedCoinList,
  }
}
