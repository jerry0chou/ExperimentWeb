<template>
  <div>
    <!--<b-container>-->
      <b-row >
        <b-col :cols="cols" :offset="offset">
          <!--<hr>-->
          <b-nav>
            <!--<b-nav-item v-if="rid">系统管理</b-nav-item>-->
            <b-nav-item-dropdown v-if="rid" id="nav7_ddown" text="系统管理" extra-toggle-classes="nav-link-custom" right>
              <b-dropdown-item>
                <b-link to="User">用户管理</b-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <b-link to="Role">角色管理</b-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <b-link to="DataOp">数据备份与恢复</b-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>


            <b-nav-item>实验管理</b-nav-item>

            <b-nav-item>实验数据管理</b-nav-item>

            <b-nav-item-dropdown id="nav7_ddown" text="实验资源管理" extra-toggle-classes="nav-link-custom" right>
              <b-dropdown-item>
                <b-link to="Device">设备管理</b-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <b-link to="Material">材料管理</b-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <b-link to="Laboratory">实验室管理</b-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown id="nav7_ddown" text="报表管理" extra-toggle-classes="nav-link-custom" right>
              <b-dropdown-item>实验次数分析</b-dropdown-item>
              <b-dropdown-item>实验数据分析</b-dropdown-item>
            </b-nav-item-dropdown>


            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b-nav-item>
              <b-dropdown right split variant="outline-success" :text="username" size="sm" align="right">
                <b-dropdown-item>主页</b-dropdown-item>
                <b-dropdown-item @click="loginOut">注销</b-dropdown-item>
              </b-dropdown>
            </b-nav-item>
            <p style="margin-top:12px;"><b-badge variant="success">{{roleName}}</b-badge></p>
          </b-nav>

        </b-col>
      </b-row>
    <div  style="margin-top: 20px">
    </div>
    <!--</b-container>-->

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
        rid: false,
        cols:8,
        offset:2,
        roleName:"实验员"
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
          this.roleName=res.data.roleName
          if (res.data.rid === 1)
          {
            this.rid = true //表示超级管理员
            this.cols=11
            this.offset=1
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
      console.log(this.$cookie.get('userCookie'))
      if (this.$cookie.get('userCookie'))
      {
        this.getUser()
      }

    }
  }
</script>

<style scoped>

</style>
