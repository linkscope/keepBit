<script setup>
import { computed, ref, watch } from 'vue'
import { NCheckboxGroup, NCheckbox, NIcon, useMessage, NTabs, NTabPane, NInput, NPagination } from 'naive-ui' // 从 Naive UI 导入 useMessage
import { AddCircle16Regular, Search24Regular } from '@vicons/fluent'
import Coin from '@/views/home/components/Coin.vue'
import useCryptoWS from '@/hooks/useCryptoWS'
import axios from 'axios'

const { t } = useI18n()
const currentTab = ref('stock')
const { coinList, sortedCoinList, coinSpotList, sortedByLastPriceCoinList, sortedByLastPriceCoinSpotList } =
  useCryptoWS()
const checkedSelfList = ref([])
const selfChoiceList = ref([])
const apiSelfChoiceSymbols = ref([]) // 保存从 API 获取的自选标识符
const message = useMessage()
const pagination = ref({ current: 1, pageSize: 10, count: 1 })
const searchValue = ref('')

const coinData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  const filteredTactics = (
    currentTab.value === 'stock'
      ? sortedByLastPriceCoinSpotList.value.list
      : currentTab.value === 'trading'
        ? sortedByLastPriceCoinList.value.list
        : selfChoiceList.value
  )?.filter((i) => i.instId.toLowerCase().includes(searchValue.value.toLowerCase()))
  pagination.value.count = Math.ceil(filteredTactics.length / pagination.value.pageSize)
  return filteredTactics?.slice(start, end)
})

// 监听 currentTab 的变化，在切换到“自选”时执行查询
watch(currentTab, (newTab) => {
  if (newTab === 'self') {
    fetchSelfChoiceList()
  }
})

// 查询自选列表并保存自选标识符
async function fetchSelfChoiceList() {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await axios.get('https://test.keepbit.top/app_api/v1/MyChoice/GetMyChoices', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.ErrCode === '0' && response.data.ResData.length > 0) {
      apiSelfChoiceSymbols.value = response.data.ResData.map((item) => item.symbol_name.replace('/', ''))
      updateSelfChoiceList() // 初次查询后立即更新自选列表
    }
  } catch (error) {
    console.error('获取自选列表失败:', error)
  }
}

// 监听 sortedCoinList.value.list 的变化以更新自选列表
watch(
  () => sortedCoinList.value.list,
  (newList) => {
    if (newList && apiSelfChoiceSymbols.value.length > 0) {
      updateSelfChoiceList()
    }
  },
  { immediate: true }, // 如果 sortedCoinList 已存在，立即执行一次
)

// 根据 WebSocket 数据更新自选列表
function updateSelfChoiceList() {
  if (sortedCoinList.value.list && sortedCoinList.value.list.length > 0) {
    selfChoiceList.value = sortedCoinList.value.list.filter((coin) => apiSelfChoiceSymbols.value.includes(coin.instId))
  }
}

