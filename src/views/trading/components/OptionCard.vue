<script setup>
import {
  NButton,
  NInput,
  NInputNumber,
  NModal,
  NPopconfirm,
  NPopselect,
  NRadio,
  NRadioGroup,
  NSelect,
  NSlider,
  NTabPane,
  NTabs,
  NIcon,
  useMessage
} from 'naive-ui'
import { CaretDown16Filled } from '@vicons/fluent'
import { ref, inject  } from 'vue'

const optionType = ref('open')
const positionType = ref('crossed')
const factor = ref(20)

const available = inject('available'); // 接收 available 值
const coinSymbol = inject('coinSymbol');
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzeXN0ZW0iLCJpc3MiOiJLZWVwQml0VGVhY2giLCJVc2VyTmFtZSI6IjM3OTY5NjY3IiwiVXNlcklkIjoiMTg0MzIyNzc1OTcxMjY3MjYiLCJUZW5hbnRJZCI6IjkyNDI3NzIxMjk1NzkwNzciLCJzdWIiOiJwYXNzd29yZCIsIm5iZiI6MTczMTQ3NTgzNywiZXhwIjoxNzMxNTYyMjM3LCJpYXQiOjE3MzE0NzU4Mzd9.rVtOjnqmV716ssbZcYPl9FhA2H8yZkKT6qn0vHF_B68";

const message = useMessage();

const factorOptions = ref([
  {
    label: '1x',
    value: 1,
  },
  {
    label: '2x',
    value: 2,
  },
  {
    label: '3x',
    value: 3,
  },
  {
    label: '5x',
    value: 5,
  },
  {
    label: '10x',
    value: 10,
  },
  {
    label: '20x',
    value: 20,
  },
  {
    label: '30x',
    value: 30,
  },
  {
    label: '50x',
    value: 50,
  },
  {
    label: '75x',
    value: 75,
  },
  {
    label: '100x',
    value: 100,
  },
])
const commissionNum = ref('')
const chargeModal = ref(false)
const chargeType = ref('shift')
const availableAmount = ref('0.000 BCT') // 新增变量用于显示 "可用" 数量

const previousFactor = ref(factor.value)

async function switchLeverage(newFactor) {
  if (!token) {
    message.error('请先登录')
    return
  }

  const url = 'https://test.keepbit.top/app_api/v1/KrtContract/SetLeverage'
  const params = {
    Symbol: coinSymbol.value,
    Leverage: newFactor
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(params)
    })
    const result = await response.json()

    if (result.Success) {
      // 切换成功后更新当前杠杆倍数
      previousFactor.value = newFactor
      message.success('杠杆切换成功')
    } else {
      // 请求失败时恢复之前的杠杆倍数
      factor.value = previousFactor.value
      message.error(result.ErrMsg || '杠杆切换失败')
    }
  } catch (error) {
    // 请求错误时恢复之前的杠杆倍数
    factor.value = previousFactor.value
    message.error('请求出错，请稍后重试')
    console.error(error)
  }
}

// 在用户选择新杠杆倍数时调用 switchLeverage 函数
function handleFactorChange(newFactor) {
  factor.value = newFactor
  switchLeverage(newFactor)
}

async function switchMarginMode() {
  if (!token) {
    message.error('请先登录');
    return;
  }

  const newMarginMode = positionType.value === 'crossed' ? 'isolated' : 'crossed';
  const url = 'https://test.keepbit.top/app_api/v1/KrtContract/SetMarginMode';
  const params = {
    Symbol: coinSymbol.value,
    MarginMode: newMarginMode,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    const result = await response.json();

    if (result.Success) {
      // 切换成功后更新当前模式
      positionType.value = positionType.value === 'crossed' ? 'position' : 'crossed';
      message.success('保证金模式切换成功');
    } else {
      message.error(result.ErrMsg || '切换保证金模式失败');
    }
  } catch (error) {
    message.error('请求出错，请稍后重试');
    console.error(error);
  }
}
</script>

