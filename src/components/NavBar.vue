<template>
  <div>
      <el-col :span="span" :offset="offset">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                 text-color="#409EFF">
          <el-submenu index="1" v-if="rid">
            <template slot="title">系统管理</template>
            <el-menu-item index="1-1">
              <router-link to="/user">用户管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/role">角色管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-3">
              <router-link to="/dataOp">数据备份与恢复</router-link>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="2">
            实验管理
          </el-menu-item>

          <el-menu-item index="3">
            实验数据管理
          </el-menu-item>

          <el-submenu index="4">
            <template slot="title">实验资源管理</template>
            <el-menu-item index="4-1">
              <router-link to="/device">仪器管理</router-link>
            </el-menu-item>
            <el-menu-item index="4-2">
              <router-link to="/material">材料管理</router-link>
            </el-menu-item>
            <el-menu-item index="4-3">
              <router-link to="/laboratory">实验室管理</router-link>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">报表管理</template>
            <el-menu-item index="5-1">试验次数分析</el-menu-item>
            <el-menu-item index="5-2">实验数据分析</el-menu-item>
          </el-submenu>

          <el-menu-item index="6">
            <el-tag type="success">{{roleName}}</el-tag>
          </el-menu-item>
          <el-menu-item index="7">
            <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>主页</el-dropdown-item>
                <el-dropdown-item @click.native="loginOut">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </el-col>
    <br>
  </div>
</template>

<script>
  import http from '@/api/http'

  export default {
    name: "NavBar",
    data()
    {
      return {
        activeIndex: '7',
        username: "",
        rid: false,
        span: 12,
        offset: 6,
        roleName: "实验员"
      };
    },
    methods: {
      async getUser()
      {
        let params = {
          account: this.$cookie.get('userCookie')
        }
        const res = await http.post('/getUser', params)
        if (res.data)
        {
          this.username = res.data.username
          this.roleName = res.data.roleName
          if (res.data.rid === 1)
          {
            this.rid = true //表示超级管理员
            this.span = 15
            this.offset = 5
          }
        }
      },
      loginOut()
      {
        this.$cookie.delete('userCookie')
        this.$router.push("/login")
        this.$message.success("注销成功")
      }
    },
    mounted: function ()
    {
      if (this.$cookie.get('userCookie'))
      {
        this.getUser()
      }

    }

  }
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
