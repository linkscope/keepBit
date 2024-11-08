<script setup>
import { ref, onMounted } from 'vue'
import initTickerTape from '@/utils/initTickerTape.js'

const tickerTapRef = ref(null)
const tradingViewRef = ref(null)

onMounted(() => {
  if (tickerTapRef.value) {
    tickerTapRef.value.appendChild(initTickerTape())
  }

  if (tradingViewRef.value) {
    // 创建 TradingView 的小部件
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true

    script.onload = () => {
      new TradingView.widget({
        width: 1146,
        height: 595,
        symbol: "BITGET:BTCUSDTPERP",
        interval: "1",
        timezone: "Asia/Shanghai",
        theme: "light",
        style: "1",
        locale: "zh_CN",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        withdateranges: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        allow_symbol_change: false,
        studies: ["Volume@tv-basicstudies"],
        container_id: "tradingview_12345",
        overrides: {
          volumePaneSize: "medium",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "scalesProperties.textColor": "#AAA",
          "mainSeriesProperties.candleStyle.upColor": "#26a69a",
          "mainSeriesProperties.candleStyle.downColor": "#ef5350",
          "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
          "mainSeriesProperties.showPriceLine": true,
          "mainSeriesProperties.priceLineColor": "#ff0000",
          "mainSeriesProperties.priceLineWidth": 1,
          "priceScaleProperties.percentage": true,
          "priceScaleProperties.autoScale": true
        }
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
  <div
      ref="tradingViewRef"
      class="tradingview-widget-container"
      style="padding-top: 0px; margin-left: -780px; border-radius: 15px; overflow: hidden"
  >
    <div id="tradingview_12345"></div>
  </div>
</template>
