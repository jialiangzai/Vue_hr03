import PageTools from './PageTools'
// 导入
import UploadExcel from './UploadExcel'
// 头像上传
import UploadImg from './UploadImg'
const components = [PageTools, UploadExcel, UploadImg]
export default {
  install (Vue) {
    components.forEach(cp => {
      Vue.component(cp.name, cp)
    })
  }
}
