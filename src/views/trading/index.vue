<script setup>
import { NIcon } from 'naive-ui'
import { Star16Regular, Star16Filled, CaretDown16Filled } from '@vicons/fluent'
import { ref, onMounted } from 'vue'
import initTickerTape from '@/utils/initTickerTape.js'
import CoinLabel from './components/CoinLabel.vue'
import useCryptoWS from '@/hooks/useCryptoWS.js'

const { coinSpotList } = useCryptoWS()

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

watch(
  coinSpotList,
  (val) => {
    if (val.length && !selectedCoin.value) {
      selectedCoin.value = val.find((i) => i.instId === 'BTCUSDT')
    }
  },
  {
    deep: true,
  },
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
})
</script>

<template>
  <div ref="tickerTapRef" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
  </div>
  <div class="bg-slate-200">
    <div class="lg:w-[1280px] mx-auto flex">
      <div class="flex-1">
        <div class="flex items-center h-[70px] bg-white">
          <div class="w-24 flex items-center justify-center">
            <NIcon class="text-lg text-yellow-300">
              <!--              <Star16Regular />-->
              <Star16Filled />
            </NIcon>
          </div>
          <div class="relative">
            <div
              class="h-16 w-[200px] border border-slate-200 rounded-md flex items-center gap-x-2 px-2 box-border"
              @click="showSelect = !showSelect"
            >
              <img class="size-[40px]" :src="selectedCoin?.image" />
              <div class="flex-1">
                <div class="text-lg font-bold">{{ selectedCoin?.instId }}</div>
                <div class="text-xs text-slate-400">BitCoin</div>
              </div>
              <NIcon>
                <CaretDown16Filled />
              </NIcon>
            </div>
            <div
              v-show="showSelect"
              ref="selectOptionRef"
              class="bg-white absolute top-[70px] w-[300px] z-10 shadow-md"
            >
              <div
                class="px-2 py-1 flex items-center gap-x-2 hover:bg-slate-200"
                v-for="item of coinSpotList"
                :key="item.instId"
                @click="
                  () => {
                    selectedCoin = item
                    showSelect = false
                  }
                "
              >
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
          <div class="flex-1 flex">
            <div class="flex-1 text-center">
              <div
                class="text-2xl font-bold"
                :style="{
                  color: selectedCoin?.change24h > 0 ? '#5ac820' : 'red',
                }"
              >
                ${{ selectedCoin?.lastPrice.toFixed(1) }}
              </div>
              <div class="text-xs">≈ ${{ Math.round(selectedCoin?.lastPrice) }}</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-xs text-slate-400">24h涨跌幅</div>
              <div class="text-xs font-bold text-rose-500">-0.45%</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-xs text-slate-400">24h最高价</div>
              <div class="text-xs">78.27</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-xs text-slate-400">24h最低价</div>
              <div class="text-xs">73.54</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-xs text-slate-400">24h成交量</div>
              <div class="text-xs">148.73k</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-xs text-slate-400">24h成交额(USDT)</div>
              <div class="text-xs">11.42M</div>
            </div>
          </div>
        </div>
        <div ref="tradingViewRef" class="tradingview-widget-container">
          <div id="tradingview_12345"></div>
        </div>
      </div>
    </div>
  </div>
</template>
