<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <PageTools>
            <!-- 插入到left插槽位置 -->
            <template #left>
              <span>总记录数：{{ total }}条</span>
            </template>
            <!-- 插入到right插槽位置 -->
            <template #right>
              <el-button
                type="warning"
                size="small"
                @click="$router.push('/import')"
              >
                导入excel
              </el-button>
              <el-button type="danger" size="small">导出excel</el-button>
              <el-button type="primary" size="small" @click="showDialog = true">
                新增员工
              </el-button>
            </template>
          </PageTools>
        </div>
        <div>
          <!-- table列表 -->
          <el-table
            border
            :data="list"
            :default-sort="{ prop: 'workNumber', order: 'descending' }"
          >
            <el-table-column sortable type="index" label="序号" />
            <el-table-column prop="username" label="姓名" />
            <el-table-column sortable prop="workNumber" label="工号" />
            <el-table-column prop="formOfEmployment" label="聘用形式">
              <!-- 通过插槽自定义数据 -->
              <template #default="{ row }">
                {{ _formatEmployment(row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column sortable prop="timeOfEntry" label="入职时间">
              <template #default="{ row }">
                {{ formatDate(row.timeOfEntry) }}
              </template>
            </el-table-column>
            <el-table-column prop="username" label="账户状态">
              <!-- 状态 -->
              <el-switch
                v-model="qys"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template #default="{ row }">
                <el-button type="text" size="small">查看</el-button>
                <el-button type="text" size="small">分配角色</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="hDelEmployee(row.id)"
                >
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
            <el-pagination
              layout="prev,pager,next,sizes"
              background
              :page-size="query.size"
              :total="total"
              :pager-count="9"
              :current-page="query.page"
              :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
              @size-change="ChangeSize"
              @current-change="ChangePage"
            />
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 新增员工对话框 -->
    <AddForm
      :show-dialog="showDialog"
      @close-dialog="closeDialog"
      @updateList="getList"
    />
  </div>
</template>
<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入聘用形式的枚举
import EmployeeEnum from '@/api/constant/employees'
import AddForm from './components/add-employee.vue'
import dayjs from 'dayjs'
// import PageTools from '@/components/PageTools'
// export default {
//   components: {
//     PageTools
//   }
// }
export default {
  components: {
    AddForm
  },
  data () {
    return {
      list: [],
      // 页码
      query: {
        page: 1, size: 5
      },
      total: 0,
      // 展示状态
      qys: true,
      // 枚举
      EmployeeEnum,
      // 子组件对话框
      showDialog: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 关闭新增
    closeDialog () {
      this.showDialog = false
    },
    // 删除
    async hDelEmployee (id) {
      // 清空最后一页页码正常但是数据不对
      try {
        await this.$confirm('你确认要删除么?', '温馨提示')
        // 清空最后一页拿到最新的页数
        // 总数/每页条数=页数-1 如果除不尽就要向上取整
        const newPage = Math.ceil((this.total - 1) / this.query.size)
        // 和之前页数对比 =》如果大于最新，重新赋值
        if (this.query.page > newPage) {
          // 发送的请求是清空之前的页码
          this.query.page = newPage
          await delEmployee(id)
        } else {
          // 正常的删除
          await delEmployee(id)
        }
        this.$message.success('删除员工成功')
        this.getList()
      } catch (error) {
        console.log(error)
      }
    },
    // 格式入职时间
    formatDate (value, str = 'YYYY-MM-DD') {
      return dayjs(value).format(str)
    },
    // 聘用形式枚举
    _formatEmployment (type) {
      // console.log(EmployeeEnum)
      // hireType数组
      const hireType = EmployeeEnum.hireType
      const map = {}
      hireType.forEach(item => {
        map[item.id] = item.value
      })
      return map[type]
    },
    async getList () {
      const { total, rows } = await getEmployeeList(this.query)
      // console.log(rows)
      this.total = total
      this.list = rows
    },
    // 页码
    ChangeSize (newSize) {
      // console.log(newSize)
      this.query.size = newSize
      this.getList()
    },
    ChangePage (newPage) {
      // console.log(newPage)
      this.query.page = newPage
      this.getList()
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
