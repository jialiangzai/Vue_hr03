<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="close"
  >
    <!-- 这里准备复选框 -->
    <el-checkbox-group v-model="checkRole">
      <!-- label复选框选中值；roleList数组记录选中的值 -->
      <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
        {{ role.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 底部 -->
    <template #footer>
      <el-button type="primary" size="small" @click="saveRoles">确定</el-button>
      <el-button size="small" @click="$emit('update:show-role-dialog', false)">
        取消
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
// 角色列表
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 所有角色列表
      roleList: [],
      // 当前选中的角色
      checkRole: [],
      // 更新角色时候用
      userId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 关闭
    close () {
      this.$emit('update:show-role-dialog', false)
      // 重置数组 ===》组件库自带过渡效果不用管只要不显示上一个用户的角色就行
      this.checkRole = []
    },
    // 获取全部角色
    async getRoleList () {
      const res = await getRoleList({ page: 1, pagesize: 1000 })
      this.roleList = res.rows
    },
    // 数据回显
    async getRoleDetail (id) {
      const da = await getUserDetailById(id)
      this.userId = id
      console.log(da)
      this.checkRole = da.roleIds
    },
    async saveRoles () {
      await assignRoles({
        id: this.userId,
        roleIds: this.checkRole
      })
      this.$message.success('分配角色成功')
      // 关闭弹框
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin-bottom: 20px;
}
</style>
