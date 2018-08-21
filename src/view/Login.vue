<template>
  <el-row >
    <br><br><br><br>
    <el-col :span="8" :offset="8" >
       <el-card class="box-card">
      <el-form status-icon ref="ruleForm2"  class="demo-ruleForm">
        <el-form-item align="center">
          <h4>电池实验数据管理系统</h4>
        </el-form-item>
        <el-form-item prop="account">
          <el-input v-model="account">
            <template slot="prepend">账号</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="password" auto-complete="off">
            <template slot="prepend">密码</template>
          </el-input>
        </el-form-item>

        <el-form-item align="center">
          <el-button type="primary" round @click="submitForm">提交</el-button>
          <el-button type="warning" round @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
       </el-card>
    </el-col>
  </el-row>
</template>
<script>
  import http from '@/api/http'

  export default {
    name: 'Login',
    data()
    {
      return {
        account: "",
        password: ""
      }
    },
    methods: {
      async login()
      {
        let data = {
          account: this.account,
          password: this.password
        }
        const res = await http.post('/login', data)
        if (res.data === "success")
        {
          // alert('请求成功'+res.data)
          this.$message.success("登陆成功")
          this.$cookie.set('userCookie', data.account, 1);
          this.$router.push("/")
        }
        else
        {
          this.$message.info("账号密码错误")
        }
      },
      submitForm()
      {
        if (this.account === '')
        {
          this.$message.error('账号不能为空')
        }
        else if (this.password === '')
        {
          this.$message.error('密码不能为空')
        }
        else if (this.account && this.password)
        {
          this.login()
        }
      },
      resetForm()
      {
        this.account = ""
        this.password = ""
      }

    }

  }
</script>
