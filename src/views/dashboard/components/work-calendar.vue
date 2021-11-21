
<template>
  <!-- 日历 -->
  <el-calendar v-if="isShowwc" v-model="currentDate">
    <!-- 作用域插槽 -->
    <!-- date表示日期事件对象 data表示当前时间对象有3个属性 -->
    <!--
      { type, isSelected, day}，type 表示该日期的所属月份
      可选值有 prev-month，current-month，next-month
      isSelected 标明该日期是否被选中
      day 是格式化的日期，格式为 yyyy-MM-dd
     -->
    <template #dateCell="{ date, data }">
      <!-- <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split("-").slice(1).join("-") }}
        {{ data.isSelected ? "✔️" : "" }}
      </p> -->
      <div class="date-content">
        <span class="text">{{ getDay(data.day) }}</span>
        <span v-if="isWeek(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
/**
 * 日历问题：
 * 点击切换多语言时要刷新才会让日历组件实现
 * 帮用户刷新，====》实际就是让这个组件销毁在重新挂载
 * 原理 ： v-if
 * 之所以不用v-show是因为它只是控制了元素的显示和隐藏display:none/block ；if是直接从DOM树上销毁
 * 绑定变量存储是否挂载默认是true
 * 监听全局对象属性$i18n.locale变化时实现===》销毁====》挂载
 * 所谓监听变化实现某些功能是 watch的功能
 * 注意必须完成销毁才可以重新赋值true 挂载
 */
// 监听多语言变化=》手动销毁日历，让他重新创建=》解决星期切换不翻译问题
export default {
  data () {
    return {
      isShowwc: true,
      currentDate: new Date()
    }
  },
  watch: {
    // i18n已经全局挂载
    async '$i18n.locale' (newValue) {
      // console.log('监控到多语言切换了：', newValue)
      this.isShowwc = false
      await this.$nextTick()
      this.isShowwc = true
    }
  },
  methods: {
    // 日历显示几号
    // v表示格式化后的日期 年月日 字符串
    getDay (v) {
      return v.split('-')[2]
    },
    // 周某
    isWeek (n) {
      return n.getDay() === 6 || n.getDay() === 0
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar-day {
  height: 50px;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
// 休息时间
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
// 当前日期
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>
