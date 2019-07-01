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
    created() {
      this.$store.commit('setTodolist', local.getData('todolist'))
      this.$store.commit('setMenuList', local.getData('menuList'))
    },
    mounted() {
      let _this = this
      let todolist = _this.$store.state.Counter.todolist;
      for (let item of todolist) {
        if (item.status == 0) {
          ipcRenderer.send('timedTask-message', {
            id: item.id,
            title: item.title,
            date: _this.$moment(item.remindDate).format('YYYY-MM-DD HH:mm')
          })
        }
      }
    }
  }
</script>
<style lang="less">
  @import './assets/fonts/iconfont.css';
  @import './assets/less/base.less';
  @import './assets/less/theme.less';
</style>