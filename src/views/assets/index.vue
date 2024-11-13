<script setup>
import { useMessage, NIcon } from 'naive-ui'
import { Eye16Regular, EyeOff16Regular } from '@vicons/fluent'
import * as echarts from 'echarts'
import { pieChartOption } from './model.js'
import { useRouter } from 'vue-router'

const message = useMessage()
const router = useRouter()
const assetsInfo = ref(null)
const showAssets = ref(true)
const circleChartRef = useTemplateRef('circleChartRef')
let chart = null

watch(showAssets, (val) => {
  if (!val && chart) {
    chart.setOption(pieChartOption(assetsInfo.value, false))
  } else if (val && chart) {
    chart.setOption(pieChartOption(assetsInfo.value))
  }
})

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    message.warning('请先登录')
    await router.push('/login')
    return
  }
  const response = await fetch('https://test.keepbit.top/app_api/v1/User/GetMyAccountAssets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  if (!data.Success) {
    message.error('获取资产信息失败，请刷新重试')
    return
  }

  assetsInfo.value = data.ResData
  chart = echarts.init(circleChartRef.value)
  chart.setOption(pieChartOption(data.ResData))
})
</script>

<template>
  <div class="lg:w-[1280px] my-8 mx-4 lg:mx-auto space-y-4">
    <div class="text-2xl font-bold">资产总览</div>
    <div class="border border-slate-200 rounded-xl p-4 space-y-4">
      <div class="flex items-center gap-x-2 text-lg">
        总资产估值
        <NIcon>
          <Eye16Regular v-if="showAssets" @click="showAssets = false" />
          <EyeOff16Regular v-else @click="showAssets = true" />
        </NIcon>
      </div>
      <div class="space-x-2">
        <span class="text-3xl font-bold">{{ showAssets ? assetsInfo?.Total : '*****' }}</span>
        <span class="text-sm">{{ showAssets ? assetsInfo?.Asset : '' }}</span>
      </div>
      <div class="text-sm text-slate-500">{{ showAssets ? `≈$${Math.round(assetsInfo?.Total)}` : '*****' }}</div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="lg:flex-1 border border-slate-200 rounded-xl h-[130px] px-2 lg:px-8 flex items-center gap-x-4">
        <img class="size-16" src="https://sto.aibit.com/fe-static/web-pc-uc/_nuxt/digital-assets-dark.74176ad3.png" />
        <div class="flex-1 space-y-2">
          <div class="text-xl font-bold">充值数字资产</div>
          <div class="text-sm text-slate-500">通过充值存入属于自己的账户</div>
        </div>
        <div class="text-green-500 text-2xl">-></div>
      </div>
      <div class="lg:flex-1 border border-slate-200 rounded-xl h-[130px] px-2 lg:px-8 flex items-center gap-x-4">
        <img class="size-16" src="/buy_crypto.png" />
        <div class="flex-1 space-y-2">
          <div class="text-xl font-bold">充值数字资产</div>
          <div class="text-sm text-slate-500">通过充值存入属于自己的账户</div>
        </div>
        <div class="text-green-500 text-2xl">-></div>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-[2] border border-slate-200 rounded-xl p-4 space-y-4">
        <div class="text-xl font-bold">资产分布</div>
        <div class="flex items-center text-slate-500 text-sm">
          <div class="flex-1">钱包</div>
          <div class="flex-1">资产估值</div>
          <div class="flex-1 text-right">操作</div>
        </div>
        <div class="flex items-center bg-gray-700 rounded-md px-2 py-4 text-xs lg:text-lg text-white">
          <div class="flex-1 flex gap-x-2 items-center">
            <img class="size-4 lg:size-6" src="/wallet_account.svg" />
            <div>资金账户</div>
          </div>
          <div class="flex-1">{{ showAssets ? assetsInfo?.Assets : '****' }}</div>
          <div class="flex-1 text-right">...</div>
        </div>
        <div class="flex items-center bg-gray-700 rounded-md px-2 py-4 text-xs lg:text-lg text-white">
          <div class="flex-1 flex gap-x-2 items-center">
            <img class="size-4 lg:size-6" src="/demo_account.svg" />
            <div>合约账户</div>
          </div>
          <div class="flex-1">{{ showAssets ? assetsInfo?.Contract : '****' }}</div>
          <div class="flex-1 text-right">...</div>
        </div>
        <div class="flex items-center bg-gray-700 rounded-md px-2 py-4 text-xs lg:text-lg text-white">
          <div class="flex-1 flex gap-x-2 items-center">
            <img class="size-4 lg:size-6" src="/strategy_account.svg" />
            <div>策略账户</div>
          </div>
          <div class="flex-1">{{ showAssets ? assetsInfo?.Tactic : '****' }}</div>
          <div class="flex-1 text-right">...</div>
        </div>
        <div class="flex items-center bg-gray-700 rounded-md px-2 py-4 text-xs lg:text-lg text-white">
          <div class="flex-1 flex gap-x-2 items-center">
            <img
              class="size-4 lg:size-6"
              src="https://sto.aibit.com/fe-static/web-pc-uc/_nuxt/ficon_dark.a0201c7c.svg"
            />
            <div>模拟账户</div>
          </div>
          <div class="flex-1">{{ showAssets ? assetsInfo?.Demo : '****' }}</div>
          <div class="flex-1 text-right">...</div>
        </div>
      </div>
      <div class="flex-1 border border-slate-200 rounded-xl p-4 flex flex-col">
        <div class="text-xl font-bold">分布</div>
        <div ref="circleChartRef" class="h-[300px] lg:h-auto lg:h-0 lg:flex-1 w-full" />
      </div>
    </div>
  </div>
</template>
