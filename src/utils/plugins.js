/**
 * vue插件封装
 */
// 引入所有的
// import * as echarts from 'echarts'
// 按需引入
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
// 按需引入使用的组件
import {
  RadarChart
} from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  CanvasRenderer
} from 'echarts/renderers'
// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, RadarChart, CanvasRenderer])

// 睡眠函数
const $sleep = (t) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve
    }, t)
  })
}
export default {
  install (Vue) {
    Vue.prototype.$sleep = $sleep
    Vue.prototype.echarts = echarts
  }
}
