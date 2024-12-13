<script setup>
import { NButton, NTabs, NTabPane, NIcon } from 'naive-ui'
import { ArrowDownload16Regular, Headphones20Regular, ArrowLeft16Regular } from '@vicons/fluent'
import Coin from './components/Coin.vue'
import useCryptoWS from '@/hooks/useCryptoWS'
import initTickerTape from '@/utils/initTickerTape.js'
import axios from 'axios'

const { t } = useI18n()
const router = useRouter()
const currentTab = ref('stock')
const tickerTapRef = useTemplateRef('tickerTapRef')
const {
  coinList,
  sortedCoinList,
  coinSpotList,
  sortedCoinSpotList,
  sortedByLastPriceCoinList,
  sortedByLastPriceCoinSpotList,
} = useCryptoWS()
const showToolTip = ref(true)

const carouselRef = useTemplateRef('carouselRef')
let scrollInterval = 0

const navigateToArticle = (fileName) => {
  // 如果语言不是中文，在文件格式前添加 `_en`
  const storedLanguage = localStorage.getItem('keepBit_lang');
  if (storedLanguage !== 'zhCN') {
    const extensionIndex = fileName.lastIndexOf('.');
    if (extensionIndex !== -1) {
      // 在扩展名前插入 `_en`
      fileName = `${fileName.slice(0, extensionIndex)}_En${fileName.slice(extensionIndex)}`;
    }
  }

  // 跳转到 /article/howRecharge 页面并携带文件名参数
  router.push({
    path: '/article/howRecharge',
    query: {
      fileName, // 动态传递修改后的文件名
    },
  });
};
// 跳转处理函数
const goToPage = (link) => {
  // 跳转到目标页面
  if (link === 'howRegister') {
    router.push('/article/howRegister') // 替换为实际的目标路由
  }else if (link === 'inviteFriends') {
    router.push('/article/agencyPlan') // 替换为实际的目标路由
  }
}

function handleCoinClick(instId) {
  // 去掉 "USDT" 后跳转
  const coin = instId.replace('USDT', '');
  router.push({ path: '/trading', query: { coin } });
}

// 添加跳转链接的方法
const navigateToLink = () => {
  window.open('https://t.me/+1hz-GvUuw0FmNDM1', '_blank')
}
const handleClickToAgencyPlan = () => {
  window.open('/#/article/agencyPlan', '_blank')
}
const easyMoneyClause = () => {
  window.open('/#/article/easyMoneyClause', '_blank')
}
const goToRegister = () => {
  router.push('/register') // 跳转到注册页
}
const goToLogin = () => {
  router.push('/login') // 跳转到登录页
}
// 定义市场数据变量和获取数据的方法
const marketData = ref(null)

async function fetchMarketData() {
  const cachedData = localStorage.getItem('marketData')

  if (cachedData) {
    marketData.value = JSON.parse(cachedData) // 如果有缓存，则使用缓存数据
  } else {
    try {
      const response = await axios.get('https://test.keepbit.top/app_api/v1/Market/GetMarketContacts')
      if (response.data.ErrCode === '0' && response.data.Success) {
        marketData.value = response.data.ResData // 存储数据到响应式变量
        localStorage.setItem('marketData', JSON.stringify(response.data.ResData)) // 缓存数据到 localStorage
      }
    } catch (error) {
      console.error('获取市场数据失败:', error)
    }
  }
}

