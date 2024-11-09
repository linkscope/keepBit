<script setup>
import { NCheckboxGroup, NCheckbox, NIcon } from 'naive-ui'
import { AddCircle16Regular } from '@vicons/fluent'
import Coin from '@/views/home/components/Coin.vue'
import useCryptoWS from '@/hooks/useCryptoWS'

const { t } = useI18n()
const currentTab = ref('stock')
const { coinList, sortedCoinList, coinSpotList, sortedCoinSpotList,  sortedByLastPriceCoinList, sortedByLastPriceCoinSpotList } = useCryptoWS()
const checkedSelfList = ref([])
</script>

<template>
  <div class="lg:w-[1280px] mx-auto px-4 lg:px-0 py-16 space-y-12">
    <div class="font-bold text-[40px]">{{ t('market.marking.title') }}</div>
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 border broder-slate-200 rounded-2xl relative px-4 py-2 card space-y-8">
        <div class="py-4 border-b border-b-slate-200 text-2xl font-bold pl-2 text-[#5ac820]">
          {{ t('market.marking.ranking[0]') }}
        </div>
        <div class="flex items-center text-sm text-slate-400">
          <div class="flex-1">{{ t('market.marking.coinType') }}</div>
          <div class="flex-1">{{ t('market.marking.price') }}</div>
          <div class="flex-1">{{ t('market.marking.change') }}</div>
        </div>
        <div class="flex items-center" v-for="item of sortedCoinList.list.slice(0, 6)" :key="item.instId">
          <div class="flex-1 flex items-center gap-x-2">
            <img class="size-[50px]" :src="item.image" />
            <div class="text-xl">{{ item.instId.replace('USDT', '') }}</div>
          </div>
          <div class="flex-1 text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="flex-1 text-sm"
            :style="{
              color: item.change24h > 0 ? '#5ac820' : 'red',
            }"
          >
            {{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
          </div>
        </div>
      </div>
      <div class="flex-1 border broder-slate-200 rounded-2xl relative px-4 py-2 card space-y-8">
        <div class="py-4 border-b border-b-slate-200 text-2xl font-bold pl-2 text-[#5ac820]">
          {{ t('market.marking.ranking[1]') }}
        </div>
        <div class="flex items-center text-sm text-slate-400">
          <div class="flex-1">{{ t('market.marking.coinType') }}</div>
          <div class="flex-1">{{ t('market.marking.price') }}</div>
          <div class="flex-1">{{ t('market.marking.change') }}</div>
        </div>
        <div class="flex items-center" v-for="item of sortedCoinList.list.slice(-6)" :key="item.instId">
          <div class="flex-1 flex items-center gap-x-2">
            <img class="size-[50px]" :src="item.image" />
            <div class="text-xl">{{ item.instId.replace('USDT', '') }}</div>
          </div>
          <div class="flex-1 text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="flex-1 text-sm"
            :style="{
              color: item.change24h > 0 ? '#5ac820' : 'red',
            }"
          >
            {{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
          </div>
        </div>
      </div>
      <div class="flex-1 border broder-slate-200 rounded-2xl relative px-4 py-2 card space-y-8">
        <div class="py-4 border-b border-b-slate-200 text-2xl font-bold pl-2 text-[#5ac820]">
          {{ t('market.marking.ranking[2]') }}
        </div>
        <div class="flex items-center text-sm text-slate-400">
          <div class="flex-1">{{ t('market.marking.coinType') }}</div>
          <div class="flex-1">{{ t('market.marking.price') }}</div>
          <div class="flex-1">{{ t('market.marking.change') }}</div>
        </div>
        <div class="flex items-center" v-for="item of sortedCoinList.list.slice(0, 6)" :key="item.instId">
          <div class="flex-1 flex items-center gap-x-2">
            <img class="size-[50px]" :src="item.image" />
            <div class="text-xl">{{ item.instId.replace('USDT', '') }}</div>
          </div>
          <div class="flex-1 text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="flex-1 text-sm"
            :style="{
              color: item.change24h > 0 ? '#5ac820' : 'red',
            }"
          >
            {{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-x-4"></div>
    <div class="font-bold text-[40px]">{{ t('market.default.title') }}</div>
    <div class="flex items-center gap-x-4">
      <div
        :class="[
          'rounded-full bg-slate-50 text-slate-400 w-40 py-2 text-center',
          currentTab === 'stock' ? 'bg-green-50 border border-green-200' : '',
        ]"
        @click="currentTab = 'stock'"
      >
        {{ t('market.default.tab[0].label') }}
      </div>
      <div
        :class="[
          'rounded-full bg-slate-50 text-slate-400 w-40 py-2 text-center',
          currentTab === 'trading' ? 'bg-green-50 border border-green-200' : '',
        ]"
        @click="currentTab = 'trading'"
      >
        {{ t('market.default.tab[1].label') }}
      </div>
      <div
        :class="[
          'rounded-full bg-slate-50 text-slate-400 w-40 py-2 text-center',
          currentTab === 'self' ? 'bg-green-50 border border-green-200' : '',
        ]"
        @click="currentTab = 'self'"
      >
        {{ t('market.default.tab[2].label') }}
      </div>
    </div>
    <div v-show="currentTab === 'stock'" class="p-4 border border-slate-200 space-y-4 rounded-2xl">
      <div class="text-[40px] font-bold">{{ t('market.default.tab[0].title') }}</div>
      <Coin v-for="item of sortedByLastPriceCoinSpotList.list" :key="item.instId" :coin="item" show-stock />
    </div>
    <div v-show="currentTab === 'trading'" class="p-4 border border-slate-200 space-y-4 rounded-2xl">
      <div class="text-[40px] font-bold">{{ t('market.default.tab[1].title') }}</div>
      <Coin v-for="item of sortedByLastPriceCoinList.list" :key="item.instId" :coin="item" show-stock />
    </div>
    <div v-show="currentTab === 'self'" class="p-4 border border-slate-200 space-y-4 rounded-2xl">
      <div class="text-[40px] font-bold">{{ t('market.default.tab[2].title') }}</div>
      <NCheckboxGroup v-model:value="checkedSelfList" class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <NCheckbox
          v-for="item of sortedByLastPriceCoinList.topThree"
          :key="item.instId"
          class="border border-slate-200 bg-slate-100 rounded-md flex p-4 items-center gap-y-2"
          :value="item.instId"
        >
          <img class="size-[50px]" :src="item.image" />
          <div class="text-2xl font-bold">{{ item.instId.replace('USDT', '') }}</div>
          <div class="text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="text-sm"
            :style="{
              color: item.change24h > 0 ? '#5ac820' : 'red',
            }"
          >
            {{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
          </div>
        </NCheckbox>
      </NCheckboxGroup>
      <div class="w-60 py-4 border border-green-200 bg-green-50 flex items-center justify-center gap-x-2">
        <NIcon class="text-2xl">
          <AddCircle16Regular />
        </NIcon>
        <span>{{ t('market.default.addSelf') }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
:deep(.n-checkbox__label) {
  @apply w-0 flex-1 flex items-center justify-between;
}
.card::before {
  @apply absolute left-0 top-6 h-8 border-l-4 border-l-[#76e43c];
  content: '';
}
</style>
