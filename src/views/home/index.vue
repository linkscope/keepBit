<script setup>
import { NButton, NTabs, NTabPane, NIcon } from 'naive-ui'
import { ArrowDownload16Regular, Headphones20Regular, ArrowLeft16Regular } from '@vicons/fluent'
import Coin from './components/Coin.vue'
import useCryptoWS from '@/hooks/useCryptoWS'
import initTickerTape from '@/utils/initTickerTape.js'

const { t } = useI18n()
const tickerTapRef = useTemplateRef('tickerTapRef')
const { coinList, sortedCoinList, coinSpotList, sortedCoinSpotList } = useCryptoWS()
const showToolTip = ref(true)

const carouselRef = useTemplateRef('carouselRef')
let scrollInterval = 0

onMounted(() => {
  // 创建Ticker Tape组件
  const script = initTickerTape()
  tickerTapRef.value.appendChild(script)

  scrollInterval = setInterval(() => {
    // 判断是否滚动到底部
    if (carouselRef.value.scrollLeft + carouselRef.value.clientWidth >= carouselRef.value.scrollWidth) {
      carouselRef.value.scrollLeft = 0 // 重置到开头
    } else {
      carouselRef.value.scrollLeft += 1 // 每次向右滚动1px，可根据需求调整
    }
  }, 20)
})
onUnmounted(() => {
  clearInterval(scrollInterval)
})
</script>

