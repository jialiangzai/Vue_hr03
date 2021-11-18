<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-form
      ref="userInfos"
      :model="userInfos"
      label-width="100px"
      :rules="rules"
    >
      <!-- 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="userInfos.departmentName" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="userInfos.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <!-- <el-image :src="require('@/assets/common/head.jpg')"></el-image> -->
            <!-- 自定义上传头像 -->
            <UploadImg />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveInfo">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
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
        departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请输入入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击确认校验后入库
    async saveInfo () {
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
