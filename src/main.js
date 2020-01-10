import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入 axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// 引入jsplumb
// import jsPlumb from 'jsplumb'
// Vue.prototype.$jsPlumb = jsPlumb.jsPlumb

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
