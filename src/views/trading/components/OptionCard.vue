<script setup>
import {
  NButton,
  NInput,
  NInputNumber,
  NModal,
  NPopconfirm,
  NPopselect,
  NSelect,
  NSlider,
  NTabPane,
  NTabs,
  NIcon,
  NCheckbox,
  useMessage,
  useDialog,
} from 'naive-ui'
import { CaretDown16Filled, ArrowSort16Regular } from '@vicons/fluent'
import { ref, inject } from 'vue'
const { t } = useI18n()
const optionType = ref('open')
const positionType = ref('crossed')
const factor = ref(20)

const available = inject('available') // 接收 available 值
const coinSymbol = inject('coinSymbol')
const token = localStorage.getItem('accessToken');
const message = useMessage()
const dialog = useDialog()

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
const cryptoChargeModal = ref(false)
const accountChargeModal = ref(false)
const chargeType = ref('shift')
const availableAmount = ref('0.000 BCT') // 新增变量用于显示 "可用" 数量
const confirmationModal = ref(false)
const previousFactor = ref(factor.value)
const selectedPrice = inject('selectedPrice') // 接收主组件传递的价格
const currentPriceType = ref('limit') // 用于模拟当前价格类型（可替换为实际逻辑）
const orderPrice = ref(null) // 用于绑定的委托价格
const sliderValue = ref(0) // 用于更新滑动条的中间值
const sliderValueMarket = ref(0) // 用于更新滑动条的中间值
// 使用inject接收来自父组件的价格
const currentOrderPrice = inject('currentOrderPrice')
// 实际委托价格
const actualOrderPrice = ref(null)
// 市价单的委托价格和委托数量
const orderPriceMarket = ref(null)
const commissionNumMarket = ref('')
const positionData = inject('positionData', [])
const emit = defineEmits(['orderSuccess'])

const selectedNetwork = ref(null);
const walletId = ref('');
const qrCodeUrl = ref('/download_qrcode.png'); // 初始二维码图片路径
const networkOptions = [{ label: 'USDT-TRC20', value: 'USDT-TRC20' }]; // 网络选项
const fromAccount = ref(t('trading.fundAccount'));
const toAccount = ref(t('trading.contractAccount'));
const asset = ref("USDT");
const transferAmount = ref(null);
const maxTransferable = ref(0); // 最大可转数量
const marketData = inject('marketData'); // Or fetch it as needed
const currentCoinDecimals = ref(0); // 用于存储当前币种的小数位数
// 存储账户余额信息
const accountData = ref({
  Assets: 0, // 资金账户余额
  Contract: 0, // 合约账户余额
});

// 获取账户余额
async function fetchAccountAssets() {
  try {
    const response = await fetch(
        "https://test.keepbit.top/app_api/v1/User/GetMyAccountAssets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
    );
    const result = await response.json();
    if (result.Success) {
      accountData.value = result.ResData;
      updateMaxTransferable();
    } else {
      message.error(result.ErrMsg || "获取账户信息失败");
    }
  } catch (error) {
    message.error("请求出错，请稍后重试");
  }
}

// 更新最大可转数量
function updateMaxTransferable() {
  maxTransferable.value =
      fromAccount.value === t('trading.fundAccount')
          ? accountData.value.Assets
          : accountData.value.Contract;
}

// 账户对调逻辑
function swapAccounts() {
  [fromAccount.value, toAccount.value] = [toAccount.value, fromAccount.value];
  updateMaxTransferable();
}

// 提交划转
async function submitTransfer() {
  if (!transferAmount.value || transferAmount.value <= 0) {
    message.error("请输入有效的转账金额");
    return;
  }
  const transferQty = transferAmount.value;

  // 判断划转方向并设置 API URL 和请求体
  const isFromContractToAssets = fromAccount.value === t('trading.contractAccount') && toAccount.value === t('trading.fundAccount');
  const apiUrl = isFromContractToAssets
      ? "https://test.keepbit.top/app_api/v1/KrtContract/TransferSpot"
      : "https://test.keepbit.top/app_api/v1/KrtContract/TransferContract";
  const requestData = { Qty: transferQty };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    const result = await response.json();

    if (result.Success) {
      message.success("划转成功");
      // 重新获取账户信息
      fetchAccountAssets();
      accountChargeModal.value = false;
    } else {
      message.error(result.ErrMsg || "划转失败");
    }
  } catch (error) {
    message.error("请求出错，请稍后重试");
  }
}

