<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>批量导入员工</span>
      </div>
      <!-- card body -->
      <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
    </el-card>
  </div>
</template>

<script>
import { importEmployees } from '@/api/employees'
// 导入excel时间处理 比正常的早70年 ===?存储的是天数
import { formatExcelDate } from '@/utils/index'

export default {
  name: 'Import',
  data () {
    return {

    }
  },
  methods: {
    beforeUpload (file) {
      // 导入之前对文件的大小和格式的校验
      console.log('上传的文件信息', file)
      return true
      // 只有return true时候才会执行下面的handleSuccess
    },
    async onSuccess ({ header, results }) {
      console.log('读取的数据', { header, results })
      // excel分为表头和表头对应的数据，导入excel时候包含员工信息的数组入库，但是接口不能是中文
      // 键都是中文转英文 后天接口不能是中文
      const nwList = this.transExcelData(results)
      console.log('转为中文键的结果', nwList)
      try {
        await importEmployees(nwList)
        this.$router.back()
      } catch (error) {
        console.log(error)
      }
    },
    // 中转英文 替换每个成员信息键值不变
    transExcelData (list) {
      // 映射
      const map = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const newList = []
      list.forEach(emp => {
        // 存储英文键的对象===》替换之前中文键的对象
        const userInfo = {}
        // key此时是中文的
        for (const key in emp) {
          if (map[key] === 'timeOfEntry' || map[key] === 'correctionTime') {
            userInfo[map[key]] = formatExcelDate(emp[key], '-')
          } else {
            userInfo[map[key]] = emp[key]
          }
        }
        newList.push(userInfo)
      })
      return newList
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