<template>
  <div class="lg:w-[300px] p-4 space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <NButton :type="optionType === 'open' ? 'primary' : 'default'" @click="optionType = 'open'">开仓</NButton>
      <NButton :type="optionType === 'close' ? 'primary' : 'default'" @click="optionType = 'close'">平仓</NButton>
      <NPopconfirm @positive-click="switchMarginMode">
        <template #trigger>
          <NButton>{{ positionType === 'crossed' ? '全仓' : '逐仓' }}</NButton>
        </template>
        {{
          positionType === 'crossed'
              ? '切换为逐仓模式：每个仓位独立计算风险，仅使用该仓位的保证金进行风险控制。'
              : '切换为全仓模式：账户内的所有可用资金承担风险，以减少爆仓风险'
        }}
      </NPopconfirm>
      <NPopselect :options="factorOptions" trigger="click" @update:value="handleFactorChange">
        <NButton :type="optionType === 'factor' ? 'primary' : 'default'" @click="optionType = 'factor'">
          <div class="flex items-center gap-x-2">
            {{ factor }}X
            <NIcon>
              <CaretDown16Filled />
            </NIcon>
          </div>
        </NButton>
      </NPopselect>
    </div>
    <NTabs
      default-value="limit"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <NTabPane name="limit" tab="限价单">
        <div class="text-xs space-y-4">
          <div class="font-bold">委托价格(USDT)</div>
          <NInput size="small" placeholder="输入委托价格" />
          <div class="font-bold">委托数量</div>
          <NInput v-model:value="commissionNum" size="small" placeholder="输入委托数量" />
          <div class="font-bold">≈ 0.00 USDT</div>
          <NSlider
            v-model:value="commissionNum"
            :marks="{
              0: '0%',
              25: '25%',
              50: '50%',
              75: '75%',
              100: '100%',
            }"
            :step="1"
            :format-tooltip="(v) => `${v}%`"
          />
          <div class="flex gap-x-2 pt-4">
            <NButton class="flex-1" type="primary">{{ optionType === 'close' ? '开多' : '平空' }}</NButton>
            <NButton class="flex-1 bg-rose-500 text-white">{{ optionType === 'close' ? '开空' : '平多' }}</NButton>
          </div>
        </div>
      </NTabPane>
      <NTabPane name="market" tab="市价单">
        <div class="font-bold">委托价格(USDT)</div>
        <NInput size="small" placeholder="输入市价" />
        <div class="font-bold">委托数量</div>
        <NInput v-model:value="commissionNum" size="small" placeholder="输入委托数量" />
        <div class="font-bold">≈ 0.00 USDT</div>
        <NSlider
          v-model:value="commissionNum"
          :marks="{
            0: '0%',
            25: '25%',
            50: '50%',
            75: '75%',
            100: '100%',
          }"
          :step="1"
          :format-tooltip="(v) => `${v}%`"
        />
        <div class="flex gap-x-2 pt-4">
          <NButton class="flex-1" type="primary">{{ optionType === 'close' ? '开多' : '平空' }}</NButton>
          <NButton class="flex-1 bg-rose-500 text-white">{{ optionType === 'close' ? '开空' : '平多' }}</NButton>
        </div>
      </NTabPane>
    </NTabs>
    <div class="p-4 grid grid-cols-2 bg-slate-100 rounded-xl gap-2 text-xs">
      <template v-if="optionType === 'close'">
        <div>
          <div class="text-slate-400">空仓持仓</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">多仓持仓</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">可平量</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">可平量</div>
          <div>0.000 BCT</div>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="text-slate-400">可多开</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">可开空</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">保证金</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">可多开</div>
          <div>0.000 BCT</div>
        </div>
        <div>
          <div class="text-slate-400">可用</div>
          <div>{{ available }} USDT</div>
        </div>
        <div class="flex items-center" @click="chargeModal = true">充值</div>
      </template>
    </div>

    <NModal v-model:show="chargeModal">
      <div class="bg-white rounded-md w-full lg:w-[600px]">
        <div class="p-4 flex items-center justify-between">
          <div class="font-bold">选择充币方式</div>
          <img class="size-4" src="/close.png" @click="chargeModal = false" />
        </div>
        <div class="p-4 space-y-4">
          <NRadioGroup v-model:value="chargeType">
            <NRadio value="shift">从链上钱包或交易所转入数字货币</NRadio>
            <NRadio value="account">在资金账户和交易账户之间转移数字货币</NRadio>
          </NRadioGroup>
          <template v-if="chargeType === 'shift'">
            <div class="flex items-center gap-x-4">
              <img class="size-6" src="/usdt.png" />
              USDT
            </div>
            <NSelect placeholder="选择网络" :options="[{ label: 'USDT-TRC20', value: 'USDT' }]" />
            <div>提示：选择与提币平台一致的网络进行充值,否则您将会遗失这笔资金.</div>
            <img class="size-32" src="/download_qrcode.png" />
            <div>充币地址：TQBwB9sa7iUzS28M82WZvDsVf5NuMaexfa</div>
            <div>充值至：资金账户</div>
            <div class="text-slate-500">您只能向此地址充值入USDT-TRC20, 充值入其他资产将无法退回。</div>
          </template>
          <template v-else>
            <div>从：资金账户</div>
            <div>到：合约账户</div>
            <div>资产：USDT</div>
            <NInputNumber placeholder="数量" clearable />
          </template>
          <div class="flex justify-end">
            <NButton type="primary">确定</NButton>
          </div>
        </div>
      </div>
    </NModal>
  </div>
</template>
