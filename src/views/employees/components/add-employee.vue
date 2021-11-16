<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="close">
    <!-- 表单 -->
    <el-form
      ref="addFormEmp"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="it in hireType"
            :key="it.id"
            :label="it.value"
            :value="it.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="showDep = true"
        />
        <!-- tree树形图 -->
        <el-row v-show="showDep" class="tree-box">
          <i class="el-icon-circle-close" @click="showDep = false"></i>
          <el-tree
            ref="tree"
            :data="list"
            :props="{ label: 'name' }"
            @node-click="currDept"
          ></el-tree>
        </el-row>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="$emit('close-dialog')">取消</el-button>
      <el-button type="primary" @click="submitAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import EmplEnum from '@/api/constant/employees'
// 部门信息
import { getDepartments } from '@/api/departments'
// 树形转换
import { tranListToTreeData, parseTime } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      // 部门树形
      showDep: false,
      // 聘用形式
      hireType: EmplEnum.hireType,
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      // 部门
      list: [],
      // 校验规则
      rules: {
        username: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['change', 'blur'] }
        ],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }

        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }

        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }

        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }

        ],
        correctionTime: [
          { required: true, message: '请输入', trigger: 'blur' }

        ]
      }
    }
  },
  created () {
    this.getDep()
  },
  methods: {
    // 点击确认
    async submitAdd () {
      try {
        // 校验
        await this.$refs.addFormEmp.validate()
        this.formData.correctionTime = parseTime(this.formData.correctionTime, '{y}-{m}-{d}')
        this.formData.timeOfEntry = parseTime(this.formData.timeOfEntry, '{y}-{m}-{d}')
        await addEmployee(this.formData)
        // 更新后 关闭弹层 更新父组件列表 提示信息
        // this.$emit('close-dialog')
        // this.$emit('updateList')
        // $parent亲父亲组件 通知到父组件更新数据=> 获取父组件实例this.$parent
        this.$parent.closeDialog()
        this.$parent.updateList()

        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击当前部门
    currDept (data) {
      console.log('拿到的数据', data)
      this.formData.departmentName = data.name
      this.showDep = false
    },
    close () {
      this.$emit('close-dialog', false)
      // 重置表单数据+表单验证
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      }
      this.$refs.addFormEmp.resetFields()
    },
    // 获取公司架构
    async getDep () {
      const { depts } = await getDepartments()
      // 转换数据
      // console.table(depts)
      this.list = tranListToTreeData(depts)
    }

  }
}
</script>
<style lang="scss" scoped>
.tree-box {
  width: 280px;
  border: 1px solid #eee;
  position: relative;
  .el-icon-circle-close {
    position: absolute;
    top: 6px;
    right: 6px;
    color: red;
    font-size: 20px;
    z-index: 10;
    cursor: pointer;
  }
}
</style>
