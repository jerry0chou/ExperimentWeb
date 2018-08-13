<template>
  <div>
    <b-container>
      <b-row>

        <b-col cols="10" offset="1">
          <hr>
          <b-nav pills>
            <b-nav-item v-if="rid">系统管理</b-nav-item>
            <b-nav-item active>实验管理</b-nav-item>
            <b-nav-item>实验数据管理</b-nav-item>
            <b-nav-item-dropdown id="nav7_ddown" text="实验资源管理" extra-toggle-classes="nav-link-custom" right>
              <b-dropdown-item>one</b-dropdown-item>
              <b-dropdown-item>two</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item>three</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item>报表管理</b-nav-item>

            &nbsp;&nbsp;&nbsp;
            <b-nav-item>
              <b-dropdown right split variant="outline-success" :text="username" size="sm" align="right">
                <b-dropdown-item>主页</b-dropdown-item>
                <b-dropdown-item @click="loginOut">注销</b-dropdown-item>
              </b-dropdown>
            </b-nav-item>
          </b-nav>
          <hr>
        </b-col>

      </b-row>
    </b-container>

  </div>
</template>

<script>
  import TabNav from "element-ui/packages/tabs/src/tab-nav";
  import http from '@/api/http'

  export default {

    name: "NavBar",
    components: {TabNav},
    data()
    {
      return {
        username: "",
        rid: false
      }
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
          if (res.data.rid === 1)
          {
            this.rid = true //表示超级管理员
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
      this.getUser()
    }
  }
</script>

<style scoped>

</style>
