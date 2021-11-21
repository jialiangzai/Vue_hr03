<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
    :visible="showAssignDialog"
    @close="closeAssignDialog"
  >
    <el-tree
      ref="tree"
      :data="list"
      node-key="id"
      :props="{ label: 'name' }"
      :show-checkbox="true"
      :highlight-current="true"
      default-expand-all
      check-strictly
    ></el-tree>

    <!-- 权限点数据展示 -->
    <template #footer>
      <el-button @click="$emit('update:show-assign-dialog', false)">
        取消
      </el-button>
      <el-button type="primary" @click="savePerto">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { getRoleDetail, assignPerm } from '@/api/setting'
// 树形转换
import { tranListToTreeData } from '@/utils'
export default {
  props: {
    showAssignDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 存储所有权限列表
      list: [],
      // 已存在的权限
      checkPer: [],
      // id当前角色的id
      userId: ''
    }
  },
  mounted () {
    this.getPermissionList()
  },
  methods: {
    closeAssignDialog () {
      // 数据重置
      this.$emit('update:show-assign-dialog', false)
      this.checkPer = []
    },
    async getPermissionList () {
      const res = await getPermissionList()
      // console.table(res)
      this.list = tranListToTreeData(res)
    },
    // 回显
    async getDetail (id) {
      const { permIds } = await getRoleDetail(id)
      console.log(permIds)
      this.checkPer = permIds
      // 数据状态选中 参数就是一个数组
      this.$refs.tree.setCheckedKeys(this.checkPer)
      this.userId = id
    },
    // 确认
    async savePerto () {
      // checkPer是之前选中的
      await assignPerm({ id: this.userId, permIds: this.$refs.tree.getCheckedKeys() })
      this.$message.success('分配成功')
      this.$emit('update:showAssignDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
