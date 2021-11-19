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
              <el-button type="danger" size="small" @click="handleDownload">
                导出excel
              </el-button>
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
            <!-- 头像显示 -->
            <el-table-column header-align="center" align="center" label="头像">
              <!-- 作用域插槽 -->
              <template #default="{ row }">
                <img
                  class="staff"
                  :src="row.staffPhoto"
                  @click="clickShowCodeDialog(row.staffPhoto)"
                />
              </template>
            </el-table-column>
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
                <el-button
                  type="text"
                  size="small"
                  @click="$router.push(`/employees/detail/${row.id}`)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="openRolesDialog(row)"
                >
                  分配角色
                </el-button>
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
    <!-- 二维码显示 -->
    <!-- 分享展示, 预览的二维码的弹层 -->
    <el-dialog
      width="300px"
      title="二维码"
      :visible="showCodeDialog"
      @close="showCodeDialog = false"
    >
      <!-- 二维码 -->
      <el-row type="flex" justify="center" align="cenrter">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
    <!-- 分配角色弹层组件化 -->
    <AssRoles ref="asRole" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>
<script>
// 基本用法
import QrCode from 'qrcode'

// dom为一个canvas的dom对象， info为转化二维码的信息
// QrCode.toCanvas(dom, info)
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入聘用形式的枚举
import EmployeeEnum from '@/api/constant/employees'
import AddForm from './components/add-employee.vue'
// 分配角色
import AssRoles from './components/assign-role.vue'
import dayjs from 'dayjs'
// import PageTools from '@/components/PageTools'
// export default {
//   components: {
//     PageTools
//   }
// }
export default {
  components: {
    AddForm,
    // 角色
    AssRoles
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
      showDialog: false,
      // 二维码
      showCodeDialog: false,
      // 分配角色
      showRoleDialog: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 分配角色
    openRolesDialog (row) {
      console.log('当前点击的成员信息', row)
      // 弹层打开就要执行数据回显但是dialog打开是异步的渲染dom时拿不到最新id，请求时也获取不到id，接口不传id会报错
      // 用ref直接拿到实例调用方法
      this.$refs.asRole.getRoleDetail(row.id)
      this.showRoleDialog = true
    },
    // 二维码
    async clickShowCodeDialog (url) {
      if (!url) return
      this.showCodeDialog = true
      // 二维码是在对话框显示之前准备好的 显示对话框时用到了二维码的数据属于异步更新
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    // 导出单页数据excel
    async handleDownload () {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      //   const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
      //   const list = this.list
      //   const data = this.formatJson(filterVal, list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: this.filename,
      //     autoWidth: this.autoWidth,
      //     bookType: this.bookType
      //   })
      //   this.downloadLoading = false
      // })
      // 懒加载js模块导入功能  excel是对象有两个函数默认导出
      const excel = await import('@/vendor/Export2Excel')
      // excel.export_json_to_excel({
      //   // 表头 必填
      //   header: ['姓名', '工资'],
      //   // 表头对应的具体数据 必填
      //   data: [
      //     ['刘备', 100],
      //     ['关羽', 500]
      //   ],
      //   // 表文件配置
      //   filename: `Excel${Date.now()}`, // 导出下载的文件名称
      //   autoWidth: true, // 导出excel列宽度是否自适应
      //   bookType: 'xlsx' // 导出生成的文件类型
      // })//以上均为测试
      // 映射关系 做表头 过滤指定数据字段
      const header = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 数组
      const newHeader = Object.keys(header)
      // 过滤
      const newData = Object.values(header)
      // 转二维数组存储到excel中
      const nwList = this.transformArray(this.list, newData)
      excel.export_json_to_excel({
        header: newHeader,
        data: nwList,
        filename: `Excel${Date.now()}`,
        autoWidth: true,
        bookType: 'xlsx'
      })
      this.downloadLoading = false
    },
    // 一维数组转二维数组
    /**
     * [{},{},{}……]====》[[],[],[]……]
     * 准备存储结果的数组
     * 遍历取到每个员工对象 并创建新数组存储为每个员工对象的指定属性值
     * 根据map映射关系 去遍历赋值
     * push到每个成员中
     * push到最终的结果newSecond
     */
    transformArray (list, newData) {
      const newSecond = []
      list.forEach(item => {
        // item是对象格式键为英文
        // 创建新的数组存储每个成员
        const newItem = []
        for (const key in item) {
          // 值是不变的
          // 指定字段
          if (newData.includes(key)) {
            // 聘用格式
            if (key === 'formOfEmployment') {
              newItem.push(this._formatEmployment(item[key]))
            } else {
              newItem.push(item[key])
            }
          }
        }
        newSecond.push(newItem)
      })
      return newSecond
    },

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
.employees-container {
  .staff {
    width: 70px;
    height: 70px;
    border-radius: 100%;
  }
}
</style>
