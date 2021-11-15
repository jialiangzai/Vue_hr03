<template>
  <div class="department-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- card title -->
        <div slot="header">
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>{{ company.name }}</span>
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
                      <!-- 注意必须加()因为不加默认是事件对象,加了表示空数据但有-->
                      <el-dropdown-item @click.native="addDept()">
                        添加子部门
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!-- card body -->
        <div>
          <el-tree
            ref="tree"
            :data="list"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <!-- 作用域插槽 data拿到的是每一个子节点的对象 -->
            <!--
      什么时候用到作用域插槽？父组件中如果想使用子组件中的数据进行自定义内容的渲染 (table 单元格数据渲染)
    -->
            <template #default="{ data }">
              <el-row style="width: 100%">
                <el-col :span="20">
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <el-row type="flex" justify="end">
                    <!-- 两个内容 -->
                    <el-col>{{ data.manager }}</el-col>
                    <el-col>
                      <!-- 下拉菜单 element -->
                      <el-dropdown>
                        <span> 操作<i class="el-icon-arrow-down" /> </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addDept(data)">
                            添加子部门
                          </el-dropdown-item>
                          <el-dropdown-item>编辑部门</el-dropdown-item>
                          <el-dropdown-item @click.native="delDep(data)">
                            删除部门
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </div>
      </el-card>
    </div>
    <!-- 新增 -->
    <AddDept
      :show-dialog="showDialog"
      :curr-dept="currDept"
      :list-all="listAll"
      @update-depart="getDep"
      @close-dialog="showDialog = $event"
    />
  </div>
</template>

<script>

import { getDepartments, delDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    AddDept
  },
  data () {
    return {
      // 依赖一份树形数据
      list: [],
      // 公司
      company: { name: '', manger: 'CEO' },
      // 定义树形结构的属性名
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 新增窗体
      showDialog: false,
      // 要新增的对象
      currDept: null,
      // 平铺的全部部门
      listAll: []
    }
  },
  created () {
    this.getDep()
  },
  methods: {
    // 新增
    addDept (currentDep) {
      this.showDialog = true
      console.log(currentDep)
      // 存储当前操作部门数据
      this.currDept = currentDep
    },
    handleNodeClick (curr) {
      // console.log(curr)
    },
    // 获取公司架构
    async getDep () {
      const { depts, companyName } = await getDepartments()
      // 做code所有的原始节点数据部门编码在整个模块中都不允许重复
      this.listAll = depts
      // console.log(depts, companyName)
      // this.list = depts
      // 转换数据
      // console.table(depts)
      this.list = tranListToTreeData(depts)
      this.company.name = companyName
    },
    // 删除部门
    async delDep (data) {
      // 有子部门的提示先清空子部门
      // console.log(data)
      try {
        if (data.children && data.children.length > 0) {
          return this.$message.warning('不能直接删除父节点！')
        }
        await this.$confirm(`你确认要进行删除${data.name}么?`, '温馨提示')
        await delDepartments(data.id)
        // 删除操作成功
        await delDepartments(data.id)
        // 删除之后自动刷新
        this.getDep()
      } catch (error) {
        console.log(error)
      }
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
