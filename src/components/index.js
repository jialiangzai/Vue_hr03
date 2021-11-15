import PageTools from './PageTools'
const components = [PageTools]
export default {
  install (Vue) {
    components.forEach(cp => {
      Vue.component(cp.name, cp)
    })
  }
}
