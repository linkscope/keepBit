<script setup>
import {
  NIcon,
  NButton,
  NPopconfirm,
  NPopselect,
  NTabs,
  NTabPane,
  NInput,
  NSlider,
  NModal,
  NRadioGroup,
  NRadio,
  NSelect,
  NInputNumber,
  NDataTable,
} from 'naive-ui'
import { Star16Regular, Star16Filled, CaretDown16Filled } from '@vicons/fluent'
import { ref, onMounted } from 'vue'
import initTickerTape from '@/utils/initTickerTape.js'
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

const orderType = ref('commission')
const showBuy = ref(true)
const showSell = ref(true)
const optionType = ref('open')
const factor = ref(75)
const factorOptions = ref([
  {
    label: '1x',
    value: 1,
  },
  {
    label: '2x',
    value: 2,
  },
  {
    label: '3x',
    value: 3,
  },
  {
    label: '5x',
    value: 5,
  },
  {
    label: '10x',
    value: 10,
  },
  {
    label: '20x',
    value: 20,
  },
  {
    label: '30x',
    value: 30,
  },
  {
    label: '50x',
    value: 50,
  },
  {
    label: '75x',
    value: 75,
  },
  {
    label: '100x',
    value: 100,
  },
])
const commissionNum = ref('')
const chargeModal = ref(false)
const chargeType = ref('shift')
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
  {
    title: '合约1',
    key: '合约1',
    width: 100,
  },
  {
    title: '类型',
    key: '类型',
    width: 100,
  },
  {
    title: '杠杆',
    key: '杠杆',
    width: 100,
  },
  {
    title: '方向',
    key: '方向',
    width: 100,
  },
  {
    title: '委托数量',
    key: '委托数量',
    width: 100,
  },
  {
    title: '已成交数量',
    key: '已成交数量',
    width: 100,
  },
  {
    title: '委托价格',
    key: '委托价格',
    width: 100,
  },
  {
    title: '创建时间',
    key: '创建时间',
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
const positionRecordTableColumns = ref([
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
    title: '持仓均价',
    key: '持仓均价',
    width: 100,
  },
  {
    title: '累计开仓数量',
    key: '累计开仓数量',
    width: 100,
  },
  {
    title: '已实现盈亏',
    key: '已实现盈亏',
    width: 100,
  },
  {
    title: '净盈亏',
    key: '净盈亏',
    width: 100,
  },
  {
    title: '累计手续费',
    key: '累计手续费',
    width: 100,
  },
  {
    title: '累计资金费用',
    key: '累计资金费用',
    width: 100,
  },
  {
    title: '开仓时间',
    key: '开仓时间',
    width: 100,
  },
  {
    title: '平仓时间',
    key: '平仓时间',
    width: 100,
  },
])
const commissionRecordTableColumns = ref([
  {
    title: '合约',
    key: '合约',
    width: 100,
  },
  {
    title: '订单类型',
    key: '订单类型',
    width: 100,
  },
  {
    title: '开单方向',
    key: '开单方向',
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
    title: '订单状态',
    key: '订单状态',
    width: 100,
  },
  {
    title: '成交均价',
    key: '成交均价',
    width: 100,
  },
  {
    title: '成交数量',
    key: '成交数量',
    width: 100,
  },
  {
    title: '委托价格',
    key: '委托价格',
    width: 100,
  },
  {
    title: '委托数量',
    key: '委托数量',
    width: 100,
  },
  {
    title: '创建时间',
    key: '创建时间',
    width: 100,
  },
])

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
  <div class="lg:flex">
    <div class="flex-1">
      <div class="flex flex-col lg:flex-row items-center lg:h-[70px] bg-white">
        <div class="flex items-center w-full lg:w-auto">
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
              class="bg-white absolute top-[70px] w-[250px] lg:w-[300px] z-10 shadow-md"
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
        </div>
        <div class="grid grid-cols-3 gap-2 lg:flex-1 lg:flex items-center">
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
    <div class="flex flex-row-reverse lg:flex-row py-2 relative">
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
          <div v-if="showSell" class="flex-1 text-red-500 space-y-2">
            <div v-for="i of 10" :key="10" class="flex text-xs text-red-500 relative">
              <div class="flex-1 z-10">82999</div>
              <div class="flex-1 z-10">0.62</div>
              <div class="hidden lg:block flex-1 z-10 text-right">8.90</div>

              <div class="absolute -top-0.5 -bottom-0.5 right-0 bg-red-200" :style="{ width: `${i * 10}%` }"></div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-1 text-red-500 text-sm lg:text-4xl font-bold">82154</div>
            <div class="flex-1 text-xs lg:text-xl">$82226.3</div>
          </div>
          <div class="flex-1 space-y-2">
            <template v-if="showBuy">
              <div v-for="i of 10" :key="10" class="flex text-xs text-green-500 relative">
                <div class="flex-1 z-10">82999</div>
                <div class="flex-1 z-10">0.62</div>
                <div class="hidden lg:block flex-1 z-10 text-right">8.90</div>

                <div class="absolute -top-0.5 -bottom-0.5 right-0 bg-green-200" :style="{ width: `${i * 10}%` }"></div>
              </div>
            </template>
          </div>
          <div class="h-[60px] lg:hidden"></div>
          <div class="lg:px-2 flex gap-x-2 mt-4 lg:mt-0 absolute lg:static left-2 bottom-2 right-2">
            <div class="text-green-500 border border-green-500 size-6 text-center leading-6">B</div>
            <div class="flex-1">
              <div
                class="flex h-[20px]"
                :style="{
                  background: 'linear-gradient(120deg, rgb(187 247 208) 49%, #fff 49%, rgb(244 63 94) 50%)',
                }"
              />
              <div class="flex items-center justify-between">
                <div class="text-green-500">50%</div>
                <div class="text-rose-500">50%</div>
              </div>
            </div>
            <div class="text-rose-500 border border-rose-500 size-6 text-center leading-6">S</div>
          </div>
        </template>
        <template v-else>
          <div class="flex text-xs text-slate-400 mt-2">
            <div class="flex-1">价格(USDT)</div>
            <div class="flex-1">数量</div>
            <div class="flex-1">时间</div>
          </div>
          <div v-for="i of 20" :key="i" class="flex gap-y-2 p-1 text-xs">
            <div class="flex-1 text-red-500">8222.2</div>
            <div class="flex-1">0.0002232323</div>
            <div class="flex-1">20:53:22</div>
          </div>
        </template>
      </div>
      <div class="flex-[2] lg:flex-auto lg:w-[300px] p-4 space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <NButton :type="optionType === 'open' ? 'primary' : 'default'" @click="optionType = 'open'">开仓</NButton>
          <NButton :type="optionType === 'close' ? 'primary' : 'default'" @click="optionType = 'close'">平仓</NButton>
          <NPopconfirm @positive-click="optionType = 'all'">
            <template #trigger>
              <NButton :type="optionType === 'all' ? 'primary' : 'default'"> 全仓</NButton>
            </template>
            全仓模式：账户内的所有可用资金承担风险，以减少爆仓风险
          </NPopconfirm>
          <NPopselect v-model:value="factor" :options="factorOptions" trigger="click">
            <NButton :type="optionType === 'factor' ? 'primary' : 'default'" @click="optionType = 'factor'">{{
              factor
            }}</NButton>
          </NPopselect>
        </div>
        <NTabs
          default-value="limit"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <NTabPane name="limit" tab="限价单">
            <div class="text-xs space-y-4">
              <div class="font-bold">委托价格(USDT)</div>
              <NInput size="small" placeholder="输入委托价格" />
              <div class="font-bold">委托数量</div>
              <NInput v-model:value="commissionNum" size="small" placeholder="输入委托数量" />
              <div class="font-bold">≈ 0.00 USDT</div>
              <NSlider
                v-model:value="commissionNum"
                :marks="{
                  0: '0%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%',
                }"
                :step="1"
                :format-tooltip="(v) => `${v}%`"
              />
              <div class="flex gap-x-2 pt-4">
                <NButton class="flex-1" type="primary">{{ optionType === 'close' ? '开多' : '平空' }}</NButton>
                <NButton class="flex-1 bg-rose-500 text-white">{{ optionType === 'close' ? '开空' : '平多' }}</NButton>
              </div>
            </div>
          </NTabPane>
          <NTabPane name="market" tab="市价单">
            <div class="font-bold">委托价格(USDT)</div>
            <NInput size="small" placeholder="输入市价" />
            <div class="font-bold">委托数量</div>
            <NInput v-model:value="commissionNum" size="small" placeholder="输入委托数量" />
            <div class="font-bold">≈ 0.00 USDT</div>
            <NSlider
              v-model:value="commissionNum"
              :marks="{
                0: '0%',
                25: '25%',
                50: '50%',
                75: '75%',
                100: '100%',
              }"
              :step="1"
              :format-tooltip="(v) => `${v}%`"
            />
            <div class="flex gap-x-2 pt-4">
              <NButton class="flex-1" type="primary">{{ optionType === 'close' ? '开多' : '平空' }}</NButton>
              <NButton class="flex-1 bg-rose-500 text-white">{{ optionType === 'close' ? '开空' : '平多' }}</NButton>
            </div>
          </NTabPane>
        </NTabs>
        <div class="p-4 grid grid-cols-2 bg-slate-100 rounded-xl gap-2 text-xs">
          <template v-if="optionType === 'close'">
            <div>
              <div class="text-slate-400">空仓持仓</div>
              <div>0.000 BCT</div>
            </div>
            <div>
              <div class="text-slate-400">多仓持仓</div>
              <div>0.000 BCT</div>
            </div>
            <div>
              <div class="text-slate-400">可平量</div>
              <div>0.000 BCT</div>
            </div>
          </template>
          <template v-else>
            <div>
              <div class="text-slate-400">可多开</div>
              <div>0.000 BCT</div>
            </div>
            <div>
              <div class="text-slate-400">可开空</div>
              <div>0.000 BCT</div>
            </div>
            <div>
              <div class="text-slate-400">保证金</div>
              <div>0.000 BCT</div>
            </div>
            <div>
              <div class="text-slate-400">可多开</div>
              <div>0.000 BCT</div>
            </div>
            <div>
              <div class="text-slate-400">可多开</div>
              <div>0.000 BCT</div>
            </div>
            <div class="flex items-center" @click="chargeModal = true">充值</div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-slate-200 py-4">
    <div class="lg:w-[1280px] rounded-xl bg-white p-4 mx-4 lg:mx-auto">
      <NTabs
        default-value="position"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <NTabPane name="position" tab="仓位(0)">
          <NDataTable :columns="positionTableColumns" :data="[]" :bordered-false="false" />
        </NTabPane>
        <NTabPane name="commission" tab="委托(0)">
          <NDataTable :columns="commissionTableColumns" :data="[]" :bordered-false="false" />
        </NTabPane>
        <NTabPane name="positionRecord" tab="历史仓位(0)">
          <NDataTable :columns="positionRecordTableColumns" :data="[]" :bordered-false="false" />
        </NTabPane>
        <NTabPane name="commissionRecord" tab="历史委托(0)">
          <NDataTable :columns="commissionRecordTableColumns" :data="[]" :bordered-false="false" />
        </NTabPane>
      </NTabs>
    </div>
  </div>

  <NModal v-model:show="chargeModal">
    <div class="bg-white rounded-md w-full lg:w-[600px]">
      <div class="p-4 flex items-center justify-between">
        <div class="font-bold">选择充币方式</div>
        <img class="size-4" src="/close.png" @click="chargeModal = false" />
      </div>
      <div class="p-4 space-y-4">
        <NRadioGroup v-model:value="chargeType">
          <NRadio value="shift">从链上钱包或交易所转入数字货币</NRadio>
          <NRadio value="account">在资金账户和交易账户之间转移数字货币</NRadio>
        </NRadioGroup>
        <template v-if="chargeType === 'shift'">
          <div class="flex items-center gap-x-4">
            <img class="size-6" src="/usdt.png" />
            USDT
          </div>
          <NSelect placeholder="选择网络" :options="[{ label: 'USDT-TRC20', value: 'USDT' }]" />
          <div>提示：选择与提币平台一致的网络进行充值,否则您将会遗失这笔资金.</div>
          <img class="size-32" src="/download_qrcode.png" />
          <div>充币地址：TQBwB9sa7iUzS28M82WZvDsVf5NuMaexfa</div>
          <div>充值至：资金账户</div>
          <div class="text-slate-500">您只能向此地址充值入USDT-TRC20, 充值入其他资产将无法退回。</div>
        </template>
        <template v-else>
          <div>从：资金账户</div>
          <div>到：合约账户</div>
          <div>资产：USDT</div>
          <NInputNumber placeholder="数量" clearable />
        </template>
        <div class="flex justify-end">
          <NButton type="primary">确定</NButton>
        </div>
      </div>
    </div>
  </NModal>
</template>
