import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'floatbox',
      component: require('@/view/floatbox').default,
      meta:{
        keepAlive:true
      }
    },
    {
      path: '/main',
      name: 'main',
      component: require('@/view/main').default,
      meta:{
        keepAlive:true
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
