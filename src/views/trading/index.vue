<script setup>
import initTickerTape from '@/utils/initTickerTape.js'

const tickerTapRef = useTemplateRef('tickerTapRef')
const tradingViewRef = useTemplateRef('tradingViewRef')

onMounted(() => {
  tickerTapRef.value.appendChild(initTickerTape())

  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/tv.js'
  script.async = true
  script.textContent = `
    new TradingView.widget({
      "width": 1146, // 宽度可以根据需求调整
      "height": 595, // 高度可以根据需求调整
      "symbol": "BITGET:BTCUSDTPERP", // Bitget的BTC合约标的
      "interval": "1", // 默认显示1分钟周期
      "timezone": "Asia/Shanghai",
      "theme": "light", // 深色主题
      "style": "1", // K线图风格
      "locale": "zh_CN", // 中文界面
      "toolbar_bg": "#f1f3f6", // 工具栏背景色
      "enable_publishing": false,
      "withdateranges": false, // 取消独立日期选择
      "hide_side_toolbar": false, // 显示左侧工具栏
      "hide_top_toolbar": false, // 显示顶部工具栏
      "allow_symbol_change": false, // 禁止商品代码搜索
      "studies": ["Volume@tv-basicstudies"], // 添加成交量、均线和RSI指标
      "container_id": "tradingview_12345", // 组件容器ID
      "overrides": {
        "volumePaneSize": "medium", // 设置成交量图表大小
        "paneProperties.vertGridProperties.color": "#363c4e", // 垂直网格线颜色
        "paneProperties.horzGridProperties.color": "#363c4e", // 水平网格线颜色
        "scalesProperties.textColor": "#AAA", // 文字颜色
        "mainSeriesProperties.candleStyle.upColor": "#26a69a", // 上涨蜡烛颜色
        "mainSeriesProperties.candleStyle.downColor": "#ef5350", // 下跌蜡烛颜色
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a", // 上涨蜡烛边框颜色
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350", // 下跌蜡烛边框颜色
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a", // 上涨蜡烛影线颜色
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350", // 下跌蜡烛影线颜色
        "mainSeriesProperties.showPriceLine": true, // 显示价格线
        "mainSeriesProperties.priceLineColor": "#ff0000", // 价格线颜色
        "mainSeriesProperties.priceLineWidth": 1, // 价格线宽度
        "priceScaleProperties.percentage": true, // 显示百分比变化
        "priceScaleProperties.autoScale": true // 自动缩放价格轴
      },
      "custom_css_url": "", // 可选：自定义CSS样式URL
    })
  `
  tradingViewRef.value.appendChild(script)
})
</script>

<template>
  <div ref="tickerTapRef" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget" />
  </div>
  <div
    ref="tradingViewRef"
    class="tradingview-widget-container"
    style="padding-top: 0px; margin-left: -780px; border-radius: 15px; overflow: hidden"
  >
    <div id="tradingview_12345"></div>
  </div>
</template>