// 监听弹窗显示时触发请求
watch(accountChargeModal, (newVal) => {
  if (newVal) {
    fetchAccountAssets();
  }
});

// 处理网络选择
function handleNetworkSelect() {
  if (!selectedNetwork.value) return;

  fetchUserInfo();
}

// 获取用户信息并更新充币地址和二维码
async function fetchUserInfo() {
  try {
    const response = await fetch('https://test.keepbit.top/app_api/v1/User/GetMyInfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (data.Success) {
      walletId.value = data.ResData.walletid; // 填充walletid到充币地址
      qrCodeUrl.value = generateQRCodeUrl(walletId.value); // 根据walletid生成二维码
    } else {
      message.error(data.ErrMsg || '获取用户信息失败');
    }
  } catch (error) {
    console.error('请求出错:', error);
    message.error('请求出错，请稍后重试');
  }
}

// 生成二维码链接的函数
function generateQRCodeUrl(text) {
  const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=';
  return `${baseUrl}${encodeURIComponent(text)}`;
}

watch(currentPriceType, async (newPriceType) => {
  if (newPriceType === 'market') {
    actualOrderPrice.value = currentOrderPrice.value // 设置市价为当前价格
    commissionNumMarket.value = '' // 清空委托数量
    sliderValueMarket.value = 0
  } else {
    await nextTick() // 等待 DOM 更新完成
    orderPrice.value = '' // 清空限价的委托价格
    actualOrderPrice.value = null
    sliderValue.value = 0
    commissionNum.value = '' // 清空委托数量
  }
})

nextTick(() => {
  sliderValue.value = 0
  sliderValueMarket.value = 0
})

// 监视 currentOrderPrice 和 currentPriceType，当为市价类型时，actualOrderPrice 跟随 currentOrderPrice 变化
watch([currentOrderPrice, currentPriceType], ([newPrice, priceType]) => {
  if (priceType === 'market') {
    actualOrderPrice.value = newPrice
  }
})

// 计算 "可多开数量" = 可用 * 杠杆倍数 / 使用实际或委托价格
const maxOpenAmount = computed(() => {
  const priceToUse = currentPriceType.value === 'market' ? actualOrderPrice.value : orderPrice.value
  return priceToUse && parseFloat(priceToUse) > 0
    ? (parseFloat(available.value) * parseFloat(factor.value)) / parseFloat(priceToUse)
    : 0
})

// 计算保证金=委托数量*委托价格/杠杆
const margin = computed(() => {
  let actualCommissionNum

  if (currentPriceType.value !== 'market') {
    if (commissionNum.value.endsWith('%')) {
      // 当委托数量包含百分号时，计算实际的委托数量为：可用 * 百分比 / 委托价格
      const percentage = parseFloat(commissionNum.value) / 100
      actualCommissionNum = (parseFloat(available.value) * percentage) / parseFloat(orderPrice.value)
    } else {
      // 当委托数量不包含百分号时，直接使用数值计算
      actualCommissionNum = parseFloat(commissionNum.value)
    }
    // 计算保证金
    return actualCommissionNum && orderPrice.value
      ? (actualCommissionNum * parseFloat(orderPrice.value)) / parseFloat(factor.value)
      : 0
  } else {
    if (commissionNumMarket.value.endsWith('%')) {
      // 当委托数量包含百分号时，计算实际的委托数量为：可用 * 百分比 / 委托价格
      const percentage = parseFloat(commissionNumMarket.value) / 100
      actualCommissionNum = (parseFloat(available.value) * percentage) / parseFloat(actualOrderPrice.value)
    } else {
      // 当委托数量不包含百分号时，直接使用数值计算
      actualCommissionNum = parseFloat(commissionNumMarket.value)
    }
    // 计算保证金
    return actualCommissionNum && actualOrderPrice.value
      ? (actualCommissionNum * parseFloat(actualOrderPrice.value)) / parseFloat(factor.value)
      : 0
  }
})

