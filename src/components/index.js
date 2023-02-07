import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
  install(Vue, options) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
