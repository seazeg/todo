<template>
  <transition name="component-fade" mode="out-in">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </transition>
</template>

<script>
  import {
    ipcRenderer
  } from 'electron'
  import {
    local
  } from './libs/local'
  export default {
    name: 'egtime',
    methods: {
      reinit() {
        let _this = this
        let todolist = _this.$store.state.Counter.todolist;
        for (let item of todolist) {
          if (item.status == 0 && !item.isRecover) {
            if (item.times == '单次') {
              ipcRenderer.send('timedTask-message', {
                id: item.id,
                title: item.title,
                date: _this.$moment(item.remindDate).format('YYYY-MM-DD HH:mm')
              })
            } else {
              if (_this.$moment(item.remindDate).isBefore(new Date())) {
                // let diff = _this.$moment(item.remindDate).diff(new Date(), 'minutes');
                let date = item.remindDate = _this.$moment(item.remindDate).add(1, 'days').format('YYYY-MM-DD HH:mm');
                ipcRenderer.send('timedTask-message', {
                  id: item.id,
                  title: item.title,
                  date: date
                })

              } else {
                ipcRenderer.send('timedTask-message', {
                  id: item.id,
                  title: item.title,
                  date: _this.$moment(item.remindDate).format('YYYY-MM-DD HH:mm')
                })
              }
            }
          }
        }
      }
    },
    created() {
      this.$store.commit('setTodolist', local.getData('todolist'))
      this.$store.commit('setMenuList', local.getData('menuList'))
    },
    mounted() {
      //重启APP后初始化定时任务
      let _this = this
      _this.reinit()
      ipcRenderer.on('reinit', (event, message) => {
        if (message) {
          console.log(11);
          _this.reinit()
        }
      })



    }
  }
</script>
<style lang="less">
  @import './assets/fonts/iconfont.css';
  @import './assets/less/base.less';
  @import './assets/less/theme.less';
</style>