<template>
  <transition name="component-fade" mode="out-in">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </transition>
</template>

<script>
  export default {
    name: 'egtime'
  }
</script>
<style lang="less">
  @import './assets/fonts/iconfont.css';
  @import './assets/less/base.less';
  @import './assets/less/theme.less';
</style>