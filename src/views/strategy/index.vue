<script setup>
import { NInput, NIcon, NButton, NPagination, NModal } from 'naive-ui'
import { Search24Regular } from '@vicons/fluent'

const { t } = useI18n()
const pagination = ref({
  current: 1,
  count: 1,
})
const showModal = ref(false)
const showInvestment = ref(false)
</script>

<template>
  <div class="lg:w-[1280px] mx-auto p-4 lg:py-32 space-y-8">
    <div class="space-y-4">
      <div class="flex items-center gap-x-8">
        <img class="size-16" src="/group.png" />
        <div class="text-[64px] font-bold">{{ t('strategy.title') }}</div>
      </div>
      <div class="flex items-center text-2xl gap-x-8">
        <span>{{ t('strategy.subtitle[0]') }}</span>
        <span>|</span>
        <span>{{ t('strategy.subtitle[1]') }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-y-4 lg:flex-row lg:items-center justify-between">
      <div class="text-[40px] font-bold">{{ t('strategy.trading.title') }}</div>
      <NInput :placeholder="t('strategy.trading.search')">
        <template #prefix>
          <div class="flex items-center justify-center text-black">
            <NIcon class="text-2xl">
              <Search24Regular />
            </NIcon>
          </div>
        </template>
      </NInput>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4">
      <div
        v-for="item of 10"
        :key="item"
        class="py-4 px-8 border border-slate-200 shadow-md rounded-xl hover:scale-105 transition"
      >
        <div class="pb-4 border-b border-b-slate-200 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-lg font-bold">超级马丁-BTC-5分钟【双向】</div>
            <div class="text-[#76e43b] text-base">20.0X</div>
          </div>
          <div class="flex items-center gap-x-4">
            <NButton class="bg-[#76e43c] text-black font-bold px-8 rounded-full" @click="showModal = true">{{
              t('strategy.enable')
            }}</NButton>
            <NButton class="bg-black text-white font-bold px-8 rounded-full">{{ t('strategy.signal') }}</NButton>
          </div>
        </div>
        <div class="py-4 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-3xl text-[#76e43c]">+81.2%</div>
            <div class="flex items-center gap-x-2">
              <img class="size-5" src="/user.png" />
              <div class="text-base">230</div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.profit') }}</div>
            <div class="relative">
              <img class="size-6" src="/user1.png" />
              <img class="absolute top-0 right-3 size-6" src="/user2.png" />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.runtime') }}</div>
            <div class="text-[#76e43c]">159日9时49分</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.maxDrawDown') }}</div>
            <div>3%</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.manageScale') }}</div>
            <div>1730000</div>
          </div>
        </div>
        <div class="pt-4 border-t border-t-slate-200 flex items-center justify-between gap-x-4">
          <img class="size-8" src="/user_avatar.png" />
          <div class="flex-1 text-base font-bold">{{ t('strategy.strategyBy') }}：KeepBit</div>
          <NButton type="primary" size="small">{{ t('strategy.shareProfit') }}20%</NButton>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
    </div>
  </div>

  <NModal v-model:show="showModal">
    <div class="bg-white rounded-2xl p-4 w-full lg:w-[600px] space-y-4">
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">超级马丁-BTC-5分钟【双向】</div>
          <img class="size-7" src="/close.png" @click="showModal = false" />
        </div>
        <div class="rounded-xl bg-slate-50 flex py-4">
          <div class="flex-1 flex flex-col items-center gap-y-4">
            <div class="text-base">{{ t('strategy.useCount') }}</div>
            <div>230</div>
          </div>
          <div class="flex-1 flex flex-col items-center gap-y-4">
            <div class="text-base">{{ t('strategy.manageScale') }}</div>
            <div>20000000</div>
          </div>
        </div>
      </div>
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.detail.title') }}</div>
        <div class="grid grid-cols-2 gap-4">
          <div>{{ t('strategy.detail.balance') }}：120000000</div>
          <div>{{ t('strategy.detail.scale') }}：2000000</div>
          <div>{{ t('strategy.detail.profit') }}：214667</div>
          <div>{{ t('strategy.detail.minimum') }}：3000</div>
          <div>{{ t('strategy.detail.ratios') }}：20%</div>
        </div>
      </div>
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.project.title') }}</div>
        <div class="grid grid-cols-2 gap-4">
          <div>{{ t('strategy.project.rewards') }}：81.2%</div>
          <div>{{ t('strategy.project.profit') }}{{ t('strategy.project.title') }}：879300</div>
          <div>{{ t('strategy.project.profitRatio') }}：7.8</div>
          <div>{{ t('strategy.project.winRate') }}：85%</div>
          <div>{{ t('strategy.project.maxDrawDown') }}：2.8%</div>
          <div>{{ t('strategy.project.totalCount') }}：214677</div>
          <div>{{ t('strategy.project.profitCount') }}：214677</div>
        </div>
      </div>
      <div v-if="!showInvestment" class="flex gap-x-2">
        <NButton class="bg-black text-white flex-1 h-10" @click="showInvestment = true">{{
          t('strategy.useStrategy')
        }}</NButton>
        <NButton type="primary" class="text-white flex-1 h-10" @click="showInvestment = true">{{
          t('strategy.imitation')
        }}</NButton>
      </div>
      <div v-if="showInvestment" class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.investment.title') }}</div>
        <NInput style="width: 100%" placeholder=">=1000 USDT" />
        <div class="text-right">{{ t('strategy.investment.usage') }}: 22978.7737 USDT</div>
        <div class="text-rose-500">{{ t('strategy.investment.desc[0]') }}</div>
        <div class="text-rose-500">{{ t('strategy.investment.desc[1]') }}</div>
      </div>
      <div v-if="showInvestment" class="flex gap-x-2">
        <NButton class="bg-black text-white flex-1 h-10" @click="showInvestment = false">{{
          t('strategy.createStrategy')
        }}</NButton>
        <NButton type="primary" class="text-white flex-1 h-10" @click="showInvestment = false">{{
          t('strategy.cancel')
        }}</NButton>
      </div>
    </div>
  </NModal>
</template>
<style scoped>
:deep(.n-input:not(.n-input--autosize)) {
  @apply w-60 h-10;
}
:deep(.n-input__border) {
  @apply border-black rounded-xl;
}
:deep(.n-input__prefix) {
  @apply flex items-center justify-center text-black;
}
:deep(.n-input--focus) {
  @apply rounded-xl;
}
</style>
