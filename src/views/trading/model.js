import { ref, h } from 'vue'
import { NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n' // 导入 i18n 钩子

export function useTableColumns(cancelOrder) {
  const { t } = useI18n() // 使用 t 方法获取翻译

  const positionModal = ref(false)
  const profitModal = ref(false)

  // 存储止盈/止损和平仓模态框数据的对象
  const profitModalData = ref({})
  const positionModalData = ref({})

  /**
   * 打开止盈/止损模态框并填充持仓数据
   * @param {Object} row 持仓数据对象
   */
  function openProfitModal(row) {
    profitModalData.value = {
      symbol: row.Symbol || 'N/A',
      direction: row.HoldSide === 1 ? t('trading.long') : t('trading.short'),
      marginMode: row.MarginMode === 'isolated' ? t('trading.isolated') : t('trading.cross'),
      leverage: `${row.Leverage}X`,
      currentPrice: row.MarkPrice || 'N/A',
      openPrice: row.OpenPrice || 'N/A',
      markPrice: row.MarkPrice || 'N/A',
      estimatedLiquidationPrice: row.ClosingPrice || 'N/A',
      available: row.Available || 0,
    }
    profitModal.value = true
  }

  /**
   * 打开平仓模态框并填充持仓数据
   * @param {Object} row 持仓数据对象
   */
  function openPositionModal(row) {
    positionModalData.value = {
      symbol: row.Symbol || 'N/A',
      direction: row.HoldSide === 1 ? t('trading.long') : t('trading.short'),
      marginMode: row.MarginMode === 'isolated' ? t('trading.isolated') : t('trading.cross'),
      leverage: `${row.Leverage}X`,
      currentPrice: row.MarkPrice || 'N/A',
      openPrice: row.OpenPrice || 'N/A',
      available: row.Available || 0,
      size: row.Size || 0,
    }
    positionModal.value = true
  }

  const positionTableColumns = [
    {
      title: t('trading.contract'),  // 使用 t 来获取翻译
      key: 'Symbol',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.direction'),
      key: 'HoldSide',
      width: 100,
      align: 'center',
      render(row) {
        const holdSideText = row.HoldSide === 1 ? t('trading.long') : t('trading.short')
        const color = row.HoldSide === 1 ? 'red' : 'green'
        return h('span', { style: { color } }, holdSideText)
      },
    },
    {
      title: t('trading.marginMode'),
      key: 'MarginMode',
      width: 100,
      align: 'center',
      render(row) {
        return row.MarginMode === 'isolated' ? t('trading.isolated') : t('trading.cross')
      },
    },
    {
      title: t('trading.leverage'),
      key: 'Leverage',
      width: 100,
      align: 'center',
      render(row) {
        return `${row.Leverage}X`
      },
    },
    {
      title: t('trading.profit'),
      key: 'Profit',
      width: 100,
      align: 'center',
      render(row) {
        const color = row.Profit >= 0 ? 'green' : 'red'
        return h('span', { style: { color } }, row.Profit)
      },
    },
    {
      title: t('trading.profitRate'),
      key: 'ProfitRate',
      width: 100,
      align: 'center',
      render(row) {
        const color = row.Profit >= 0 ? 'green' : 'red'
        return h('span', { style: { color } }, `${row.ProfitRate}`)
      },
    },
    {
      title: t('trading.size'),
      key: 'Size',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.margin'),
      key: 'Margin',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.marginRate'),
      key: 'MarginRate',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.openPrice'),
      key: 'OpenPrice',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.markPrice'),
      key: 'MarkPrice',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.closingPrice'),
      key: 'ClosingPrice',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.operation'),
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
                justifyContent: 'center',
                gap: '8px',
              },
            },
            [
              h(
                  NButton,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: () => openProfitModal(row),
                  },
                  { default: () => t('trading.stopProfitLoss') },
              ),
              h(
                  NButton,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: () => openPositionModal(row),
                  },
                  { default: () => t('trading.closePosition') },
              ),
            ],
        )
      },
    }
  ]

  const commissionTableColumns = [
    {
      title: t('trading.contract'),
      key: 'Symbol',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.type'),
      key: 'OrderType',
      width: 100,
      align: 'center',
      render(row) {
        return row.OrderType === 'Limit' ? t('trading.limit') : t('trading.market')
      },
    },
    {
      title: t('trading.leverage'),
      key: 'Leverage',
      width: 100,
      align: 'center',
      render(row) {
        return `${row.Leverage}X`
      },
    },
    {
      title: t('trading.direction'),
      key: 'Side',
      width: 100,
      align: 'center',
      render(row) {
        let sideText
        let sideColor

        switch (row.Side) {
          case 0:
            sideText = t('trading.openLong')
            sideColor = 'green'
            break
          case 1:
            sideText = t('trading.openShort')
            sideColor = 'red'
            break
          case 2:
            sideText = t('trading.closeLong')
            sideColor = 'red'
            break
          case 3:
            sideText = t('trading.closeShort')
            sideColor = 'green'
            break
          case 4:
            sideText = t('trading.singleBuy')
            sideColor = 'black'
            break
          case 5:
            sideText = t('trading.singleSell')
            sideColor = 'black'
            break
          default:
            sideText = t('trading.unknown')
            sideColor = 'black'
        }

        return h('span', { style: { color: sideColor } }, sideText)
      },
    },
    {
      title: t('trading.quantity'),
      key: 'Quantity',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.filledQuantity'),
      key: 'QuantityFilled',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.price'),
      key: 'Price',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.createTime'),
      key: 'CreateTime',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.operation'),
      key: 'action',
      width: 80,
      align: 'center',
      render(row) {
        return h(
            NButton,
            {
              type: 'primary',
              onClick: () => cancelOrder(row.Id), // 使用传入的 cancelOrder 方法
            },
            { default: () => t('trading.cancelOrder') }
        )
      },
    },
  ]

  const positionRecordTableColumns = [
    {
      title: t('trading.contract'),
      key: 'Symbol',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.direction'),
      key: 'HoldSide',
      width: 100,
      align: 'center',
      render(row) {
        const holdSideText = row.HoldSide === 'Long' ? t('trading.long') : t('trading.short')
        const color = row.HoldSide === 'Long' ? 'green' : 'red'
        return h('span', { style: { color } }, holdSideText)
      },
    },
    {
      title: t('trading.marginMode'),
      key: 'MarginMode',
      width: 100,
      align: 'center',
      render(row) {
        return row.MarginMode === 'isolated' ? t('trading.isolated') : t('trading.cross')
      },
    },
    {
      title: t('trading.openPrice'),
      key: 'OpenPrice',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.totalOpen'),
      key: 'OpenTotal',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.realizedPnl'),
      key: 'Pnl',
      width: 100,
      align: 'center',
      render(row) {
        const color = parseFloat(row.Pnl) > 0 ? 'green' : 'red'
        return h('span', { style: { color } }, row.Pnl)
      },
    },
    {
      title: t('trading.netProfit'),
      key: 'NetProfit',
      width: 100,
      align: 'center',
      render(row) {
        const color = parseFloat(row.NetProfit) > 0 ? 'green' : 'red'
        return h('span', { style: { color } }, row.NetProfit)
      },
    },
    {
      title: t('trading.totalFee'),
      key: 'TotalFillFee',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.totalFunding'),
      key: 'TotalFunding',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.openTime'),
      key: 'CreateTime',
      width: 150,
      align: 'center',
    },
    {
      title: t('trading.closeTime'),
      key: 'CloseTime',
      width: 150,
      align: 'center',
    },
  ]

  const commissionRecordTableColumns = [
    {
      title: t('trading.contract'),
      key: 'Symbol',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.orderType'),
      key: 'OrderType',
      width: 100,
      align: 'center',
      render(row) {
        return row.OrderType === 'Limit' ? t('trading.limit') : t('trading.market')
      },
    },
    {
      title: t('trading.openDirection'),
      key: 'Side',
      width: 100,
      align: 'center',
      render(row) {
        let sideText
        let sideColor
        switch (row.TradeSide) {
          case 0:
            sideText = t('trading.openLong')
            sideColor = 'green'
            break
          case 1:
            sideText = t('trading.openShort')
            sideColor = 'red'
            break
          case 2:
            sideText = t('trading.closeLong')
            sideColor = 'red'
            break
          case 3:
            sideText = t('trading.closeShort')
            sideColor = 'green'
            break
          default:
            sideText = t('trading.unknown')
            sideColor = 'black'
        }
        return h('span', { style: { color: sideColor } }, sideText)
      },
    },
    {
      title: t('trading.marginMode'),
      key: 'MarginMode',
      width: 100,
      align: 'center',
      render(row) {
        return row.MarginMode === 'isolated' ? t('trading.isolated') : t('trading.cross')
      },
    },
    {
      title: t('trading.leverage'),
      key: 'Leverage',
      width: 100,
      align: 'center',
      render(row) {
        return `${row.Leverage}X`
      },
    },
    {
      title: t('trading.orderStatus'),
      key: 'Status',
      width: 100,
      align: 'center',
      render(row) {
        let orderStatus
        switch (row.Status) {
          case 'New':
            orderStatus = t('trading.newOrder')
            break
          case 'Partially_filled':
            orderStatus = t('trading.partiallyFilled')
            break
          case 'Filled':
            orderStatus = t('trading.filled')
            break
          case 'Canceled':
            orderStatus = t('trading.canceled')
            break
          default:
            orderStatus = t('trading.unknown')
        }
        return orderStatus
      },
    },
    {
      title: t('trading.avgPrice'),
      key: 'AvgPrice',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.quantityFilled'),
      key: 'QuantityFilled',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.price'),
      key: 'Price',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.quantity'),
      key: 'Quantity',
      width: 100,
      align: 'center',
    },
    {
      title: t('trading.createTime'),
      key: 'CreateTime',
      width: 150, // 增加创建时间的宽度
      align: 'center',
    },
  ]

  return {
    positionModal,
    profitModal,
    profitModalData,
    positionModalData,
    openProfitModal,
    openPositionModal,
    positionTableColumns,
    commissionTableColumns,
    positionRecordTableColumns,
    commissionRecordTableColumns,
  }
}
