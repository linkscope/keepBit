<script setup>
import {ref, onMounted, computed} from 'vue'
import axios from 'axios'
import {NInput, NIcon, NButton, NPagination, NModal} from 'naive-ui'
import {Search24Regular} from '@vicons/fluent'

const {t} = useI18n()
const showModal = ref(false)
const showInvestment = ref(false)
const allTactics = ref([]) // 用于存储从接口获取的所有数据
const tacticsList = computed(() => {
  // 计算当前页的数据
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return allTactics.value.slice(start, end)
})
const selectedTactic = ref(null) // 用于存储当前选中的策略数据
const availableAmount = ref(null) // 用于存储可用金额
const isDemoMode = ref(false) // 判断是使用策略还是模拟

const pagination = ref({
  current: 1,
  pageSize: 9,
  count: 0, // 总页数，根据数据量计算
})

// 获取策略数据
const fetchTactics = async () => {
  try {
    const response = await axios.get('https://test.keepbit.top/app_api/v1/Tactics/GetTactics')
    if (response.data.Success) {
      allTactics.value = response.data.ResData // 将数据赋值给 allTactics
      pagination.value.count = Math.ceil(allTactics.value.length / pagination.value.pageSize) // 计算总页数
    }
  } catch (error) {
    console.error('Failed to fetch tactics:', error)
  }
}

// 打开模态框并设置选中的策略数据
const openModal = (tactic) => {
  selectedTactic.value = tactic // 将选中的策略数据赋值给 selectedTactic
  showModal.value = true // 打开模态框
}

