<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button icon="el-icon-plus" size="small" type="primary">
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roleList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next,sizes"
                background
                :page-size="query.pagesize"
                :total="total"
                :pager-count="9"
                :current-page="query.page"
                :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                @size-change="ChangeSize"
                @current-change="ChangePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 新增页签 -->
          <el-tab-pane label="天使">
            <h1>凯尔</h1>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getRoleList, deleteRole } from '@/api/setting'
export default {
  data () {
    return {
      // 存储角色信息
      roleList: [],
      query: { page: 1, pagesize: 5 },
      total: 0
    }
  },
  mounted () {
    this.getRoleLists()
  },
  methods: {
    // 获取
    async getRoleLists () {
      const { total, rows } = await getRoleList(this.query)
      console.log(rows)
      this.roleList = rows
      this.total = total
    },
    // 页码
    ChangeSize (newSize) {
      // console.log(newSize)
      this.query.pagesize = newSize
      this.getRoleLists()
    },
    ChangePage (newPage) {
      // console.log(newPage)
      this.query.page = newPage
      this.getRoleLists()
    },
    // 删除
    async delRole (data) {
      // console.log(data)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示')
        await deleteRole(data.id)
        this.$message.success('删除角色成功')
        // 刷新
        this.getRoleLists()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
