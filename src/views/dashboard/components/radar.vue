<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div>
    <el-switch
      v-model="flag"
      active-text="开启动态"
      inactive-text="关闭动态"
      @change="change"
    >
    </el-switch>
    <div ref="myDiv" class="radar-echart" />
  </div>
</template>

<script>
export default {
  name: 'Echarts',
  // 图表只能在挂载后创建 有大小的盒子
  data () {
    return {
      timersone: null,
      // 开启
      flag: false,
      opt: {
        radar: {
          // shape: 'circle',
          axisName: {
            // textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
            // }
          },
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [
          {
            type: 'radar',
            // 可以抽离做数据的动态变化
            data: [
              // {
              //   value: [10, 1, 100, 5, 100, 0],
              //   name: '张三'
              // },
              // {
              //   value: [50, 50, 50, 50, 50, 10],
              //   name: '李四'
              // }
            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      // 初始化实例 ====》在此写this不具有响应式带也在组件的实例上
      this.chartone = this.echarts.init(this.$refs.myDiv)
      this.opt.series[0].data = [
        {
          value: [10, 1, 100, 5, 100, 0],
          name: '张三'
        },
        {
          value: [50, 50, 50, 50, 50, 10],
          name: '李四'
        },
        {
          value: [50, 20, 50, 50, 14, 10],
          name: '李多'
        }
      ]
      this.chartone.setOption(this.opt)
    },
    // change事件switch改变动态随件变化图表
    // 参数就是最新的状态
    /**
     * 所谓的开启按钮就实现动态的就是定时器
     * 当开启时开启定时器 动态的改变series中的data,
     * 关闭就停止定时器
     * 为了避免用户频繁点击使用节流
     * 最终更改了data数据要去setoption一下重新做图表渲染
     * 关键点在于怎么动态生成数据
     * 实际就是随机数生成对应的几个角就几个添加到数组中再添加到series的data中
     * 补充series是数组可以有多个图表的数据，data是数组表示几个人(对象)
     */
    // switch事件
    change (flag) {
      // 开启
      if (this.timersone) {
        this.timersone && clearInterval(this.timersone)
        // console.log(this.timersone)
        this.timersone = null
        return
      }
      // 定时器标识
      this.timersone = setInterval(
        this.changeEcharts, 1000)
    },
    // 图表变化
    changeEcharts () {
      // 存储最终的data
      const newData = []
      // 假设有三个人
      for (let i = 0; i < 3; i++) {
        // 一个随机数
        const newArray = []
        for (let k = 0; k < 6; k++) {
          const randomItems = Math.floor(Math.random() * 100 + 1)
          newArray.push(randomItems)
        }
        // 存储data的每一个对象
        const newObje =
        // 有了对象就要设置属性及属性值
        {
          // newArray表示留个随机数的数组
          value: newArray,
          name: `王${i}`
        }

        // 拿到data
        newData.push(newObje)
      }
      // return newData
      this.opt.series[0].data = newData
      this.chartone.setOption(this.opt)
    }
  }
}

</script>

<style>
.radar-echart {
  width: 100%;
  height: 400px;
}
</style>
