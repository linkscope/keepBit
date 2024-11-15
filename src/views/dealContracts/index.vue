<script setup>
import { NTable, NTabs, NTabPane, NButton, NPagination, NModal, NPopconfirm, useMessage, NInput, NIcon } from 'naive-ui'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs' // 使用 dayjs 库处理日期
import duration from 'dayjs/plugin/duration'
import { Search24Regular } from '@vicons/fluent'
import { useRouter } from 'vue-router'

dayjs.extend(duration)
const { t } = useI18n()
const pagination = ref({ current: 1, count: 1, pageSize: 9 })
const showModal = ref(false)
const orderDetails = ref([]) // 订单详情列表
const executingMissions = ref([]) // 执行中任务列表
const stoppedMissions = ref([]) // 已停止任务列表
const message = useMessage()
const router = useRouter()
const currentTab = ref('run')

const searchValue = ref('')
const missionsData = computed(() => {
  const dataSource = currentTab.value === 'run' ? executingMissions.value : stoppedMissions.value;

  // 过滤搜索关键词
  const filteredData = dataSource.filter((mission) =>
      mission.TacticsName.toLowerCase().includes(searchValue.value.toLowerCase())
  );

  // 分页逻辑
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;

  // 更新分页总数
  pagination.value.count = Math.ceil(filteredData.length / pagination.value.pageSize);

  return filteredData.slice(start, end);
});

// 停止任务的函数
async function endMission(appsId) {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      message.warning('请先登录')
      await router.push('/login')
      return
    }
    const response = await axios.post(
      'https://test.keepbit.top/app_api/v1/DemoTrading/StopContract',
      { ContractId: appsId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    if (response.data.Success) {
      message.success(t('message.finishSuccess'))
      executingMissions.value = executingMissions.value.filter((mission) => mission.MissionId !== appsId)
    } else {
      message.error(response.data.ErrMsg)
    }
  } catch (error) {
    message.error(error)
  }
}

