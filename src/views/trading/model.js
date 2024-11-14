import { ref } from 'vue'
import { NButton } from 'naive-ui'

export function useTableColumns() {
  const positionModal = ref(false)
  const profitModal = ref(false)

  const positionTableColumns = [
    {
      title: '合约',
      key: 'Symbol',
      width: 100,
      align: 'center',
    },
    {
      title: '持仓方向',
      key: 'HoldSide',
      width: 100,
      align: 'center',
      render(row) {
        const holdSideText = row.HoldSide === 1 ? '空头' : '多头'
        const color = row.HoldSide === 1 ? 'red' : 'green'
        return h('span', { style: { color } }, holdSideText)
      },
    },
    {
      title: '持仓模式',
      key: 'MarginMode',
      width: 100,
      align: 'center',
      render(row) {
        return row.MarginMode === 'isolated' ? '逐仓' : '全仓'
      },
    },
    {
      title: '杠杆',
      key: 'Leverage',
      width: 100,
      align: 'center',
      render(row) {
        return `${row.Leverage}X`
      },
    },
    {
      title: '收益(USDT)',
      key: 'Profit',
      width: 100,
      align: 'center',
      render(row) {
        const color = row.Profit >= 0 ? 'green' : 'red'
        return h('span', { style: { color } }, row.Profit)
      },
    },
    {
      title: '收益率',
      key: 'ProfitRate',
      width: 100,
      align: 'center',
      render(row) {
        const color = row.Profit >= 0 ? 'green' : 'red'
        return h('span', { style: { color } }, `${row.ProfitRate}`)
      },
    },
    {
      title: '持仓量',
      key: 'Size',
      width: 100,
      align: 'center',
    },
    {
      title: '保证金(USDT)',
      key: 'Margin',
      width: 100,
      align: 'center',
    },
    {
      title: '保证金率',
      key: 'MarginRate',
      width: 100,
      align: 'center',
    },
    {
      title: '开仓均价',
      key: 'OpenPrice',
      width: 100,
      align: 'center',
    },
    {
      title: '标记价格',
      key: 'MarkPrice',
      width: 100,
      align: 'center',
    },
    {
      title: '预估强平价',
      key: 'ClosingPrice',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      align: 'center',
      render(row) {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // 水平居中
              gap: '8px',
            },
          },
          [
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                onClick: () => {
                  // 处理止盈/止损操作
                  profitModal.value = true
                },
              },
              { default: () => '止盈/止损' },
            ),
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                onClick: () => {
                  positionModal.value = true
                },
              },
              { default: () => '平仓' },
            ),
          ],
        )
      },
    },
  ]
  const commissionTableColumns = [
    { title: '合约', key: 'Symbol', width: 100, align: 'center' },
    {
      title: '类型',
      key: 'OrderType',
      width: 100,
      align: 'center',
      render(row) {
        return row.OrderType === 'Limit' ? '限价' : '市价'
      },
    },
    {
      title: '杠杆',
      key: 'Leverage',
      width: 100,
      align: 'center',
      render(row) {
        return `${row.Leverage}X`
      },
    },
    {
      title: '方向',
      key: 'Side',
      width: 100,
      align: 'center',
      render(row) {
        let sideText
        let sideColor

        switch (row.Side) {
          case 0:
            sideText = '开多'
            sideColor = 'green'
            break
          case 1:
            sideText = '开空'
            sideColor = 'red'
            break
          case 2:
            sideText = '平多'
            sideColor = 'red'
            break
          case 3:
            sideText = '平空'
            sideColor = 'green'
            break
          case 4:
            sideText = '单向持仓买'
            sideColor = 'black'
            break
          case 5:
            sideText = '单向持仓卖'
            sideColor = 'black'
            break
          default:
            sideText = '未知'
            sideColor = 'black'
        }

        return h('span', { style: { color: sideColor } }, sideText)
      },
    },
    { title: '委托数量', key: 'Quantity', width: 100, align: 'center' },
    { title: '已成交数量', key: 'QuantityFilled', width: 100, align: 'center' },
    { title: '委托价格', key: 'Price', width: 100, align: 'center' },
    { title: '创建时间', key: 'CreateTime', width: 100, align: 'center' },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render(row) {
        return h(NButton, { type: 'primary' }, { default: () => '撤单' })
      },
    },
  ]
  const positionRecordTableColumns = [
    { title: '合约', key: 'Symbol', width: 100, align: 'center' },
    {
      title: '持仓方向',
      key: 'HoldSide',
      width: 100,
      align: 'center',
      render(row) {
        const holdSideText = row.HoldSide === 'Long' ? '多头' : '空头'
        const color = row.HoldSide === 'Long' ? 'green' : 'red'
        return h('span', { style: { color } }, holdSideText)
      },
    },
    {
      title: '持仓模式',
      key: 'MarginMode',
      width: 100,
      align: 'center',
      render(row) {
        return row.MarginMode === 'isolated' ? '逐仓' : '全仓'
      },
    },
    {
      title: '持仓均价',
      key: 'OpenPrice',
      width: 100,
      align: 'center',
    },
    {
      title: '累计开仓数量',
      key: 'OpenTotal',
      width: 100,
      align: 'center',
    },
    {
      title: '已实现盈亏',
      key: 'Pnl',
      width: 100,
      align: 'center',
      render(row) {
        const color = parseFloat(row.Pnl) > 0 ? 'green' : 'red'
        return h('span', { style: { color } }, row.Pnl)
      },
    },
    {
      title: '净盈亏',
      key: 'NetProfit',
      width: 100,
      align: 'center',
      render(row) {
        const color = parseFloat(row.NetProfit) > 0 ? 'green' : 'red'
        return h('span', { style: { color } }, row.NetProfit)
      },
    },
    {
      title: '累计手续费',
      key: 'TotalFillFee',
      width: 100,
      align: 'center',
    },
    {
      title: '累计资金费用',
      key: 'TotalFunding',
      width: 100,
      align: 'center',
    },
    {
      title: '开仓时间',
      key: 'CreateTime',
      width: 150,
      align: 'center',
    },
    {
      title: '平仓时间',
      key: 'CloseTime',
      width: 150,
      align: 'center',
    },
  ]
  const commissionRecordTableColumns = [
    {
      title: '合约',
      key: 'Symbol',
      width: 100,
      align: 'center',
    },
    {
      title: '订单类型',
      key: 'OrderType',
      width: 100,
      align: 'center',
      render(row) {
        return row.OrderType === 'Limit' ? '限价' : '市价'
      },
    },
    {
      title: '开单方向',
      key: 'Side',
      width: 100,
      align: 'center',
      render(row) {
        let sideText
        let sideColor
        switch (row.TradeSide) {
          case 0:
            sideText = '开多'
            sideColor = 'green'
            break
          case 1:
            sideText = '开空'
            sideColor = 'red'
            break
          case 2:
            sideText = '平多'
            sideColor = 'red'
            break
          case 3:
            sideText = '平空'
            sideColor = 'green'
            break
          default:
            sideText = '未知'
            sideColor = 'black'
        }
        return h('span', { style: { color: sideColor } }, sideText)
      },
    },
    {
      title: '持仓模式',
      key: 'MarginMode',
      width: 100,
      align: 'center',
      render(row) {
        return row.MarginMode === 'isolated' ? '逐仓' : '全仓'
      },
    },
    {
      title: '杠杆',
      key: 'Leverage',
      width: 100,
      align: 'center',
      render(row) {
        return `${row.Leverage}X`
      },
    },
    {
      title: '订单状态',
      key: 'Status',
      width: 100,
      align: 'center',
      render(row) {
        let orderStatus
        switch (row.Status) {
          case 'New':
            orderStatus = '新建订单'
            break
          case 'Partially_filled':
            orderStatus = '部分成交'
            break
          case 'Filled':
            orderStatus = '全部成交'
            break
          case 'Canceled':
            orderStatus = '已撤销'
            break
          default:
            orderStatus = '未知'
        }
        return orderStatus
      },
    },
    {
      title: '成交均价',
      key: 'AvgPrice',
      width: 100,
      align: 'center',
    },
    {
      title: '成交数量',
      key: 'QuantityFilled',
      width: 100,
      align: 'center',
    },
    {
      title: '委托价格',
      key: 'Price',
      width: 100,
      align: 'center',
    },
    {
      title: '委托数量',
      key: 'Quantity',
      width: 100,
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'CreateTime',
      width: 150, // 增加创建时间的宽度
      align: 'center',
    },
  ]

  return {
    positionModal,
    profitModal,
    positionTableColumns,
    commissionTableColumns,
    positionRecordTableColumns,
    commissionRecordTableColumns,
  }
}