<template>
  <div class="py-16 bg-black">
    <div class="lg:w-[1280px] mx-auto">
      <div class="flex flex-col-reverse gap-y-4 lg:gap-0 lg:flex-row items-center">
        <div class="lg:w-0 lg:flex-1 lg:z-10">
          <div class="text-white font-bold text-[36px] lg:text-[64px]">
            <div>{{ t('home.welcome[0]') }}</div>
            <div>{{ t('home.welcome[1]') }}</div>
            <div>{{ t('home.welcome[2]') }}</div>
          </div>
          <div class="text-slate-400 text-xl lg:text-4xl">
            <div>{{ t('home.subWelcome[0]') }}</div>
            <div>{{ t('home.subWelcome[1]') }}</div>
          </div>
          <div class="flex flex-col lg:flex-row items-center gap-8 my-16">
            <NButton class="w-60 h-14 rounded-2xl bg-[#76e43b] text-black">{{ t('register') }}</NButton>
            <NButton class="w-60 h-14 rounded-2xl bg-white text-black">{{ t('login') }}</NButton>
          </div>
        </div>
        <div class="lg:w-0 lg:flex-1 relative">
          <div class="hidden lg:block absolute -left-1/2 -top-1/2 translate-x-[30%] translate-y-[30%] w-[900px]">
            <img class="w-full" src="/home_hero_bg.png" />
          </div>
          <img
            class="block lg:hidden absolute -left-1/2 -top-1/2 translate-x-1/2 translate-y-1/2 w-full"
            src="/home_hero_bg.png"
          />
          <img class="w-full" src="/home_hero.png" />
        </div>
      </div>
      <div class="flex flex-col lg:flex-row gap-4">
        <img class="h-[260px]" src="/home_card_1.png" />
        <img class="h-[260px]" src="/home_card_2.png" />
        <img class="h-[260px]" src="/home_card_3.png" />
      </div>
    </div>
  </div>
  <div class="lg:w-[1280px] mx-auto my-8 space-y-16">
    <div ref="tickerTapRef" class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget" />
    </div>
    <div class="space-y-8">
      <div class="text-center lg:text-left text-[40px] font-bold">{{ t('home.hotCoinPrice') }}</div>
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="p-4 lg:p-0 lg:w-0 lg:flex-[2]">
          <NTabs
            default-value="stock"
            size="large"
            animated
            pane-wrapper-style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          >
            <NTabPane name="stock" :tab="t('home.hotStock')">
              <div class="space-y-4">
                <Coin v-for="item of coinSpotList.slice(0, -4)" :key="item.instId" :coin="item" showStock />
              </div>
            </NTabPane>
            <NTabPane name="treat" :tab="t('home.hotTreat')">
              <div class="space-y-4">
                <Coin v-for="item of coinList.slice(0, -4)" :key="item.instId" :coin="item" showStock />
              </div>
            </NTabPane>
          </NTabs>
        </div>
        <div class="p-4 space-y-4 lg:space-y-0 lg:p-0 lg:w-0 lg:flex-1">
          <div class="text-xl font-bold lg:h-[60px] lg:leading-[60px]">{{ t('home.riseRanking') }}</div>
          <div class="space-y-4">
            <Coin v-for="item of sortedCoinList.top" :key="item.instId" :coin="item" />
          </div>
          <div class="text-xl font-bold lg:h-[162px] lg:leading-[162px]">{{ t('home.fallRanking') }}</div>
          <div class="space-y-4">
            <Coin v-for="item of sortedCoinList.bottom" :key="item.instId" :coin="item" />
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-8">
      <div class="text-center lg:text-left text-[40px] font-bold">{{ t('home.tradingStrategy') }}</div>
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="p-4 lg:p-0 lg:w-0 lg:flex-[3]">
          <img class="w-full" src="/trading_strategy.png" />
        </div>
        <div class="p-4 lg:p-0 lg:w-0 lg:flex-[2] flex flex-col gap-y-4 justify-evenly">
          <div class="border-2 border-[#62e56d] rounded-2xl p-4 space-y-2 relative">
            <img class="absolute top-0 left-0 right-0 bottom-0" src="/trading_strategy_bg.png" />
            <div class="text-lg font-bold">{{ t('home.tradingStrategyDesc[0].title') }}</div>
            <div class="text-slate-400/80 text-sm">
              {{ t('home.tradingStrategyDesc[0].subtitle') }}
            </div>
          </div>
          <div class="border-2 border-[#62e56d] rounded-2xl p-4 space-y-2 relative">
            <img class="absolute top-0 left-0 right-0 bottom-0" src="/trading_strategy_bg.png" />
            <div class="text-lg font-bold">{{ t('home.tradingStrategyDesc[1].title') }}</div>
            <div class="text-slate-400/80 text-sm">
              {{ t('home.tradingStrategyDesc[1].subtitle') }}
            </div>
          </div>
          <div class="border-2 border-[#62e56d] rounded-2xl p-4 space-y-2 relative">
            <img class="absolute top-0 left-0 right-0 bottom-0" src="/trading_strategy_bg.png" />
            <div class="text-lg font-bold">{{ t('home.tradingStrategyDesc[2].title') }}</div>
            <div class="text-slate-400/80 text-sm">
              {{ t('home.tradingStrategyDesc[2].subtitle') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-100 py-16">
    <div class="lg:w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-32 px-4 lg:px-0">
      <img class="w-full md:size-[550px] object-cover" src="/guide.png" />
      <div class="w-full lg:w-0 lg:flex-1 space-y-6">
        <div class="text-[40px] font-bold">{{ t('home.guide.title') }}</div>
        <div class="text-xl text-slate-400">{{ t('home.guide.subtitle') }}</div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 py-8">
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              1
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[0].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[0].subtitle') }}</div>
          </div>
          <div class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 py-8">
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              2
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[1].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[1].subtitle') }}</div>
          </div>
          <div class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 py-8">
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              3
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[2].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[2].subtitle') }}</div>
          </div>
          <div class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 py-8">
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              4
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[3].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[3].subtitle') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="lg:w-[1280px] mx-auto px-4 lg:px-0 py-16 flex flex-col-reverse lg:flex-row justify-between gap-32">
    <div class="space-y-8 lg:w-[700px]">
      <div class="text-[40px] font-bold">{{ t('home.download.title') }}</div>
      <div class="relative bg-[#78e43f] p-8 rounded-3xl flex items-center gap-x-8 w-full">
        <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" />
        <div class="size-[100px] lg:size-[220px] rounded-3xl bg-white flex items-center justify-center z-10">
          <img class="size-[80px] lg:size-[200px]" src="/download_qrcode.png" />
        </div>
        <div class="flex-1 space-y-8">
          <div class="text-3xl font-bold">{{ t('home.download.scan') }}</div>
          <div class="text-[40px] font-bold">iOS & Android</div>
        </div>
      </div>
      <div class="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
        <a href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/apple_store.svg" alt="App Store Icon" />
            </div>
            <div class="text-2xl">App Store</div>
          </div>
        </a>
        <a href="https://www.apple.com/app-store/" target="_blank">
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/apple.svg" alt="Apple Icon" />
            </div>
            <div class="text-2xl">iOS</div>
          </div>
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.keepbitpro.android&referrer=google_play" target="_blank">
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/google.svg" alt="Google Play Icon" />
            </div>
            <div class="text-2xl">Google Play</div>
          </div>
        </a>
        <a href="./Keepbit_cn3.14.apk" target="_blank">
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/android.svg" alt="Android Icon" />
            </div>
            <div class="text-2xl">Android</div>
          </div>
        </a>

      </div>
      <div class="lg:hidden relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
        <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" />
        <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
          <NIcon class="text-[30px]">
            <ArrowDownload16Regular />
          </NIcon>
        </div>
        <div class="text-2xl">{{ t('home.download.tap') }}</div>
      </div>
    </div>
    <img class="w-full lg:w-auto lg:h-[700px]" src="/download.gif" />
  </div>
  <div ref="carouselRef" class="carousel my-32 flex px-8 gap-x-4 overflow-x-hidden">
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_1.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_2.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_3.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_4.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_5.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_5.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_6.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_7.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_8.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_9.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_10.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_11.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_12.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_13.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_14.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_15.png" />
    <img class="w-[300px] hover:scale-105 trasistion" src="/carousel_16.png" />
  </div>
  <div class="fixed z-99 right-0 lg:right-4 bottom-0 lg:bottom-4">
    <div class="flex flex-col gap-y-4 items-end">
      <a href="https://wa.me/+60176012341?text=Hello%20there!" target="_blank">
        <div class="bg-[#78e43f] p-3 flex items-center justify-center rounded-md">
          <NIcon class="text-[32px]">
            <Headphones20Regular />
          </NIcon>
        </div>
      </a>
      <div v-if="showToolTip" class="bg-[#78e43f] p-4 flex items-center gap-x-2 rounded-md">
        <img class="size-[40px]" src="/logo.png" />
        <div>
          <div class="font-bold text-xs">KeepBit</div>
          <div class="text-xs text-slate-600">{{ t('home.download.title') }}</div>
        </div>
        <a href="./Keepbit_cn3.3.0.apk" target="_blank">
          <div class="px-2 py-1 flex items-center gap-x-1 bg-black rounded-md">
            <img class="hidden lg:block size-7" src="/android_inset.png" alt="Android Store" />
            <span class="text-white">Android</span>
          </div>
        </a>
        <a href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
          <div class="px-2 py-1 flex items-center gap-x-1 bg-black rounded-md">
            <img class="hidden lg:block size-7" src="/apple_store_inset.png" alt="Apple Store" />
            <span class="text-white truncate">Apple Store</span>
          </div>
        </a>
        <img class="size-4" src="/close.png" @click="showToolTip = false" />
      </div>
      <div v-else class="bg-white p-3 flex items-center justify-center rounded-md" @click="showToolTip = true">
        <NIcon class="text-[32px]">
          <ArrowLeft16Regular />
        </NIcon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel::-webkit-scrollbar {
  display: none;
}
</style>
