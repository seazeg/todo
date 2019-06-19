import Vue from 'vue'
import 'iview/dist/styles/iview.css';
import App from './App'
import router from './router'
import egUtils from 'eg-utils'
import './components/index'



if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.prototype.egUtils = egUtils


global.vm = new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')