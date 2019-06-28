//组件全局注册
import Vue from 'vue'
import header from './layout-header.vue'
import container from './layout-container.vue'
import side from './layout-side.vue'
import main from './layout-main.vue'

Vue.component(header.name, header);
Vue.component(container.name, container);
Vue.component(side.name, side);
Vue.component(main.name, main);


import {
    Input,
    DatePicker,
    Checkbox,
    Message,
    Select,
    Option,
    Modal,
    Form,
    FormItem,
    Row,
    Col,
    Notice,
    Badge
} from 'iview';




Vue.component('Input', Input);
Vue.component('DatePicker', DatePicker);
Vue.component('Checkbox', Checkbox);
Vue.component('Select',Select)
Vue.component('i-select',Select)
Vue.component('Option',Option)
Vue.component('i-option',Option)
Vue.component('Modal',Modal)
Vue.component('Form',Form)
Vue.component('FormItem',FormItem)
Vue.component('Row',Row)
Vue.component('Col',Col)
Vue.component('Badge',Badge)

Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
Vue.prototype.$Notice = Notice