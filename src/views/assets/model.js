export function pieChartOption(data, showAssets = true) {
  return {
    legend: {
      orient: 'vertical',
      right: 'center',
      bottom: '10%',
      textStyle: {
        color: '#8A8A8A', // 图例文本颜色
        fontSize: 12,
      },
      icon: 'circle',
      data: [
        { name: '资金账户', itemStyle: { color: '#FFD700' } },
        { name: '合约账户', itemStyle: { color: '#32CD32' } },
        { name: '模拟账户', itemStyle: { color: '#7FFF00' } },
        { name: '策略账户', itemStyle: { color: '#9370DB' } },
      ],
      formatter(name) {
        let value = 0
        switch (name) {
          case '资金账户':
            value = data.Assets
            break
          case '合约账户':
            value = data.Contract
            break
          case '模拟账户':
            value = data.Demo
            break
          case '策略账户':
            value = data.Tactic
            break
        }
        return name + (showAssets ? `     ${((value / data.Total) * 100).toFixed(2)}%` : '     ****')
      },
    },
    grid: {
      top: '-10%',
    },
    series: [
      {
        name: '账户分布',
        type: 'pie',
        radius: ['30%', '50%'], // 设置内外半径，创建环形图效果
        center: ['50%', '30%'],
        avoidLabelOverlap: false,
        label: {
          show: false, // 不显示内部标签
        },
        labelLine: {
          show: false, // 不显示标签线
        },
        data: [
          { value: data.Assets, name: '资金账户', itemStyle: { color: '#FFD700' } },
          { value: data.Contract, name: '合约账户', itemStyle: { color: '#32CD32' } },
          { value: data.Demo, name: '模拟账户', itemStyle: { color: '#7FFF00' } },
          { value: data.Tactic, name: '策略账户', itemStyle: { color: '#9370DB' } },
        ],
      },
    ],
  }
}
