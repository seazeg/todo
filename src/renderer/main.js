import Vue from 'vue'
import 'iview/dist/styles/iview.css';
import App from './App'
import router from './router'
import moment from 'moment'
import {local} from './libs/local'
import './components/'
import './libs/directive'
import store from './store/'
import VueDND from 'awe-dnd'



Vue.use(VueDND)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.prototype.$moment = moment;

local.initData();

global.vm = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')