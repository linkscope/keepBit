export function pieChartOption(data, showAssets = true, t) {
  // 计算总和（确保 Total 正确）
  const total = data.Assets + data.Contract + data.Demo + data.Tactic;

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
        { name: t('assets.fundAccount'), itemStyle: { color: '#FFD700' } },
        { name: t('assets.contractAccount'), itemStyle: { color: '#32CD32' } },
        { name: t('assets.demoAccount'), itemStyle: { color: '#7FFF00' } },
        { name: t('assets.strategyAccount'), itemStyle: { color: '#9370DB' } },
      ],
      formatter(name) {
        let value = 0;
        switch (name) {
          case t('assets.fundAccount'):
            value = data.Assets;
            break;
          case t('assets.contractAccount'):
            value = data.Contract;
            break;
          case t('assets.demoAccount'):
            value = data.Demo;
            break;
          case t('assets.strategyAccount'):
            value = data.Tactic;
            break;
        }
        // 计算百分比
        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
        return name + (showAssets ? `     ${percentage}%` : '     ****');
      },
    },
    grid: {
      top: '-10%',
    },
    series: [
      {
        name: t('assets.distribution'),
        type: 'pie',
        radius: ['30%', '50%'], // 创建环形图效果，设置内外半径
        center: ['50%', '30%'],
        avoidLabelOverlap: false,
        label: {
          show: false, // 不显示内部标签
        },
        labelLine: {
          show: false, // 不显示标签线
        },
        data: [
          { value: data.Assets, name: t('assets.fundAccount'), itemStyle: { color: '#FFD700' } },
          { value: data.Contract, name: t('assets.contractAccount'), itemStyle: { color: '#32CD32' } },
          { value: data.Demo, name: t('assets.demoAccount'), itemStyle: { color: '#7FFF00' } },
          { value: data.Tactic, name: t('assets.strategyAccount'), itemStyle: { color: '#9370DB' } },
        ],
      },
    ],
  };
}
