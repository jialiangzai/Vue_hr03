<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="form.id ? '编辑部门' : '新增部门'"
    :visible="showDialog"
    @close="close"
  >
    <el-form ref="addForm" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <!-- 必须要有option -->
          <el-option
            v-for="its in peoples"
            :key="its.id"
            :label="its.username"
            :value="its.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="small" @click="submitL">确定</el-button>
      <!-- 取消的话要子传父避免触发两次close事件 孙不可修改爷爷的数据-->
      <el-button size="small" @click="$emit('close-dialog', false)">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 操作部门对象
    currDept: {
      type: Object,
      default: () => ({})
    },
    listAll: {
      type: Array,
      default: () => []
    }
  },
  data () {
    // 自定义校验函数形式
    const validateCode = (rules, value, callback) => {
      // 遍历所有节点部门的code和输入的value比较 也要排除自身
      // 抽离
      let flag
      if (this.form.id) {
        // 仅限编辑
        flag = this.listAll.some(item => item.code === value && value !== this.currDept.code)
      } else {
        flag = this.listAll.some(item => item.code === value)
      }
      // 遍历所有部门数据匹配
      if (flag) {
        callback(new Error('当前code码重复'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 管理负责人
      peoples: [],
      // 校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, trriger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, trriger: ['blur', 'change'] },
          // 全局校验排重
          { validator: validateCode, trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门编码要求1-50个字符', trigger: 'blur' }],

        introduce: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' },
          { min: 1, max: 300, trriger: ['blur', 'change'] }
        ]
      }
    }
  },
  mounted () {
    this.hGetEmployeeSimple()
  },

  methods: {
    // 编辑
    async getDepart (id) {
      const data = await getDepartDetail(id)
      this.form = data
    },
    close () {
      this.$emit('close-dialog', false)
      // 清空数据和状态
      this.$refs.addForm.resetFields()
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async hGetEmployeeSimple () {
      this.peoples = await getEmployeeSimple()
      // console.log('负责人', this.peoples)
    },
    // 整体校验
    submitL () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return
        } else if (this.form.id) {
          // 编辑
          await updateDepartments(this.form)
          this.$message.success('更新成功')
        } else {
          // 新增
          // 表示可以提交了 || 顶级部门pid传空（公司下）
          await addDepartments({ ...this.form, pid: this.currDept.id || '' })
          this.$message.success('新增成功')
        }
        // 更新列表
        this.$emit('update-depart')
        this.$emit('close-dialog')
      })
    }
  }
}
</script>
