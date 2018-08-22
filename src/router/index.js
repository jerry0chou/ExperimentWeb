import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Login from '@/view/Login'
import User from "@/components/SystemManage/User.vue"
import Role from '@/components/SystemManage/Role.vue'
import DataOp from '@/components/SystemManage/DataOp.vue'
import Device from '@/components/LabResourceManage/Device.vue'
import Laboratory from '@/components/LabResourceManage/Laboratory.vue'
import Material from '@/components/LabResourceManage/Material.vue'
import Experiment from "@/components/ExpManage/Experiment.vue"
import ExpData from "@/components/ExpDataManage/ExpData.vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/role',
      name: 'Role',
      component: Role
    },
    {
      path: '/dataOp',
      name: 'DataOp',
      component: DataOp
    },
    {
      path: '/device',
      name: 'Device',
      component: Device
    },
    {
      path: '/laboratory',
      name: 'Laboratory',
      component: Laboratory
    },
    {
      path: '/material',
      name: 'Material',
      component: Material
    },
    {
      path: '/experiment',
      name: 'Experiment',
      component: Experiment
    },
    {
      path: '/expdata',
      name: 'ExpData',
      component: ExpData
    }
  ]
})