const approxBTCValue = computed(() => {
  let actualPrice = currentPriceType.value === 'market' ? actualOrderPrice.value : orderPrice.value;
  let actualCommission = currentPriceType.value === 'market' ? commissionNumMarket.value : commissionNum.value;

  if (actualCommission.endsWith('%')) {
    // 如果委托数量是百分比
    const percentage = parseFloat(actualCommission) / 100;
    actualCommission = (parseFloat(available.value) * percentage) / parseFloat(actualPrice);
  } else {
    // 如果委托数量是具体数值
    actualCommission = parseFloat(actualCommission);
  }

  // 根据 currentCoinDecimals 生成对应格式
  const formatValue = (value, decimals) => {
    if (decimals === 0) {
      return Math.floor(value); // 不显示小数点
    }
    return value.toFixed(decimals); // 显示指定小数位数
  };

  // 返回 BTC 的实际数量或对应小数位的占位符
  if (actualCommission) {
    return formatValue(actualCommission, currentCoinDecimals.value || 0);
  } else {
    // 如果没有值，根据小数位返回对应的占位符
    return currentCoinDecimals.value === 0 ? '0' : `0.${'0'.repeat(currentCoinDecimals.value)}`;
  }
});
// 计算 USDT 近似值
const approxUSDTValue = computed(() => {
  let actualPrice = currentPriceType.value === 'market' ? actualOrderPrice.value : orderPrice.value
  let actualCommission = currentPriceType.value === 'market' ? commissionNumMarket.value : commissionNum.value

  if (actualCommission.endsWith('%')) {
    const percentage = parseFloat(actualCommission) / 100
    actualCommission = (parseFloat(available.value) * percentage) / parseFloat(actualPrice)
  } else {
    actualCommission = parseFloat(actualCommission)
  }

  // 返回 USDT 的实际价值
  return actualPrice && actualCommission ? (parseFloat(actualPrice) * actualCommission) : '0.000'
})

watch(orderPrice, () => {
  // 此处触发 maxOpenAmount 计算，因为 orderPrice 改变时会触发 computed
  console.log('委托价格变化，重新计算可多开数量:', maxOpenAmount.value)
})

// 监视价格类型和传递过来的价格
watch([selectedPrice, currentPriceType], ([newPrice, priceType]) => {
  if (priceType !== 'market') {
    orderPrice.value = newPrice // 如果不是市价类型，赋值给 orderPrice
  }
})

async function switchLeverage(newFactor) {
  if (!token) {
    message.error('请先登录')
    return
  }

  const url = 'https://test.keepbit.top/app_api/v1/KrtContract/SetLeverage'
  const params = {
    Symbol: coinSymbol.value + 'USDT',
    Leverage: newFactor,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
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
    message.error('请先登录')
    return
  }

  const newMarginMode = positionType.value === 'crossed' ? 'isolated' : 'crossed'
  const url = 'https://test.keepbit.top/app_api/v1/KrtContract/SetMarginMode'
  const params = {
    Symbol: coinSymbol.value + "USDT",
    MarginMode: newMarginMode,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    })
    const result = await response.json()

    if (result.Success) {
      // 切换成功后更新当前模式
      positionType.value = positionType.value === 'crossed' ? 'position' : 'crossed'
      message.success('保证金模式切换成功')
    } else {
      message.error(result.ErrMsg || '切换保证金模式失败')
    }
  } catch (error) {
    message.error('请求出错，请稍后重试')
    console.error(error)
  }
}

// 监视滑块值更新委托数量
watch(sliderValue, (newValue) => {
  commissionNum.value = `${newValue}%`
})

// 监视滑块值更新委托数量
watch(sliderValueMarket, (newValue) => {
  commissionNumMarket.value = `${newValue}%`
})

