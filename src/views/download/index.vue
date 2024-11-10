<script setup>
import { NButton } from 'naive-ui'

const { t } = useI18n()
</script>
<template>
  <div class="lg:w-[1280px] mx-auto px-4 lg:px-0 py-16 flex flex-col-reverse lg:flex-row justify-between gap-16">
    <div class="p-4 lg:p-0 flex flex-col gap-y-4 justify-evenly">
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
    <img class="block w-full lg:w-auto lg:h-[700px]" src="/market.png" />
  </div>
  <div class="p-4 space-y-8 lg:w-[1280px] mx-auto">
    <div class="text-[40px] font-bold">{{ t('home.download.title') }}</div>
    <div class="hidden lg:flex relative bg-[#78e43f] p-8 rounded-3xl items-center gap-x-8 w-full">
      <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" />
      <div class="size-[100px] lg:size-[220px] rounded-3xl bg-white flex items-center justify-center z-10">
        <img class="size-[80px] lg:size-[200px]" src="/download_qrcode.png" />
      </div>
      <div class="flex-1 space-y-8">
        <div class="text-3xl font-bold">{{ t('home.download.scan') }}</div>
        <div class="text-[40px] font-bold">iOS & Android</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 lg:gap-8">
      <a href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
        <div class="relative bg-[#78e43f] py-4 px-2 rounded-lg flex items-center gap-x-2">
          <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
          <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
            <img class="size-[30px]" src="/apple_store.svg" alt="App Store Icon" />
          </div>
          <div class="text-lg">App Store</div>
        </div>
      </a>
      <a href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
        <div class="relative bg-[#78e43f] py-4 px-2 rounded-lg flex items-center gap-x-2">
          <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
          <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
            <img class="size-[30px]" src="/apple.svg" alt="Apple Icon" />
          </div>
          <div class="text-lg">iOS</div>
        </div>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.keepbitpro.android&referrer=google_play"
        target="_blank"
      >
        <div class="relative bg-[#78e43f] py-4 px-1 rounded-lg flex items-center gap-x-2">
          <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
          <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
            <img class="size-[30px]" src="/google.svg" alt="Google Play Icon" />
          </div>
          <div class="text-lg">Google Play</div>
        </div>
      </a>
      <a href="/#/KeepBit_cn3.3.0.apk" target="_blank">
        <div class="relative bg-[#78e43f] py-4 px-2 rounded-lg flex items-center gap-x-2">
          <img class="absolute top-0 left-0 size-full object-fill" src="/trading_strategy_bg.png" alt="Background" />
          <div class="size-[50px] rounded-full bg-white flex items-center justify-center">
            <img class="size-[30px]" src="/android.svg" alt="Android Icon" />
          </div>
          <div class="text-lg">Android</div>
        </div>
      </a>
    </div>
  </div>
  <div class="fixed flex lg:hidden w-full bottom-0 py-3 px-4 items-center gap-x-4 bg-white/80 drop-shadow z-10">
    <a
      class="flex-1"
      href="https://play.google.com/store/apps/details?id=com.keepbitpro.android&referrer=google_play"
      target="_blank"
    >
      <div class="w-full py-4 flex items-center justify-center gap-x-1 bg-black rounded-full">
        <img class="size-7" src="/google.png" alt="Google Play" />
        <span class="text-white">Google Play</span>
      </div>
    </a>
    <a class="flex-1" href="https://apps.apple.com/us/app/keepbit/id6499257545" target="_blank">
      <div class="w-full py-4 flex items-center justify-center gap-x-1 bg-black rounded-full">
        <img class="size-7" src="/apple.png" alt="Apple Store" />
        <span class="text-white truncate">Apple Store</span>
      </div>
    </a>
  </div>
</template>
