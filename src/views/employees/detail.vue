<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="active">
          <el-tab-pane label="登录账户设置" name="login">
            <LoginSetting :user-infos="userInfos" />
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="info">
            <UserInfo :user-infos="userInfos" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import LoginSetting from './components/login-setting.vue'
import UserInfo from './components/user-info.vue'
// 当前点击的用户的信息
import { getUserDetailById } from '@/api/user'

export default {
  components: {
    LoginSetting,
    UserInfo
  },
  data () {
    return {
      userInfos: {},
      // 默认选中面板页签
      active: 'info'
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      this.userInfos = await getUserDetailById(this.$route.params.id)
      console.log(this.userInfos)
    }
  }
}
</script>
