import PageTools from './PageTools'
// 导入
import UploadExcel from './UploadExcel'
const components = [PageTools, UploadExcel]
export default {
  install (Vue) {
    components.forEach(cp => {
      Vue.component(cp.name, cp)
    })
  }
}
