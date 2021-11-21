import PageTools from './PageTools'
// 导入
import UploadExcel from './UploadExcel'
// 头像上传
import UploadImg from './UploadImg'
// 全屏
import ScreenFull from './ScreenFull'
// 多语言化
import Lang from './Lang'
const components = [PageTools, UploadExcel, UploadImg, ScreenFull, Lang]
export default {
  install (Vue) {
    components.forEach(cp => {
      Vue.component(cp.name, cp)
    })
  }
}