// 定义获取账户信息的函数
async function fetchSymbolAccount(symbol) {
  try {
    const response = await fetch(
      `https://test.keepbit.top/app_api/v1/KrtContract/GetSymbolAccount?symbol=${symbol}USDT`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const result = await response.json()

    if (result.Success) {
      // 获取到的数据用于初始化杠杆倍数和持仓模式
      if (result.ResData.Leverage) {
        factor.value = parseInt(result.ResData.Leverage, 10)
        previousFactor.value = factor.value
      }
      if (result.ResData.MarginMode) {
        positionType.value = result.ResData.MarginMode
      }
    } else {
      console.error('获取数据失败:', result.ErrMsg)
    }
  } catch (error) {
    console.error('请求出错:', error)
  }
}

// 监听 coinSymbol 变化
watch(coinSymbol, (newSymbol) => {
  if (newSymbol) {
    if (marketData?.Contracts) {
      const symbolData = marketData.Contracts.find(
          (contract) => contract.Base_token_id === newSymbol
      );

      currentCoinDecimals.value = symbolData?.VolumePlace || 0; // 如果找不到默认为0
    }

    // 清空委托价格和数量
    orderPrice.value = '';
    commissionNum.value = '';
    orderPriceMarket.value = '';
    commissionNumMarket.value = '';

    // 切换回限价单
    currentPriceType.value = 'limit';
    // 根据新币种获取账户信息
    fetchSymbolAccount(newSymbol);
  }
});

// 计算当前币种的多头和空头持仓数据
const longPosition = computed(() =>
  positionData.value.find((position) => position.Symbol === coinSymbol.value + 'USDT' && position.HoldSide === 0),
)

const shortPosition = computed(() =>
  positionData.value.find((position) => position.Symbol === coinSymbol.value + 'USDT' && position.HoldSide === 1),
)

// 用于存储确认弹窗的数据
const confirmationData = ref({
  symbol: '',
  type: '',
  price: '',
  amount: '',
  margin: '',
  leverage: '',
  positionType: '',
})

function openConfirmationModal(type) {
  console.log('openConfirmationModal triggered with type:', type) // 检查触发
  confirmationData.value = {
    symbol: coinSymbol.value + 'USDT',
    type: type === 'openLong' ? '开多' : type === 'openShort' ? '开空' : type === 'closeLong' ? '平多' : '平空',
    price: currentPriceType.value === 'market' ? actualOrderPrice.value : orderPrice.value,
    amount:approxBTCValue.value + coinSymbol.value, // 这里根据实际计算逻辑替换
    margin: (parseFloat(approxUSDTValue.value)/parseFloat(factor.value)) + "USDT", // 这里根据实际计算逻辑替换
    leverage: factor.value + 'x',
    positionType: positionType.value === 'crossed' ? '全仓' : '逐仓',
    isOpenOrder: type === 'openLong' || type === 'openShort', // 是否为开仓
  }
  confirmationModal.value = true
}

const handleBeforeLeave = (tab) => {
  switch (tab) {
    case 'limit':
      return new Promise((resove, reject) => {
        dialog.warning({
          title: '限单价确认',
          content: '确认切换到限价单？以指定或更优价格买入或卖出。',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => resove(true),
          onNegativeClick: () => resove(false),
        })
      })
    case 'market':
      return new Promise((resove, reject) => {
        dialog.warning({
          title: '市单价确认',
          content: '确认切换到市价单？以可成交的最优价格快速买入或卖出。',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => resove(true),
          onNegativeClick: () => resove(false),
        })
      })
    default:
      return false
  }
}

async function sendOrder() {
  if (!token) {
    message.error('请先登录');
    return;
  }

  // Construct the payload
  const payload = {
    Symbol: confirmationData.value.symbol,
    MarginMode: positionType.value, // 'crossed' for 全仓, 'isolated' for 逐仓
    MarginAsset: "USDT",
    OrderSide: confirmationData.value.type.includes('开多') ? 0 : confirmationData.value.type.includes('开空') ? 1 : confirmationData.value.type.includes('平多') ? 2 : 3,
    OrderType: currentPriceType.value === 'market' ? 1 : 0, // 市价 1, 限价 0
    Quantity: approxBTCValue.value, // or the actual quantity value you want to send
    Price: currentPriceType.value === 'market' ? 0.0 : orderPrice.value, // Market orders don't need a price
    Leverage: factor.value,
    ReduceOnly: optionType.value === 'close', // true for closing positions
  };

  try {
    // Send POST request to API
    const response = await fetch('https://test.keepbit.top/app_api/v1/KrtContract/SendOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Check response and notify user
    if (result.Success) {
      message.success('下单成功');
      confirmationModal.value = false; // Close the modal
      emit('orderSuccess') // 触发 orderSuccess 事件
    } else {
      message.error(result.ErrMsg || '下单失败');
    }
  } catch (error) {
    console.error('下单请求出错:', error);
    message.error('请求出错，请稍后重试');
  }
}

const handleCommissionInput = (type) => {
  const inputRef = type === 'limit' ? commissionNum : commissionNumMarket;

  let value = inputRef.value;

  // 只允许输入数字和百分号
  value = value.replace(/[^0-9.%]/g, '');

  // 限制小数位数
  if (value.includes('.')) {
    const [intPart, decPart] = value.split('.');
    if (decPart.length > currentCoinDecimals.value) {
      value = `${intPart}.${decPart.slice(0, currentCoinDecimals.value)}`;
    }
  }

  // 更新值
  inputRef.value = value;
};

// 在组件挂载时调用 fetchSymbolAccount 函数
onMounted(() => {
  if (coinSymbol.value) {
    fetchSymbolAccount(coinSymbol.value)
  }
})
</script>

<template>
  <div class="lg:w-[350px] p-4 space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <NButton :type="optionType === 'open' ? 'primary' : 'default'" @click="optionType = 'open'">
        {{ t('trading.openPosition') }}
      </NButton>
      <NButton :type="optionType === 'close' ? 'primary' : 'default'" @click="optionType = 'close'">
        {{ t('trading.closePosition') }}
      </NButton>
      <NPopconfirm @positive-click="switchMarginMode">
        <template #trigger>
          <NButton>{{ positionType === 'crossed' ? t('trading.crossed') : t('trading.isolated') }}</NButton>
        </template>
        {{
          positionType === 'crossed'
              ? t('trading.switchToIsolated')
              : t('trading.switchToCrossed')
        }}
      </NPopconfirm>
      <NPopselect :options="factorOptions" trigger="click" @update:value="handleFactorChange">
        <NButton>
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
        v-model:value="currentPriceType"
        default-value="limit"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        @before-leave="handleBeforeLeave"
    >
      <NTabPane name="limit" :tab="t('trading.limitOrder')">
        <div class="text-xs space-y-4">
          <div class="font-bold">{{ t('trading.entrustPrice') }} (USDT)</div>
          <NInput v-model:value="orderPrice" size="small" :placeholder="t('trading.enterEntrustPrice')" />
          <div class="font-bold">{{ t('trading.entrustQuantity') }}</div>
          <NInput
              v-model:value="commissionNum"
              size="small"
              :placeholder="t('trading.enterEntrustQuantity')"
              @input="handleCommissionInput('limit')"
          />
          <div class="font-bold">
            ≈ {{ approxBTCValue }} {{ coinSymbol }} / {{ parseFloat(approxUSDTValue).toFixed(4) }} USDT
          </div>
          <!-- 滑块 -->
          <NSlider
              v-model:value="sliderValue"
              :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
              :step="1"
              :format-tooltip="(v) => `${v}%`"
          />
          <div class="flex gap-x-2 pt-4">
            <NButton
                class="flex-1"
                type="primary"
                @click="openConfirmationModal(optionType === 'close' ? 'closeShort' : 'openLong')"
            >
              {{ optionType === 'close' ? t('trading.closeShort') : t('trading.openLong') }}
            </NButton>
            <NButton
                class="flex-1 bg-rose-500 text-white"
                @click="openConfirmationModal(optionType === 'close' ? 'closeLong' : 'openShort')"
            >
              {{ optionType === 'close' ? t('trading.closeLong') : t('trading.openShort') }}
            </NButton>
          </div>
        </div>
      </NTabPane>
      <NTabPane name="market" :tab="t('trading.marketOrder') ">
        <div class="text-xs space-y-4">
          <div class="font-bold">{{ t('trading.entrustPrice') }} (USDT)</div>
          <NInput v-model:value="orderPriceMarket" size="small" :placeholder="t('trading.marketPrice')" disabled />
          <div class="font-bold">{{ t('trading.entrustQuantity') }}</div>
          <NInput
              v-model:value="commissionNumMarket"
              size="small"
              :placeholder="t('trading.enterEntrustQuantity')"
              @input="handleCommissionInput('market')"
          />
          <div class="font-bold">
            ≈ {{ approxBTCValue }} {{ coinSymbol }} / {{ parseFloat(approxUSDTValue).toFixed(4) }} USDT
          </div>
          <!-- 滑块 -->
          <NSlider
              v-model:value="sliderValueMarket"
              :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
              :step="1"
              :format-tooltip="(v) => `${v}%`"
          />
          <div class="flex gap-x-2 pt-4">
            <NButton
                class="flex-1"
                type="primary"
                @click="openConfirmationModal(optionType === 'close' ? 'closeShort' : 'openLong')"
            >
              {{ optionType === 'close' ? t('trading.closeShort') : t('trading.openLong') }}
            </NButton>
            <NButton
                class="flex-1 bg-rose-500 text-white"
                @click="openConfirmationModal(optionType === 'close' ? 'closeLong' : 'openShort')"
            >
              {{ optionType === 'close' ? t('trading.closeLong') : t('trading.openShort') }}
            </NButton>
          </div>
        </div>
      </NTabPane>
    </NTabs>
    <div class="p-4 grid grid-cols-2 bg-slate-100 rounded-xl gap-2 text-xs">
      <template v-if="optionType === 'close'">
        <!-- 空仓持仓量和可平量 -->
        <div>
          <div class="text-slate-400">{{ t('trading.shortPosition') }}</div>
          <div>{{ shortPosition?.Size || '0.000' }} {{ coinSymbol }}</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.longPosition') }}</div>
          <div>{{ longPosition?.Size || '0.000' }} {{ coinSymbol }}</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.availableToClose') }}</div>
          <div>{{ shortPosition?.Available || '0.000' }} {{ coinSymbol }}</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.availableToClose') }}</div>
          <div>{{ longPosition?.Available || '0.000' }} {{ coinSymbol }}</div>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="text-slate-400">{{ t('trading.availableToOpenLong') }}</div>
          <div>{{ maxOpenAmount.toFixed(currentCoinDecimals) }} {{ coinSymbol }}</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.availableToOpenShort') }}</div>
          <div>{{ maxOpenAmount.toFixed(currentCoinDecimals) }} {{ coinSymbol }}</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.margin') }}</div>
          <div>{{ margin.toFixed(4) }} USDT</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.margin') }}</div>
          <div>{{ margin.toFixed(4) }} USDT</div>
        </div>
        <div>
          <div class="text-slate-400">{{ t('trading.availableUse') }}</div>
          <div>{{ available }} USDT</div>
        </div>
        <div class="flex items-center" @click="chargeModal = true">
          <img class="size-4" src="/switch.png" />
        </div>
      </template>
    </div>

    <NModal v-model:show="chargeModal">
      <div class="bg-white rounded-md w-full lg:w-[600px] p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-bold text-xl">{{ t('trading.selectDepositMethod') }}</div>
          <img class="size-4" src="/close.png" @click="chargeModal = false" />
        </div>
        <div
            class="space-y-2 p-2 border border-slate-200 rounded-xl text-white bg-green-500"
            @click="cryptoChargeModal = true"
        >
          <div class="text-lg font-bold">{{ t('trading.depositCryptoCurrency') }}</div>
          <div>{{ t('trading.fromWalletOrExchange') }}</div>
        </div>
        <div
            class="space-y-2 p-2 border border-slate-200 rounded-xl text-white bg-green-500"
            @click="accountChargeModal = true"
        >
          <div class="text-lg font-bold">{{ t('trading.internalTransfer') }}</div>
          <div>{{ t('trading.transferBetweenAccounts') }}</div>
        </div>
      </div>
    </NModal>

    <NModal v-model:show="cryptoChargeModal">
      <div class="bg-white rounded-md w-full lg:w-[600px] p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-bold text-xl">{{ t('trading.depositCryptoCurrency') }}</div>
          <img class="size-4" src="/close.png" @click="cryptoChargeModal = false" />
        </div>
        <div class="flex items-center gap-x-4 text-sm">
          <img class="size-6" src="/usdt.png" />
          USDT
        </div>
        <div class="flex items-center justify-between text-sm gap-x-4">
          <div class="text-slate-500 w-16">{{ t('trading.selectNetwork') }}</div>
          <NSelect
              style="flex: 1"
              :placeholder="t('trading.selectNetwork')"
              v-model:value="selectedNetwork"
              :options="networkOptions"
              @update:value="handleNetworkSelect"
          />
        </div>

        <div v-if="selectedNetwork">
          <div class="flex items-center justify-between text-sm">
            <div class="text-slate-500">
              {{ t('trading.networkWarning') }}
            </div>
          </div>
          <div class="qr-code-container">
            <img :src="qrCodeUrl" alt="二维码" class="qr-code" />
          </div>
          <div class="flex items-center justify-between text-sm gap-x-4 py-4">
            <div class="text-slate-500 w-16">{{ t('trading.depositAddress') }}</div>
            <NInput style="flex: 1" :value="walletId" disabled />
          </div>
          <div class="flex items-center justify-between text-sm gap-x-4 py-4">
            <div class="text-slate-500 w-16">{{ t('trading.depositTo') }}</div>
            <NInput style="flex: 1" :value="t('trading.fundAccount')" disabled />
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="text-slate-500">
              {{ t('trading.onlyDepositToThisAddress',{ selectedNetwork }) }}
            </div>
          </div>
        </div>

        <NButton block type="primary" @click="cryptoChargeModal = false">{{ t('trading.confirm') }}</NButton>
      </div>
    </NModal>

    <NModal v-model:show="accountChargeModal">
      <div class="bg-white rounded-md w-full lg:w-[600px] p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-bold text-xl">{{ t('trading.internalTransfer') }}</div>
          <img class="size-4" src="/close.png" @click="accountChargeModal = false" />
        </div>
        <div class="flex items-center gap-x-4">
          <div class="flex-1 space-y-4">
            <div class="flex items-center justify-between text-sm gap-x-4">
              <div class="text-slate-500 w-8">{{ t('trading.from') }}</div>
              <NInput style="flex: 1" :value="fromAccount" disabled />
            </div>
            <div class="flex items-center justify-between text-sm gap-x-4">
              <div class="text-slate-500 w-8">{{ t('trading.to') }}</div>
              <NInput style="flex: 1" :value="toAccount" disabled />
            </div>
          </div>
          <NIcon class="text-xl" @click="swapAccounts">
            <ArrowSort16Regular />
          </NIcon>
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="text-slate-500">{{ t('trading.asset') }}</div>
          <div class="font-bold">{{ asset }}</div>
        </div>
        <div class="flex items-center justify-between text-sm gap-x-4">
          <div class="text-slate-500 w-8">{{ t('trading.amount') }}</div>
          <NInputNumber
              style="flex: 1"
              v-model:value="transferAmount"
              :placeholder="t('trading.amount')"
              :max="maxTransferable"
              clearable
          />
        </div>
        <div class="text-sm text-slate-500 text-right">
          {{ t('trading.maxTransfer') }}: {{ maxTransferable }} USDT
        </div>
        <NButton block type="primary" @click="submitTransfer">{{ t('trading.confirm') }}</NButton>
      </div>
    </NModal>

    <NModal v-model:show="confirmationModal">
      <div class="bg-white rounded-xl p-4 space-y-4 w-full lg:w-[500px]">
        <div class="flex items-center justify-between">
          <div class="font-bold text-xl">{{ t('trading.orderConfirmation') }}</div>
          <img class="size-4" src="/close.png" @click="confirmationModal = false" />
        </div>
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">{{ confirmationData.symbol }}</div>
          <div class="space-x-4 font-bold">
            <span>{{ confirmationData.type }}</span>
            <span>{{ confirmationData.leverage }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="text-slate-500">{{ t('trading.orderPrice') }}</div>
          <div class="font-bold">{{ confirmationData.price }} USDT</div>
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="text-slate-500">{{ t('trading.amount') }}</div>
          <div class="font-bold">{{ confirmationData.amount }}</div>
        </div>
        <div v-if="confirmationData.isOpenOrder" class="flex items-center justify-between text-sm">
          <div class="text-slate-500">{{ t('trading.margin') }}</div>
          <div class="font-bold">{{ confirmationData.margin }}</div>
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="text-slate-500">{{ t('trading.type') }}</div>
          <div class="space-x-2 font-bold">
            <span>{{ confirmationData.positionType }}</span>
            <span>-</span>
            <span>{{ currentPriceType.value === 'market' ? t('trading.marketPrice') : t('trading.limitPrice') }}</span>
          </div>
        </div>
        <NButton type="primary" block @click="sendOrder">{{ t('trading.confirm') }}</NButton>
      </div>
    </NModal>
  </div>
</template>
<style scoped>
.qr-code-container {
  display: flex;
  justify-content: center;
  padding: 20px 0; /* 上下边距 */
}
.qr-code {
  width: 150px;
  height: 150px;
}
</style>
