<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { NInput, NIcon, NButton, NPagination, NModal, useMessage } from 'naive-ui'
import { Search24Regular } from '@vicons/fluent'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const showModal = ref(false)
const showInvestment = ref(false)
const allTactics = ref([]) // 用于存储从接口获取的所有数据
const router = useRouter()

const searchValue = ref('')
const tacticsList = computed(() => {
  // 计算当前页的数据
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  const filteredTactics = allTactics.value.filter((i) => i.Name.toLowerCase().includes(searchValue.value.toLowerCase()))
  pagination.value.count = Math.ceil(filteredTactics.length / pagination.value.pageSize)
  return filteredTactics.slice(start, end)
})
const selectedTactic = ref(null) // 用于存储当前选中的策略数据
const availableAmount = ref(null) // 用于存储可用金额
const isDemoMode = ref(false) // 判断是使用策略还是模拟
const message = useMessage()
const qty = ref('') // 初始值为空字符串

const pagination = ref({
  current: 1,
  pageSize: 9,
  count: 1, // 总页数，根据数据量计算
})

// 获取策略数据
const fetchTactics = async () => {
  try {
    const response = await axios.get('https://test.keepbit.top/app_api/v1/Tactics/GetTactics')
    if (response.data.Success) {
      allTactics.value = response.data.ResData // 将数据赋值给 allTactics
    }
  } catch (error) {
    message.error(t('message.getTacticsError'))
  }
}

// 打开模态框并设置选中的策略数据
const openModal = (tactic) => {
  selectedTactic.value = tactic // 将选中的策略数据赋值给 selectedTactic
  showModal.value = true // 打开模态框
}

// 使用策略请求
const useStrategy = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    message.warning('请先登录')
    await router.push('/login')
    return
  }
  isDemoMode.value = false
  try {
    const response = await axios.post(
      'https://test.keepbit.top/app_api/v1/User/GetMyAccount',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.Success) {
      availableAmount.value = response.data.ResData.Available // 设置可用金额
      showInvestment.value = true // 显示投资部分
    } else {
      message.error(response.data.ErrMsg)
    }
  } catch (error) {
    message.error(error)
  }
}

// 模拟请求
const demoStrategy = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    message.warning('请先登录')
    await router.push('/login')
    return
  }
  isDemoMode.value = true
  try {
    const response = await axios.post(
      'https://test.keepbit.top/app_api/v1/DemoTrading/GetMyDemoAccount',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.Success) {
      availableAmount.value = response.data.ResData.Available // 设置可用金额
      showInvestment.value = true // 显示投资部分
    } else {
      message.error(response.data.ErrMsg)
    }
  } catch (error) {
    message.error(error)
  }
}

// 创建策略请求
const createStrategy = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    message.warning('请先登录')
    await router.push('/login')
    return
  }
  if (!qty.value || isNaN(qty.value) || parseFloat(qty.value) <= 0) {
    message.error(t('message.invalidAmount')) // 提示用户输入有效的金额
    return
  }

  const payload = {
    tacticsId: selectedTactic.value.Id,
    qty: parseFloat(qty.value), // 使用输入框中的 qty 值
  }
  const url = isDemoMode.value
    ? 'https://test.keepbit.top/app_api/v1/DemoTrading/StartContract'
    : 'https://test.keepbit.top/app_api/v1/Trade/StartMission'

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.data.Success) {
      console.log('Operation Success:', response.data.ResData)
      showModal.value = false // 关闭模态框
      showInvestment.value = false // 重置投资部分显示
      message.success(t('message.createSuccess'))
    } else {
      console.log(response.data.ErrMsg)
      message.error(response.data.ErrMsg)
    }
  } catch (error) {
    message.error(error)
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
        <img class="size-16" src="/group.png" />
        <div class="text-4xl lg:text-[64px] font-bold">{{ t('strategy.title') }}</div>
      </div>
      <div class="flex items-center text-sm lg:text-2xl gap-x-8">
        <span>{{ t('strategy.subtitle[0]') }}</span>
        <span>|</span>
        <span>{{ t('strategy.subtitle[1]') }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-y-4 lg:flex-row lg:items-center justify-between">
      <div class="text-xl lg:text-[40px] font-bold">{{ t('strategy.trading.title') }}</div>
      <NInput v-model:value="searchValue" :placeholder="t('strategy.trading.search')" @input="pagination.current = 1">
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
            <NButton class="bg-[#76e43c] text-black font-bold px-8 rounded-full" @click="openModal(item)"
              >{{ t('strategy.enable') }}
            </NButton>
            <NButton class="bg-black text-white font-bold px-8 rounded-full">{{ t('strategy.signal') }}</NButton>
          </div>
        </div>
        <div class="py-4 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-3xl text-[#76e43c]">{{ item.MarketViewModel.Hbl }}</div>
            <div class="flex items-center gap-x-2">
              <img class="size-5" src="/user.png" />
              <div class="text-base">{{ item.MarketViewModel.Gdrs }}</div>
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
          <img class="size-8" :src="item.Icon.split('|')[0]" />
          <div class="flex-1 text-base font-bold">{{ t('strategy.strategyBy') }}：KeepBit</div>
          <NButton type="primary" size="small">{{ t('strategy.shareProfit') }}{{ item.MarketViewModel.Frbl }}</NButton>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
    </div>
  </div>

  <!-- 模态框 -->
  <NModal v-model:show="showModal" v-if="selectedTactic">
    <div class="bg-white rounded-2xl p-4 w-full lg:w-[600px] space-y-4">
      <div class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">{{ selectedTactic.Name }}</div>
          <img class="size-7" src="/close.png" @click="showModal = false" />
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
          <div>
            {{ t('strategy.project.profit') }}{{ t('strategy.project.title') }}：{{ selectedTactic.MarketViewModel.Yk }}
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
        <NButton type="primary" class="text-white flex-1 h-10" @click="demoStrategy"
          >{{ t('strategy.imitation') }}
        </NButton>
      </div>
      <div v-if="showInvestment" class="pb-4 border-b border-b-slate-200 space-y-4">
        <div class="text-xl font-bold">{{ t('strategy.investment.title') }}</div>
        <NInput v-model:value="qty" style="width: 100%" placeholder=">=1000 USDT" />
        <div class="text-right">{{ t('strategy.investment.usage') }}: {{ availableAmount }}</div>
        <div class="text-rose-500">{{ t('strategy.investment.desc[0]') }}</div>
        <div class="text-rose-500">{{ t('strategy.investment.desc[1]') }}</div>
      </div>
      <div v-if="showInvestment" class="flex gap-x-2">
        <NButton class="bg-black text-white flex-1 h-10" @click="createStrategy"
          >{{ t('strategy.createStrategy') }}
        </NButton>
        <NButton type="primary" class="text-white flex-1 h-10" @click="showInvestment = false"
          >{{ t('strategy.cancel') }}
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
