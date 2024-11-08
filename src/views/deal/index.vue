<script setup>
import { NTable, NTabs, NTabPane, NButton, NPagination, NModal, NPopconfirm } from 'naive-ui'

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
        <div class="text-4xl lg:text-[64px] font-bold">AI量化交易</div>
      </div>
      <div class="flex items-center text-sm lg:text-2xl gap-x-8">
        <span>捕捉市场信号</span>
        <span>|</span>
        <span>复制高手收益</span>
      </div>
    </div>
    <div class="text-[40px] font-bold">交易订单</div>
    <NTabs
      default-value="run"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <NTabPane name="run" tab="执行中">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4 p-4">
          <div
            v-for="item of 10"
            :key="item"
            class="py-4 px-8 border border-slate-200 shadow-md rounded-xl hover:scale-105 transition"
          >
            <div class="pb-4 border-b border-b-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">超级马丁-BTC-5分钟【双向】</div>
                <div class="bg-[#76e43b] text-xs text-white py-1 px-2">执行中</div>
              </div>
              <div class="text-sm">运行时长：6日4时48分</div>
            </div>
            <div class="py-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">BTCUSDT</div>
                <NPopconfirm>
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
                <div class="text-rose-500">0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">总投入金额</div>
                <div>1000</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">已实现收益</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易笔数</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓成本</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">收益率</div>
                <div class="text-green-500">0.00%</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易总额</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">当前仓位</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓方向</div>
                <div class="text-rose-500"></div>
              </div>
            </div>
            <div class="pt-4 flex items-center justify-end gap-x-4">
              <NPopconfirm>
                <template #trigger>
                  <NButton class="bg-[#76e43b] text-white font-bold rounded-full w-24">平仓</NButton>
                </template>
                确定是否手动清仓(手动会影响策略收益率)
              </NPopconfirm>
              <NButton class="bg-black text-white font-bold rounded-full w-24" @click="showModal = true"
                >查看明细</NButton
              >
            </div>
          </div>
        </div>
      </NTabPane>
      <NTabPane name="stop" tab="已停止">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4 p-4">
          <div
            v-for="item of 10"
            :key="item"
            class="py-4 px-8 border border-slate-200 shadow-md rounded-xl hover:scale-105 transition"
          >
            <div class="pb-4 border-b border-b-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">超级马丁-BTC-5分钟【双向】</div>
                <div class="bg-rose-500 text-xs text-white py-1 px-2">已停止</div>
              </div>
              <div class="text-sm">运行时长：6日4时48分</div>
            </div>
            <div class="py-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold">BTCUSDT</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">未实现收益</div>
                <div class="text-rose-500">0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">总投入金额</div>
                <div>1000</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">已实现收益</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易笔数</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓成本</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">收益率</div>
                <div class="text-green-500">0.00%</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">交易总额</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">当前仓位</div>
                <div>0</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-slate-400">持仓方向</div>
                <div class="text-rose-500"></div>
              </div>
            </div>
            <div class="pt-4 flex items-center justify-end gap-x-4">
              <NButton class="bg-black text-white font-bold rounded-full w-24" @click="showModal = true"
                >查看明细</NButton
              >
            </div>
          </div>
        </div>
      </NTabPane>
    </NTabs>
    <div class="flex justify-end">
      <NPagination v-model:page="pagination.current" :page-count="pagination.count" />
    </div>
  </div>

  <NModal v-model:show="showModal">
    <div class="bg-white rounded-2xl p-4 w-full overflow-x-auto lg:w-[800px]">
      <NTable>
        <thead>
          <tr>
            <th>交易对</th>
            <th>交易时间</th>
            <th>交易方向</th>
            <th>订单类型</th>
            <th>成交数量</th>
            <th>成交价格</th>
            <th>手续费</th>
            <th>订单利润</th>
          </tr>
        </thead>
        <tr>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
        </tr>
      </NTable>
    </div>
  </NModal>
</template>