// 获取订单详情函数
async function getOrderDetails(missionId) {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      message.warning('请先登录')
      await router.push('/login')
      return
    }
    const response = await axios.get(
      `https://test.keepbit.top/app_api/v1/DemoTrading/GetOrders?contractId=${missionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (response.data.Success) {
      orderDetails.value = response.data.ResData
      showModal.value = true
    } else {
      message.error(response.data.ErrMsg)
    }
  } catch (error) {
    message.error(error)
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      message.warning('请先登录');
      await router.push('/login');
      return;
    }

    const response = await axios.get('https://test.keepbit.top/app_api/v1/DemoTrading/GetMyContracts', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.Success) {
      const missions = response.data.ResData;

      missions.forEach((mission) => {
        const createTime = dayjs(mission.CreateTime);
        if (mission.State === 1) {
          mission.runDuration = dayjs().subtract(8, 'hour').diff(createTime); // 执行中
        } else if (mission.State === 2) {
          const stopTime = dayjs(mission.StopTime);
          mission.runDuration = stopTime.diff(createTime); // 已停止
        }
      });

      executingMissions.value = missions.filter((mission) => mission.State === 1);
      stoppedMissions.value = missions.filter((mission) => mission.State === 2);
    } else {
      message.error(response.data.ErrMsg);
    }
  } catch (error) {
    message.error(error);
  }
});
// 格式化运行时长
function formatDuration(ms, t) {
  const duration = dayjs.duration(ms)
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()

  // Use t() to get the translation for each unit
  const dayLabel = t('deal.days')  // Translation key for 'days'
  const hourLabel = t('deal.hours') // Translation key for 'hours'
  const minuteLabel = t('deal.minutes') // Translation key for 'minutes'

  return `${days}${dayLabel}${hours}${hourLabel}${minutes}${minuteLabel}`
}

function handleTabChange() {
  pagination.value.current = 1; // 切换标签时重置分页
}
</script>

<template>
  <div class="lg:w-[1280px] mx-auto p-4 lg:py-32 space-y-8">
    <!-- 页面标题和说明 -->
    <div class="space-y-4">
      <div class="flex items-center gap-x-8">
        <img class="size-16" src="/group.png" />
        <div class="text-4xl lg:text-[64px] font-bold">{{ t('dealContracts.title') }}</div>
      </div>
      <div class="flex items-center text-sm lg:text-2xl gap-x-8">
        <span>{{ t('dealContracts.subtitle[0]') }}</span>
        <span>|</span>
        <span>{{ t('dealContracts.subtitle[1]') }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-y-4 lg:flex-row lg:items-center justify-between">
      <div class="text-xl lg:text-[40px] font-bold">{{ t('dealContracts.order') }}</div>
      <NInput v-model:value="searchValue" :placeholder="t('dealContracts.searchOrders')" @input="pagination.value.current = 1">
        <template #prefix>
          <div class="flex items-center justify-center text-black">
            <NIcon class="text-2xl">
              <Search24Regular />
            </NIcon>
          </div>
        </template>
      </NInput>
    </div>

    <!-- 标签栏：执行中和已停止 -->
    <NTabs v-model:value="currentTab" @update:value="handleTabChange" animated>
      <!-- 执行中模块 -->
      <NTabPane name="run" :tab="t('dealContracts.tabs[0]')">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4 p-4">
          <div v-for="mission in missionsData" :key="mission.MissionId" class="py-4 px-8 border shadow-md rounded-xl">
            <div class="pb-4 border-b border-b-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.TacticsName }}</div>
                <div class="bg-[#76e43b] text-xs text-white py-1 px-2">{{ t('dealContracts.tabs[0]') }}</div>
              </div>
              <div class="text-sm">{{ t('dealContracts.runtime') }}：{{ formatDuration(mission.runDuration, t) }}</div>
            </div>
            <div class="py-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.Symbol_Name }}</div>
                <NPopconfirm @positive-click="endMission(mission.MissionId)">
                  <template #trigger>
                    <NButton
                      class="bg-green-100 border py-2 px-4 rounded-full"
                      :theme-overrides="{ border: '1px solid rgb(74,222,128)' }"
                    >
                      {{ t('dealContracts.endStrategy') }}
                    </NButton>
                  </template>
                  {{ t('dealContracts.endStrategyQuestion') }}
                </NPopconfirm>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.unrealizedGain') }}</div>
                <div
                  :class="{ 'text-red-500': mission.FloatingProfit < 0, 'text-green-500': mission.FloatingProfit >= 0 }"
                >
                  {{ mission.FloatingProfit || 0 }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.totalInvest') }}</div>
                <div>{{ mission.TotalInvest }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.profit') }}</div>
                <div :class="{ 'text-red-500': mission.Profit < 0, 'text-green-500': mission.Profit >= 0 }">
                  {{ mission.Profit }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.filledCount') }}</div>
                <div>{{ mission.FilledCount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.openPrice') }}</div>
                <div>{{ mission.OpenPrice || 0 }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.profitRate') }}</div>
                <div :class="{ 'text-red-500': mission.Profit < 0, 'text-green-500': mission.Profit >= 0 }">
                  {{ mission.ProfitRate }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.filledTotalAmount') }}</div>
                <div>{{ mission.FilledTotalAmount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.qty') }}</div>
                <div>{{ mission.Qty }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.direction') }}</div>
                <div>{{ mission.Direction || '---' }}</div>
              </div>
            </div>
            <div class="pt-4 flex items-center justify-end gap-x-4">
              <NButton
                class="bg-black text-white font-bold rounded-full w-24"
                @click="getOrderDetails(mission.MissionId)"
                >{{ t('dealContracts.showDetail') }}
              </NButton>
            </div>
          </div>
        </div>
      </NTabPane>

      <!-- 已停止模块 -->
      <NTabPane name="stop" :tab="t('dealContracts.tabs[1]')">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4 p-4">
          <div v-for="mission in missionsData" :key="mission.MissionId" class="py-4 px-8 border shadow-md rounded-xl">
            <div class="pb-4 border-b border-b-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.TacticsName }}</div>
                <div class="bg-rose-500 text-xs text-white py-1 px-2">{{ t('dealContracts.tabs[1]') }}</div>
              </div>
              <div class="text-sm">{{ t('dealContracts.runtime') }}：{{ formatDuration(mission.runDuration, t) }}</div>
            </div>
            <div class="py-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.Symbol_Name }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.unrealizedGain') }}</div>
                <div
                  :class="{ 'text-red-500': mission.FloatingProfit < 0, 'text-green-500': mission.FloatingProfit >= 0 }"
                >
                  {{ mission.FloatingProfit || 0 }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.totalInvest') }}</div>
                <div>{{ mission.TotalInvest }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.profit') }}</div>
                <div :class="{ 'text-red-500': mission.Profit < 0, 'text-green-500': mission.Profit >= 0 }">
                  {{ mission.Profit }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.filledCount') }}</div>
                <div>{{ mission.FilledCount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.openPrice') }}</div>
                <div>{{ mission.OpenPrice || 0 }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.profitRate') }}</div>
                <div :class="{ 'text-red-500': mission.Profit < 0, 'text-green-500': mission.Profit >= 0 }">
                  {{ mission.ProfitRate }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.filledTotalAmount') }}</div>
                <div>{{ mission.FilledTotalAmount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.qty') }}</div>
                <div>{{ mission.Qty }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">{{ t('dealContracts.direction') }}</div>
                <div>{{ mission.Direction || '---' }}</div>
              </div>
            </div>
            <div class="pt-4 flex items-center justify-end gap-x-4">
              <NButton
                class="bg-black text-white font-bold rounded-full w-24"
                @click="getOrderDetails(mission.MissionId)"
                >{{ t('dealContracts.showDetail') }}
              </NButton>
            </div>
          </div>
        </div>
      </NTabPane>
    </NTabs>
    <div class="flex justify-end">
      <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
    </div>
  </div>

  <!-- 明细模态框 -->
  <NModal v-model:show="showModal">
    <div class="bg-white rounded-2xl p-4 w-full overflow-x-auto lg:w-[1000px]">
      <NTable>
        <thead>
        <tr>
          <th>{{ t('dealContracts.symbol') }}</th>
          <th>{{ t('dealContracts.tradeTime') }}</th>
          <th>{{ t('dealContracts.direction') }}</th>
          <th>{{ t('dealContracts.orderType') }}</th>
          <th>{{ t('dealContracts.filledAmount') }}</th>
          <th>{{ t('dealContracts.filledPrice') }}</th>
          <th>{{ t('dealContracts.fee') }}</th>
          <th>{{ t('dealContracts.profit') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(order, index) in orderDetails" :key="index">
          <td>{{ order.Symbol }}</td>
          <td>{{ order.Create_time }}</td>
          <td
              :style="{
              color: parseFloat(order.Pnl) > 0 ? 'green' : parseFloat(order.Pnl) < 0 ? 'red' : 'black',
            }"
          >
            {{
              order.Td_mode === 'open_long'
                  ? t('dealContracts.openLong')
                  : order.Td_mode === 'close_long'
                      ? t('dealContracts.closeLong')
                      : order.Td_mode === 'open_short'
                          ? t('dealContracts.openShort')
                          : order.Td_mode === 'close_short'
                              ? t('dealContracts.closeShort')
                              : order.Td_mode
            }}
          </td>
          <td>
            {{ order.Ord_type === 'Market' ? t('dealContracts.market') : order.Ord_type === 'Limit' ? t('dealContracts.limit') : order.Ord_type }}
          </td>
          <td>{{ order.Filled }}</td>
          <td>{{ order.Average }}</td>
          <td>{{ order.Fee }} {{ order.Fee_ccy }}</td>
          <td
              :style="{
              color: parseFloat(order.Pnl) > 0 ? 'green' : parseFloat(order.Pnl) < 0 ? 'red' : 'black',
            }"
          >
            {{ order.Pnl }}
          </td>
        </tr>
        </tbody>
      </NTable>
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
