//组件全局注册
import Vue from 'vue'
import header from './layout-header.vue'
import container from './layout-container.vue'
import side from './layout-side.vue'
import main from './layout-main.vue'

import {
    Input,
    DatePicker,
    Checkbox,
    Message,
    Select
} from 'iview';




Vue.component(header.name, header);
Vue.component(container.name, container);
Vue.component(side.name, side);
Vue.component(main.name, main);

Vue.component('Input', Input);
Vue.component('DatePicker', DatePicker);
Vue.component('Checkbox', Checkbox);
Vue.component('Select',Select)
Vue.prototype.$Message = Message