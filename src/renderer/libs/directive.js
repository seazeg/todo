import Vue from 'vue'
import moment from 'moment'

Vue.directive('dateview', {
    update: function (el, binding) {
        
        let obj = binding.value;
        if (obj.times == '单次') {
            if (moment(new Date()).isSame(obj.remindDate, 'day')) {
                el.innerText = moment(obj.remindDate).format('HH:mm')
            } else {
                el.innerText = moment(obj.remindDate).format('MM-DD')
            }
        } else if (obj.times == '每天') {
            el.innerText = moment(obj.remindDate).format('HH:mm')
        } else {
            el.innerText = moment(obj.remindDate).format('MM-DD')
        }

    }
})