// 添加勾选的项到自选列表
async function addToFavorites() {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    message.error('请先登录')
    return
  }

  // 遍历 checkedSelfList，发送添加自选请求
  for (const instId of checkedSelfList.value) {
    const selectedCoin = sortedCoinList.value.list.find((coin) => coin.instId === instId)
    if (selectedCoin) {
      const symbol_name = `${selectedCoin.instId.replace('USDT', '/USDT')}` // 生成符合格式的 symbol_name
      const encodedSymbolName = encodeURIComponent(symbol_name) // 将 symbol_name 编码为 %2F

      try {
        const response = await axios.get(
          `https://test.keepbit.top/app_api/v1/MyChoice/AddSymbol?symbol_name=${encodedSymbolName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              symbol_type: 2,
              base_token_id: selectedCoin.instId.replace('USDT', ''),
              quote_token_id: 'USDT', // 假设报价币种为 'USDT'
            },
          },
        )

        if (response.data.ErrCode === '0' && response.data.Success) {
          console.error(`${symbol_name} 添加成功`)
        } else {
          message.error(t('message.addError')`:${response.data.ErrMsg}`)
        }
      } catch (error) {
        message.error(t('message.addError'))
      }
    }
  }
  message.success(t('message.addSuccess'))
  // 添加完毕后重新查询自选列表
  await fetchSelfChoiceList()
}
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
            <div class="text-xs lg:text-xl">{{ item.instId.replace('USDT', '') }}</div>
          </div>
          <div class="flex-1 text-xs lg:text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="flex-1 text-xs lg:text-sm"
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
            <div class="text-xs lg:text-xl">{{ item.instId.replace('USDT', '') }}</div>
          </div>
          <div class="flex-1 text-xs lg:text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="flex-1 text-xs lg:text-sm"
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
            <div class="text-xs lg:text-xl">{{ item.instId.replace('USDT', '') }}</div>
          </div>
          <div class="flex-1 text-xs lg:text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
          <div
            class="flex-1 text-xs lg:text-sm"
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
        :class="['tab-item', currentTab === 'stock' ? 'active-tab' : '']"
        @click="
          () => {
            pagination.current = 1
            currentTab = 'stock'
          }
        "
      >
        {{ t('market.default.tab[0].label') }}
      </div>
      <div
        :class="['tab-item', currentTab === 'trading' ? 'active-tab' : '']"
        @click="
          () => {
            pagination.current = 1
            currentTab = 'trading'
          }
        "
      >
        {{ t('market.default.tab[1].label') }}
      </div>
      <div
        :class="['tab-item', currentTab === 'self' ? 'active-tab' : '']"
        @click="
          () => {
            pagination.current = 1
            currentTab = 'self'
          }
        "
      >
        {{ t('market.default.tab[2].label') }}
      </div>
    </div>
    <div v-show="currentTab === 'stock'" class="p-4 border border-slate-200 space-y-4 rounded-2xl">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-y-2">
        <div class="text-2xl lg:text-[40px] font-bold">{{ t('market.default.tab[0].title') }}</div>
        <NInput v-model:value="searchValue" :placeholder="t('market.searchValue')" @input="pagination.current = 1">
          <template #prefix>
            <div class="flex items-center justify-center text-black">
              <NIcon class="text-2xl">
                <Search24Regular />
              </NIcon>
            </div>
          </template>
        </NInput>
      </div>
      <Coin v-for="item of coinData" :key="item.instId" :coin="item" show-stock />
      <div class="flex justify-end">
        <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
      </div>
    </div>
    <div v-show="currentTab === 'trading'" class="p-4 border border-slate-200 space-y-4 rounded-2xl">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-y-2">
        <div class="text-2xl lg:text-[40px] font-bold">{{ t('market.default.tab[1].title') }}</div>
        <NInput v-model:value="searchValue" :placeholder="t('market.searchValue')" @input="pagination.current = 1">
          <template #prefix>
            <div class="flex items-center justify-center text-black">
              <NIcon class="text-2xl">
                <Search24Regular />
              </NIcon>
            </div>
          </template>
        </NInput>
      </div>
      <Coin v-for="item of coinData" :key="item.instId" :coin="item" show-stock />
      <div class="flex justify-end">
        <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
      </div>
    </div>
    <div v-show="currentTab === 'self'" class="p-4 border border-slate-200 space-y-4 rounded-2xl">
      <template v-if="selfChoiceList.length > 0">
        <!-- 显示自选列表 -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-y-2">
          <div class="text-2xl lg:text-[40px] font-bold">{{ t('market.default.tab[2].title') }}</div>
          <NInput v-model:value="searchValue" :placeholder="t('market.searchValue')" @input="pagination.current = 1">
            <template #prefix>
              <div class="flex items-center justify-center text-black">
                <NIcon class="text-2xl">
                  <Search24Regular />
                </NIcon>
              </div>
            </template>
          </NInput>
        </div>
        <Coin v-for="item of coinData" :key="item.instId" :coin="item" show-stock />
        <div class="flex justify-end">
          <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
        </div>
      </template>

      <template v-else>
        <div class="text-[40px] font-bold">{{ t('market.default.tab[2].title') }}</div>
        <!-- 显示默认推荐列表 -->
        <NTabs animated default-value="stock">
          <NTabPane name="stock" tab="现货">
            <NCheckboxGroup v-model:value="checkedSelfList" class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              <NCheckbox
                v-for="item of sortedByLastPriceCoinList.topThree"
                :key="item.instId"
                class="border border-slate-200 bg-slate-100 rounded-md flex p-4 items-center gap-y-2"
                :value="item.instId"
              >
                <img class="size-8 lg:size-[50px]" :src="item.image" />
                <div class="text-sm lg:text-2xl font-bold">{{ item.instId.replace('USDT', '') }}</div>
                <div class="text-xs lg:text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
                <div
                  class="text-xs lg:text-sm"
                  :style="{
                    color: item.change24h > 0 ? '#5ac820' : 'red',
                  }"
                >
                  {{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
                </div>
              </NCheckbox>
            </NCheckboxGroup></NTabPane
          >
          <NTabPane name="trading" tab="合约">
            <NCheckboxGroup v-model:value="checkedSelfList" class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              <NCheckbox
                v-for="item of sortedByLastPriceCoinList.topThree"
                :key="item.instId"
                class="border border-slate-200 bg-slate-100 rounded-md flex p-4 items-center gap-y-2"
                :value="item.instId"
              >
                <img class="size-8 lg:size-[50px]" :src="item.image" />
                <div class="text-sm lg:text-2xl font-bold">{{ item.instId.replace('USDT', '') }}</div>
                <div class="text-xs lg:text-sm text-slate-700">${{ item.lastPrice.toFixed(5) }}</div>
                <div
                  class="text-xs lg:text-sm"
                  :style="{
                    color: item.change24h > 0 ? '#5ac820' : 'red',
                  }"
                >
                  {{ `${item.change24h > 0 ? '+' : ''}${item.priceChangePercent}%` }}
                </div>
              </NCheckbox>
            </NCheckboxGroup></NTabPane
          >
        </NTabs>

        <div
          @click="addToFavorites"
          class="w-60 py-4 border border-green-200 bg-green-50 flex items-center justify-center gap-x-2 cursor-pointer"
        >
          <NIcon class="text-2xl">
            <AddCircle16Regular />
          </NIcon>
          <span>{{ t('market.default.addSelf') }}</span>
        </div>
      </template>
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
.tab-item {
  background-color: #f0f4f8; /* 默认背景颜色 */
  color: #4a5568; /* 默认文本颜色 */
  width: 10rem;
  padding: 0.5rem;
  text-align: center;
  border-radius: 9999px; /* 圆角 */
  border: 2px solid transparent; /* 默认无边框 */
  transition: all 0.3s ease; /* 过渡效果 */
  cursor: pointer;
}

.tab-item:hover {
  background-color: #e2e8f0; /* 悬停背景色 */
}

.active-tab {
  background-color: #5ac820; /* 选中状态背景色 */
  color: #ffffff; /* 选中状态文本色 */
  border-color: #5ac820; /* 选中状态边框色 */
}

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
