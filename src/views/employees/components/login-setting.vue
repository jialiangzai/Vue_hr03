<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form
      ref="userInfos"
      label-width="60px"
      :model="userInfos"
      :rules="rules"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfos.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model="userInfos.mobile" disabled style="width: 300px" />
      </el-form-item>

      <el-form-item label="密码:">
        <el-input
          v-model="userInfos.password"
          type="password"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveLogin">更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/employees'
export default {
  props: {
    userInfos: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      rules: {
        username: [

          { min: 3, max: 10, required: true, message: '请输入', trigger: 'change' }

        ]
      }
    }
  },
  methods: {
    async saveLogin () {
      // 校验
      await this.$refs.userInfos.validate()
      try {
        await saveUserDetailById(this.userInfos)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
