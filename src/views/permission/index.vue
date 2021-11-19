<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary" @click="addPer(1, '0')">
              添加权限
            </el-button>
          </el-row>
        </div>
        <!-- card body 权限点树形table列表-->
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <!-- -
              type为1时为路由页面访问权限==》根据后台系统需要控制访问的页面的新增=》显示添加
              type为2时为按钮功能操作权限==》根据需要控制当前下按钮操作(新增功能)=》不显示添加 -->

              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPer(2, row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editPermission(row.id)">
                编辑
              </el-button>
              <el-button type="text" @click="delPermission(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增 -->
    <el-dialog :visible="showDialog" title="弹层标题" @close="close">
      <el-form
        ref="addForm"
        label-width="100px"
        :rules="rules"
        :model="formData"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="savePermisAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList, addPermission, updatePermission, delPermission, getPermissionDetail
} from '@/api/permisson'
// 专树形嵌套
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data () {
    return {
      // 所有权限列表
      /**
       *
       * code: "employees"
       *  description: "用户管理菜单"
       *  enVisible: "1"
       *  id: "604f7df5f900be1850edb152"
       *  name: "员工管理"
       *  pid: "0"
       *  type: 1
       */
      list: [],
      // 新增
      showDialog: false,
      formData: {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      // 表单验证
      rules: {
        name: [{ required: true, message: '权限点名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限点标识不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '权限点描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取所有权限
    async getList () {
      const res = await getPermissionList()
      // console.log(res)
      this.list = tranListToTreeData(res)
    },
    // 关闭新增权限弹出层
    close () {
      this.showDialog = false
      // 表单重置
      this.$refs.addForm.resetFields()
      this.formData = {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    },
    // 点击新增
    addPer (type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 删除
    async delPermission (row) {
      console.log(row)
      try {
        await this.$confirm(`确定要删除${row.name}权限吗`, '温馨提示')
        if (row.children && row.children.length > 0) {
          return this.$message.warning('请先删除子权限点')
        }
        await delPermission(row.id)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑
    async editPermission (id) {
      // 数据回显
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 确认新增
    async savePermisAdd () {
      try {
        await this.$refs.addForm.validate()
        // 新增填数据 编辑改数据 点击确认调用不同接口
        if (this.formData.id) {
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        this.$message.success('操作成功')
        this.showDialog = false
        this.getList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