onMounted(() => {
  fetchMarketData()
  // 创建Ticker Tape组件
  const script = initTickerTape()
  tickerTapRef.value.appendChild(script)

  scrollInterval = setInterval(() => {
    // 判断是否滚动到底部
    if (carouselRef.value.scrollLeft + carouselRef.value.clientWidth >= carouselRef.value.scrollWidth) {
      carouselRef.value.scrollLeft = 0 // 重置到开头
    } else {
      carouselRef.value.scrollLeft += 2 // 每次向右滚动1px，可根据需求调整
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
            <NButton class="w-60 h-14 rounded-2xl bg-[#76e43b] text-black" @click="goToRegister">
              {{ t('register.title') }}
            </NButton>

            <NButton class="w-60 h-14 rounded-2xl bg-white text-black" @click="goToLogin">
              {{ t('login.title') }}
            </NButton>
          </div>
        </div>
        <div class="lg:w-0 lg:flex-1 relative">
          <div class="hidden lg:block absolute -left-1/2 -top-1/2 translate-x-[30%] translate-y-[30%] w-[800px]">
            <img class="w-full" src="/home_hero_bg.png" />
          </div>
          <img
            class="block lg:hidden absolute -left-1/2 -top-1/2 translate-x-1/2 translate-y-1/2 w-full"
            src="/home_hero_bg.png"
          />
          <img class="w-full" src="/home_hero.png" />
        </div>
      </div>
      <div class="carousel px-4 lg:p-0 flex gap-4 overflow-x-auto">
        <img class="lg:w-0 lg:flex-1 h-[260px]" src="/home_card_1.png" alt="Link to Telegram" @click="navigateToLink" />
        <img
          class="lg:w-0 lg:flex-1 h-[260px]"
          src="/home_card_2.png"
          alt="Home Card"
          @click="handleClickToAgencyPlan"
        />
        <img class="lg:w-0 lg:flex-1 h-[260px]" src="/home_card_3.png" alt="Home Card" @click="easyMoneyClause" />
      </div>
    </div>
  </div>
  <div ref="tickerTapRef" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget" />
  </div>
  <div class="lg:w-[1280px] mx-auto my-8 space-y-8">
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
  <div class="lg:w-[1280px] mx-auto my-8 space-y-8">
    <div class="text-center lg:text-left text-[40px] font-bold">{{ t('home.hotCoinPrice') }}</div>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="p-4 lg:p-0 lg:w-0 lg:flex-[3]">
        <NTabs
          :value="currentTab"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          :on-update:value="(val) => (currentTab = val)"
        >
          <NTabPane name="stock" :tab="t('home.hotStock')">
            <div class="space-y-4">
              <Coin v-for="item of sortedByLastPriceCoinSpotList.top" :key="item.instId" :coin="item" showStock @click="handleCoinClick(item.instId)"/>
            </div>
          </NTabPane>
          <NTabPane name="treat" :tab="t('home.hotTreat')">
            <div class="space-y-4">
              <Coin v-for="item of sortedByLastPriceCoinList.top" :key="item.instId" :coin="item" showStock @click="handleCoinClick(item.instId)"/>
            </div>
          </NTabPane>
        </NTabs>
      </div>
      <div class="p-4 space-y-4 lg:space-y-0 lg:p-0 lg:w-0 lg:flex-[2]">
        <div class="text-xl font-bold lg:h-[60px] lg:leading-[60px]">{{ t('home.riseRanking') }}</div>
        <div class="space-y-4">
          <Coin
            v-for="item of currentTab === 'stock'
              ? sortedCoinSpotList.list.slice(0, 3)
              : sortedCoinList.list.slice(0, 3)"
            :key="item.instId"
            :coin="item"
            @click="handleCoinClick(item.instId)"
          />
        </div>
        <div class="text-xl font-bold lg:h-[162px] lg:leading-[162px]">{{ t('home.fallRanking') }}</div>
        <div class="space-y-4">
          <Coin
            v-for="item of currentTab === 'stock' ? sortedCoinSpotList.list.slice(-3) : sortedCoinList.list.slice(-3)"
            :key="item.instId"
            :coin="item"
            @click="handleCoinClick(item.instId)"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-100 py-16">
    <div class="lg:w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-32 px-4 lg:px-0">
      <img class="w-full md:size-[550px] object-cover hidden md:block" src="/guide.png" />
      <div class="w-full lg:w-0 lg:flex-1 space-y-6">
        <div class="text-[40px] font-bold">{{ t('home.guide.title') }}</div>
        <div class="text-xl text-slate-400">{{ t('home.guide.subtitle') }}</div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 pt-[48px] px-4 pb-8"
            @click="goToPage('howRegister')"
          >
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              1
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[0].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[0].subtitle') }}</div>
          </div>
          <div
              @click="navigateToArticle('KeepBitRecharge.docx')"
            class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 pt-[48px] px-4 pb-8"
          >
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              2
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[1].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[1].subtitle') }}</div>
          </div>
          <div
              @click="navigateToArticle('KeepBitTrading.docx')"
            class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 pt-[48px] px-4 pb-8"
          >
            <div class="absolute top-0 left-0 bg-[#76e43c] py-2 px-4 rounded-tl-md rounded-br-md text-2xl font-bold">
              3
            </div>
            <div class="text-2xl font-bold">{{ t('home.guide.list[2].title') }}</div>
            <div class="text-slate-400">{{ t('home.guide.list[2].subtitle') }}</div>
          </div>
          <div
            class="bg-white rounded-md relative w-full flex flex-col items-center justify-center gap-y-4 pt-[48px] px-4 pb-8"
            @click="goToPage('inviteFriends')"
          >
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
    <!-- 将整个部分在手机端隐藏 -->
    <div class="space-y-8 lg:w-[700px] hidden lg:block">
      <div class="text-[40px] font-bold">{{ t('home.download.title') }}</div>
      <div class="relative bg-[#78e43f] p-8 rounded-3xl flex items-center gap-x-8 w-full">
        <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" />
        <div class="size-[100px] lg:size-[220px] p-4 rounded-3xl bg-white flex items-center justify-center z-10">
          <img class="size-full" src="/download_qrcode.png" />
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
        <a href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/apple.svg" alt="Apple Icon" />
            </div>
            <div class="text-2xl">iOS</div>
          </div>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.keepbitpro.android&referrer=google_play"
          target="_blank"
        >
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/google.svg" alt="Google Play Icon" />
            </div>
            <div class="text-2xl">Google Play</div>
          </div>
        </a>
        <a href="/KeepBit_cn3.3.0.apk" target="_blank">
          <div class="relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4">
            <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
            <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
              <img class="size-[30px]" src="/android.svg" alt="Android Icon" />
            </div>
            <div class="text-2xl">Android</div>
          </div>
        </a>
      </div>
      <div
        class="lg:hidden relative bg-[#78e43f] p-8 rounded-lg flex items-center gap-x-4"
        @click="router.push('/download')"
      >
        <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" />
        <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
          <NIcon class="text-[30px]">
            <ArrowDownload16Regular />
          </NIcon>
        </div>
        <div class="text-2xl">{{ t('home.download.tap') }}</div>
      </div>
    </div>
    <img class="w-full lg:w-auto lg:h-[700px] hidden lg:block" src="/market.png" />
  </div>
  <div ref="carouselRef" class="carousel sm:my-2 my-8 flex px-8 gap-x-4 overflow-x-hidden">
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_1.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_2.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_3.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_4.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_5.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_5.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_6.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_7.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_8.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_9.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_10.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_11.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_12.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_13.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_14.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_15.png" />
    <img class="w-[300px] hover:scale-105 transition" src="/carousel_16.png" />
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
      <div class="h-[72px]">
        <div v-if="showToolTip" class="bg-[#78e43f] px-2 py-4 lg:p-4 flex items-center gap-x-0.5 lg:gap-x-2 rounded-md">
          <img class="size-[40px]" src="/logo.png" />
          <div>
            <div class="font-bold text-xs">KeepBit</div>
            <div class="text-xs text-slate-600">{{ t('home.download.title') }}</div>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.keepbitpro.android&referrer=google_play"
            target="_blank"
          >
            <div class="px-1 lg:px-2 py-0.5 lg:py-1 flex items-center gap-x-1 bg-black rounded-md">
              <img class="hidden lg:block size-7" src="/google.png" alt="Google Play" />
              <span class="text-white truncate">Google Play</span>
            </div>
          </a>
          <a href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
            <div class="px-1 lg:px-2 py-0.5 lg:py-1 flex items-center gap-x-1 bg-black rounded-md">
              <img class="hidden lg:block size-7" src="/apple.png" alt="Apple Store" />
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
  </div>
</template>

<style scoped>
.carousel::-webkit-scrollbar {
  display: none;
}
</style>
