import Vue from 'vue'
import Router from 'vue-router'
import subWindow from './subWindow'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.NODE_ENV === 'development'?null:__dirname,
  routes: [
    ...subWindow,
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/entry',
      name: 'main-entry',
      component: require('@/components/main/MainEntry').default
    }
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})