// 使用策略请求
const useStrategy = async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A"
  isDemoMode.value = false
  try {
    const response = await axios.post('https://test.keepbit.top/app_api/v1/User/GetMyAccount', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.data.Success) {
      availableAmount.value = response.data.ResData.Available // 设置可用金额
      showInvestment.value = true // 显示投资部分
    } else {
      console.error('Error:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('Failed to fetch account:', error)
  }
}

// 模拟请求
const demoStrategy = async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A"
  isDemoMode.value = true
  try {
    const response = await axios.post('https://test.keepbit.top/app_api/v1/DemoTrading/GetMyDemoAccount', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.data.Success) {
      availableAmount.value = response.data.ResData.Available // 设置可用金额
      showInvestment.value = true // 显示投资部分
    } else {
      console.error('Error:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('Failed to fetch demo account:', error)
  }
}

// 创建策略请求
const createStrategy = async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A"
  const qty = 1000 // 设置投资数量
  const payload = {
    tacticsId: selectedTactic.value.Id,
    qty: qty
  }
  const url = isDemoMode.value
      ? 'https://test.keepbit.top/app_api/v1/DemoTrading/StartContract'
      : 'https://test.keepbit.top/app_api/v1/Trade/StartMission'

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.data.Success) {
      console.log('Operation Success:', response.data.ResData)
      showModal.value = false // 关闭模态框
      showInvestment.value = false // 重置投资部分显示
    } else {
      console.error('Error:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('Failed to create strategy:', error)
  }
}

onMounted(() => {
  fetchTactics() // 组件挂载时获取数据
})
</script>

<template>
  <div class="lg:w-[1280px] mx-auto p-4 lg:py-32 space-y-8">
    <div class="space-y-4">
      <div class="flex items-center gap-x-8">
        <img class="size-16" src="/group.png"/>
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
              <Search24Regular/>
            </NIcon>
          </div>
        </template>
      </NInput>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4">
      <div
          v-for="item in tacticsList"
          :key="item.Id"
          class="py-4 px-8 border border-slate-200 shadow-md rounded-xl hover:scale-105 transition"
      >
        <div class="pb-4 border-b border-b-slate-200 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-lg font-bold">{{ item.Name }}</div>
            <div class="text-[#76e43b] text-base">{{ item.Leverage }}X</div>
          </div>
          <div class="flex items-center gap-x-4">
            <NButton class="bg-[#76e43c] text-black font-bold px-8 rounded-full" @click="openModal(item)">{{
                t('strategy.enable')
              }}
            </NButton>
            <NButton class="bg-black text-white font-bold px-8 rounded-full">{{ t('strategy.signal') }}</NButton>
          </div>
        </div>
        <div class="py-4 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-3xl text-[#76e43c]">{{ item.MarketViewModel.Hbl }}</div>
            <div class="flex items-center gap-x-2">
              <img class="size-5" src="/user.png"/>
              <div class="text-base">{{ item.MarketViewModel.Gdrs }}</div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.profit') }}</div>
            <div class="relative">
              <img class="size-6" src="/user1.png"/>
              <img class="absolute top-0 right-3 size-6" src="/user2.png"/>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.runtime') }}</div>
            <div class="text-[#76e43c]">{{ item.MarketViewModel.Run_Time }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.maxDrawDown') }}</div>
            <div>{{ item.MarketViewModel.Zdhc }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-slate-400">{{ t('strategy.manageScale') }}</div>
            <div>{{ item.MarketViewModel.Gszj }}</div>
          </div>
        </div>
        <div class="pt-4 border-t border-t-slate-200 flex items-center justify-between gap-x-4">
          <img class="size-8" :src="item.Icon.split('|')[0]"/>
          <div class="flex-1 text-base font-bold">{{ t('strategy.strategyBy') }}：KeepBit</div>
          <NButton type="primary" size="small">{{ t('strategy.shareProfit') }}{{ item.MarketViewModel.Frbl }}</NButton>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <NPagination v-model:page="pagination.current" :page-count="pagination.count"/>
    </div>
  </div>

  <!-- 模态框 -->
  <NModal v-model:show="showModal" v-if="selectedTactic">
    <div class="bg-white rounded-2xl p-4 w-full lg:w-[600px] space-y-4">
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">{{ selectedTactic.Name }}</div>
          <img class="size-7" src="/close.png" @click="showModal = false"/>
        </div>
        <div class="rounded-xl bg-slate-50 flex py-4">
          <div class="flex-1 flex flex-col items-center gap-y-4">
            <div class="text-base">{{ t('strategy.useCount') }}</div>
            <div>{{ selectedTactic.MarketViewModel.Gdrs }}</div>
          </div>
          <div class="flex-1 flex flex-col items-center gap-y-4">
            <div class="text-base">{{ t('strategy.manageScale') }}</div>
            <div>{{ selectedTactic.MarketViewModel.Gszj }}</div>
          </div>
        </div>
      </div>
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.detail.title') }}</div>
        <div class="grid grid-cols-2 gap-4">
          <div>{{ t('strategy.detail.balance') }}：{{ selectedTactic.MarketViewModel.Gdbzjye }}</div>
          <div>{{ t('strategy.detail.scale') }}：{{ selectedTactic.MarketViewModel.Zcglgm }}</div>
          <div>{{ t('strategy.detail.profit') }}：{{ selectedTactic.MarketViewModel.Ylcwsl }}</div>
          <div>{{ t('strategy.detail.minimum') }}：{{ selectedTactic.MarketViewModel.Zxgdje }}</div>
          <div>{{ t('strategy.detail.ratios') }}：{{ selectedTactic.MarketViewModel.Frbl }}</div>
        </div>
      </div>
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.project.title') }}</div>
        <div class="grid grid-cols-2 gap-4">
          <div>{{ t('strategy.project.rewards') }}：{{ selectedTactic.MarketViewModel.Hbl }}</div>
          <div>{{ t('strategy.project.profit') }}{{ t('strategy.project.title') }}：{{
              selectedTactic.MarketViewModel.Yk
            }}
          </div>
          <div>{{ t('strategy.project.profitRatio') }}：{{ selectedTactic.MarketViewModel.Ykbl }}</div>
          <div>{{ t('strategy.project.winRate') }}：{{ selectedTactic.MarketViewModel.Sl }}</div>
          <div>{{ t('strategy.project.maxDrawDown') }}：{{ selectedTactic.MarketViewModel.Zdhc }}</div>
          <div>{{ t('strategy.project.totalCount') }}：{{ selectedTactic.MarketViewModel.Zcwsl }}</div>
          <div>{{ t('strategy.project.profitCount') }}：{{ selectedTactic.MarketViewModel.Ylcwsl }}</div>
        </div>
      </div>
      <div v-if="!showInvestment" class="flex gap-x-2">
        <NButton class="bg-black text-white flex-1 h-10" @click="useStrategy">{{ t('strategy.useStrategy') }}</NButton>
        <NButton type="primary" class="text-white flex-1 h-10" @click="demoStrategy">{{
            t('strategy.imitation')
          }}
        </NButton>
      </div>
      <div v-if="showInvestment" class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.investment.title') }}</div>
        <NInput style="width: 100%" placeholder=">=1000 USDT"/>
        <div class="text-right">{{ t('strategy.investment.usage') }}: {{ availableAmount }}</div>
        <div class="text-rose-500">{{ t('strategy.investment.desc[0]') }}</div>
        <div class="text-rose-500">{{ t('strategy.investment.desc[1]') }}</div>
      </div>
      <div v-if="showInvestment" class="flex gap-x-2">
        <NButton class="bg-black text-white flex-1 h-10" @click="createStrategy">{{
            t('strategy.createStrategy')
          }}
        </NButton>
        <NButton type="primary" class="text-white flex-1 h-10" @click="showInvestment = false">{{
            t('strategy.cancel')
          }}
        </NButton>
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
