<template>
  <div class="department-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- card title -->
        <div slot="header">
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>江苏传智播客教育科技股份有限公司</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!-- card body -->
        <div>内容</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
export default {
  data () {
    return {
      // 依赖一份树形数据
      list: [{
        name: '财务部',
        children: [
          {
            name: '财务核算部'
          },
          {
            name: '税务核算部'
          }
        ]
      }],
      // 定义树形结构的属性名
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.getDep()
  },
  methods: {
    handleNodeClick (curr) {
      console.log(curr)
    },
    // 获取公司架构
    async getDep () {
      const res = await getDepartments()
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
// 开启深度样式选择器
::v-deep .el-tree-node__content {
  margin: 6px 0;
  font-size: 14px;
}
</style>
