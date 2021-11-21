<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon
      :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="changeIcon"
    />
  </div>
</template>
<script>
// 全屏插件
import sf from 'screenfull'
export default {
  name: 'ScreenFull',
  data () {
    return {
      isFull: false
    }
  },
  created () {
    // 开启监听isFull
    sf.on('change', () => {
      this.isFull = sf.isFullscreen
    })
  },
  // 解绑事件
  beforeDestroy () {
    sf.off('change')
  },
  methods: {
    // 全屏的实现
    changeIcon () {
      if (!sf.isEnabled) {
        // 不支持
        this.$message.warning('此时全屏组件不可用')
      } else {
        // 支持就调用toggle自动去改变
        sf.toggle()
        // console.log(sf)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
