<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale">
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// 使用js-cookie记录切换状态 ===》切换的时候存储
import Cookie from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    // 点击菜单项触发的事件回调拿到选中项
    changeLanguage (lang) {
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换多语言成功')
      // 第三个参数可以用对象表示有效期====>{expires:数字或日期对象}===>有时区格式用new Date('格式字符串')去验证
      const expiresTimer = new Date(Date.now() + 1000 * 60 * 60 * 12)// 12个小时
      // Cookie.set('lang', lang, { expires: 2 })
      Cookie.set('lang', lang, { expires: expiresTimer })
    }
  }
}
</script>
