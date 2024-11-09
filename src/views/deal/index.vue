<script setup>
import { NTable, NTabs, NTabPane, NButton, NPagination, NModal, NPopconfirm } from 'naive-ui'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs' // 使用 dayjs 库处理日期
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const pagination = ref({ current: 1, count: 1 })
const showModal = ref(false)
const orderDetails = ref([]) // 订单详情列表
const executingMissions = ref([]) // 执行中任务列表
const stoppedMissions = ref([])   // 已停止任务列表

// 停止任务的函数
async function endMission(appsId) {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A' // 请替换为实际的token
    const response = await axios.post('https://test.keepbit.top/app_api/v1/Trade/StopMission',
        {appsid: appsId},
        {headers: {Authorization: `Bearer ${token}`}}
    )

    if (response.data.Success) {
      console.log('任务已成功停止')
      executingMissions.value = executingMissions.value.filter(mission => mission.MissionId !== appsId)
    } else {
      console.error('错误信息:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('API 请求失败:', error)
  }
}

// 平仓函数
async function closePosition(contractId) {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A' // 请替换为实际的token
    const response = await axios.post('https://test.keepbit.top/app_api/v1/Trade/ClosePosition',
        {ContractId: contractId},
        {headers: {Authorization: `Bearer ${token}`}}
    )

    if (response.data.Success) {
      console.log('仓位已成功关闭')
    } else {
      console.error('错误信息:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('API 请求失败:', error)
  }
}

// 获取订单详情函数
async function getOrderDetails(missionId) {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A' // 请替换为实际的token
    const response = await axios.get(`https://test.keepbit.top/app_api/v1/Trade/GetOrders?missionId=${missionId}`, {
      headers: {Authorization: `Bearer ${token}`}
    })

    if (response.data.Success) {
      orderDetails.value = response.data.ResData
      showModal.value = true
    } else {
      console.error('错误信息:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('API 请求失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTEyMTIzNywiZXhwIjoxNzMxMjA3NjM3LCJpYXQiOjE3MzExMjEyMzd9.nbfE5OBuHPV474ADOihT-HI-0lghuJ3wBjVRsZ6Ce3A' // 请替换为实际的token
    const response = await axios.get('https://test.keepbit.top/app_api/v1/Trade/GetMyMissions', {
      headers: {Authorization: `Bearer ${token}`}
    })

    if (response.data.Success) {
      const missions = response.data.ResData
      missions.forEach(mission => {
        const createTime = dayjs(mission.CreateTime)
        if (mission.State === 1) { // 执行中
          const currentTime = dayjs()
          mission.runDuration = currentTime.subtract(8, 'hour').diff(createTime)
        } else if (mission.State === 2) { // 已停止
          const stopTime = dayjs(mission.StopTime)
          mission.runDuration = stopTime.diff(createTime)
        }
      })

      executingMissions.value = missions.filter(mission => mission.State === 1)
      stoppedMissions.value = missions.filter(mission => mission.State === 2)
    } else {
      console.error('错误信息:', response.data.ErrMsg)
    }
  } catch (error) {
    console.error('API 请求失败:', error)
  }
})

// 格式化运行时长
function formatDuration(ms) {
  const duration = dayjs.duration(ms)
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  return `${days}日${hours}时${minutes}分`
}
</script>

<template>
  <div class="lg:w-[1280px] mx-auto p-4 lg:py-32 space-y-8">
    <!-- 页面标题和说明 -->
    <div class="space-y-4">
      <div class="flex items-center gap-x-8">
        <img class="size-16" src="/group.png"/>
        <div class="text-4xl lg:text-[64px] font-bold">AI量化交易</div>
      </div>
      <div class="flex items-center text-sm lg:text-2xl gap-x-8">
        <span>捕捉市场信号</span>
        <span>|</span>
        <span>复制高手收益</span>
      </div>
    </div>
    <div class="text-[40px] font-bold">交易订单</div>

    <!-- 标签栏：执行中和已停止 -->
    <NTabs default-value="run" animated>
      <!-- 执行中模块 -->
      <NTabPane name="run" tab="执行中">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4 p-4">
          <div v-for="mission in executingMissions" :key="mission.MissionId"
               class="py-4 px-8 border shadow-md rounded-xl">
            <div class="pb-4 border-b border-b-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.TacticsName }}</div>
                <div class="bg-[#76e43b] text-xs text-white py-1 px-2">执行中</div>
              </div>
              <div class="text-sm">运行时长：{{ formatDuration(mission.runDuration) }}</div>
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
                      结束策略
                    </NButton>
                  </template>
                  确定要结束该策略吗？
                </NPopconfirm>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">未实现收益</div>
                <div class="text-rose-500">{{ mission.FloatingProfit }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">总投入金额</div>
                <div>{{ mission.TotalInvest }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">已实现收益</div>
                <div>{{ mission.Profit }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易笔数</div>
                <div>{{ mission.FilledCount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓成本</div>
                <div>{{ mission.OpenPrice }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">收益率</div>
                <div class="text-green-500">{{ mission.ProfitRate }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易总额</div>
                <div>{{ mission.FilledTotalAmount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">当前仓位</div>
                <div>{{ mission.Qty }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓方向</div>
                <div class="text-rose-500">{{ mission.Direction }}</div>
              </div>
            </div>
            <div class="pt-4 flex items-center justify-end gap-x-4">
              <NPopconfirm @positive-click="closePosition(mission.ContractId)">
                <template #trigger>
                  <NButton class="bg-[#76e43b] text-white font-bold rounded-full w-24">平仓</NButton>
                </template>
                确定是否手动清仓(手动会影响策略收益率)
              </NPopconfirm>
              <NButton class="bg-black text-white font-bold rounded-full w-24"
                       @click="getOrderDetails(mission.MissionId)">查看明细
              </NButton>
            </div>
          </div>
        </div>
      </NTabPane>

      <!-- 已停止模块 -->
      <NTabPane name="stop" tab="已停止">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4 p-4">
          <div v-for="mission in stoppedMissions" :key="mission.MissionId"
               class="py-4 px-8 border shadow-md rounded-xl">
            <div class="pb-4 border-b border-b-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.TacticsName }}</div>
                <div class="bg-rose-500 text-xs text-white py-1 px-2">已停止</div>
              </div>
              <div class="text-sm">运行时长：{{ formatDuration(mission.runDuration) }}</div>
            </div>
            <div class="py-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ mission.Symbol_Name }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">未实现收益</div>
                <div class="text-rose-500">{{ mission.FloatingProfit }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">总投入金额</div>
                <div>{{ mission.TotalInvest }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">已实现收益</div>
                <div>{{ mission.Profit }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易笔数</div>
                <div>{{ mission.FilledCount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓成本</div>
                <div>{{ mission.OpenPrice }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">收益率</div>
                <div class="text-green-500">{{ mission.ProfitRate }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易总额</div>
                <div>{{ mission.FilledTotalAmount }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">当前仓位</div>
                <div>{{ mission.Qty }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓方向</div>
                <div class="text-rose-500">{{ mission.Direction }}</div>
              </div>
            </div>
            <div class="pt-4 flex items-center justify-end gap-x-4">
              <NButton class="bg-black text-white font-bold rounded-full w-24"
                       @click="getOrderDetails(mission.MissionId)">查看明细
              </NButton>
            </div>
          </div>
        </div>
      </NTabPane>
    </NTabs>
    <div class="flex justify-end">
      <NPagination v-model:page="pagination.current" :page-count="pagination.count"/>
    </div>
  </div>

  <!-- 明细模态框 -->
  <NModal v-model:show="showModal">
    <div class="bg-white rounded-2xl p-4 w-full overflow-x-auto lg:w-[800px]">
      <NTable>
        <thead>
        <tr>
          <th>交易对</th>
          <th>交易时间</th>
          <th>方向</th>
          <th>订单类型</th>
          <th>成交数量</th>
          <th>成交价格</th>
          <th>手续费</th>
          <th>利润</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(order, index) in orderDetails" :key="index">
          <td>{{ order.Symbol }}</td>
          <td>{{ order.Create_time }}</td>
          <td>{{ order.Side }}</td>
          <td>{{ order.Ord_type }}</td>
          <td>{{ order.Filled }}</td>
          <td>{{ order.Average }}</td>
          <td>{{ order.Fee }} {{ order.Fee_ccy }}</td>
          <td>{{ order.Pnl }}</td>
        </tr>
        </tbody>
      </NTable>
    </div>
  </NModal>
</template>
