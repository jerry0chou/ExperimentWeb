import Vue from 'vue'
import Router from 'vue-router'
import Lab from '@/view/Lab'
import Login from '@/view/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lab',
      component: Lab
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
