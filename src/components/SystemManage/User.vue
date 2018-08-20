<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="14" :offset="5">
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="queryname" placeholder="输入账号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryUser">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="registerUser">注册用户</el-button>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button type="danger" @click="batchDelete">批量删除</el-button>
            </div>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          :data="users"
          stripe
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :default-sort="{prop: 'account', order: 'descending'}"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="account"
            label="账户"
            sortable
            width="120">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            sortable
            width="120">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色"
            width="100"
          >
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="block" style="margin-top: 20px">
        </div>

        <div class="block" style="margin-top: 20px" v-show="paginationVisible">

          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="cur_page"
            :page-sizes="[5, 10, 15, 20,50]"
            :page-size="5"
            layout="total,sizes, prev, pager, next"
            :total="count">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <el-dialog :title="dialogname" :visible.sync="DialogFormVisible" @close='cancelDiaglog'>
      <el-form :model="form">
        <el-form-item label="账户" :label-width="formLabelWidth">
          <el-input v-model="form.account" auto-complete="off" :disabled="accountDisable"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" auto-complete="off"
                    :placeholder="placeholderVal"></el-input>
        </el-form-item>
        <el-form-item v-if="confirmPasswordStatus" label="确认密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.confirmpassword" auto-complete="off"
                    placeholder="再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleName" placeholder="请选择角色">
            <template v-for="role in roleList">
              <el-option :label="role.name" :value="role.name"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDiaglog">取 消</el-button>
        <el-button type="primary" @click="summitUserForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "User",
    components: {NavBar},
    data()
    {
      return {

        form: {
          uid: null,
          rid: null,
          account: "",
          password: "",
          confirmpassword: "",
          username: "",
          phone: "",
          roleName: ""
        },
        formLabelWidth: '120px',
        queryname: "",
        users: [],
        multipleSelection: [],
        count: 0,
        per_page: 5,
        cur_page: 1,
        roleList: [],

        // 弹窗属性
        DialogFormVisible: false,
        dialogname: "用户编辑",
        accountDisable: true,
        placeholderVal: "不输入，则密码不变",
        confirmPasswordStatus: false,
        paginationVisible: true
      }
    },
    methods: {
      async queryUser()
      {
        if (this.queryname === '')
        {
          this.paginationVisible = true
          this.getAllUser(this.cur_page, this.per_page)
        }

        else
        {
          let params = {
            account: this.queryname,
          }
          const res = await http.post('/queryUser', params)
          if (res.data !== "failure")
          {
            //alert("success")
            console.log("queryUser", res.data)
            this.users = res.data
            this.paginationVisible = false
            // this.getAllUser(this.cur_page, this.per_page)
            // this.$message.success("修改成功")
            // this.DialogFormVisible = false
          }
          else
            this.$message.error("用户未找到")
        }

      },
      async postUserEditForm()
      {
        let params = {
          uid: this.form.uid,
          account: this.form.account,
          username: this.form.username,
          phone: this.form.phone,
          roleName: this.form.roleName,
          password: this.form.password
        }
        const res = await http.post('/summitUserEditForm', params)
        if (res.data === "success")
        {
          this.getAllUser(this.cur_page, this.per_page)
          this.$message.success("修改成功")
          this.DialogFormVisible = false
        }

      },
      async postUserRegisterForm()
      {
        let params = {
          account: this.form.account,
          username: this.form.username,
          phone: this.form.phone,
          roleName: this.form.roleName,
          password: this.form.password
        }
        const res = await http.post('/summitUserRegisterForm', params)
        if (res.data === "success")
        {
          this.getAllUser(this.cur_page, this.per_page)
          this.$message.success("修改成功")

          this.form.password = ""
          this.dialogname = "用户编辑"
          this.accountDisable = true,
            this.placeholderVal = "不输入，则密码不变"
          this.confirmPasswordStatus = false
          this.DialogFormVisible = false
        }
        else this.$message.error(res.data)
      },
      registerUser()
      {
        this.form.account = ""
        this.form.username = ""
        this.form.roleName = ""
        this.form.phone = ""
        this.form.password = ""
        this.form.confirmpassword = ""
        this.dialogname = "注册用户"
        this.accountDisable = false,
          this.placeholderVal = "请输入密码"
        this.confirmPasswordStatus = true
        this.DialogFormVisible = true
      },
      summitUserForm()
      {
        if (this.dialogname === "注册用户")
        {
          if (this.form.account === "")
            this.$message.error("账户不能为空")
          else if (this.form.password === "")
            this.$message.error("密码不能为空")
          else if (this.form.password !== this.form.confirmpassword)
            this.$message.error("两次密码不一致")
          else if (this.form.username === "")
            this.$message.error("用户名不能为空")
          else if (this.form.phone === "" || this.form.phone.length !== 11)
            this.$message.error("电话号码格式不对")
          else if (this.form.roleName === "")
            this.$message.error("角色不能为空")
          else
            this.postUserRegisterForm()
        }
        else
          this.postUserEditForm()
      },
      handleSizeChange(val)
      {
        this.per_page = val
        this.getAllUser(this.cur_page, val)
      },
      handleCurrentChange(val)
      {
        //console.log(`当前页: ${val}`);
        this.cur_page = val
        this.getAllUser(val, this.per_page)
      },
      async batchDelete()
      {
        let accountLists = []
        this.multipleSelection.forEach(user => accountLists.push(user.account))
        console.log(accountLists)
        let params = {
          accountList: JSON.stringify(accountLists)
        }
        console.log("params:", params)
        const res = await http.post('/batchDelete', params)
        if (res.data === "success")
        {
          this.$message.success("批量删除成功")
          this.getAllUser(this.cur_page, this.per_page)
        }

      },
      handleSelectionChange(val)
      {
        this.multipleSelection = val;

      },
      async getAllUser(page, per_page)
      {
        let params = {
          page: page,
          per_page: per_page
        }
        const res = await http.post('/getAllUser', params)
        if (res.data != "error")
        {
          this.users = res.data.users
          this.count = res.data.count
          this.roleList = res.data.roleList
          console.log(res.data)
        }
      },
      async removeUser(account)
      {
        //alert(account)
        let params = {
          account: account,
        }
        const res = await http.post('/removeUser', params)
        if (res.data === "success")
        {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getAllUser(this.cur_page, this.per_page)
        }
      },
      handleDelete: function (index, row)
      {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() =>
        {
          this.removeUser(row.account)
        })
      },
      handleEdit: function (index, row)
      {
        this.form.uid = row.uid
        this.form.rid = row.rid
        this.form.account = row.account
        this.form.username = row.username
        this.form.phone = row.phone
        this.form.roleName = row.roleName
        console.log("password=", row.password)
        console.log("row=", row)

        this.DialogFormVisible = true
      },
      cancelDiaglog()
      {
        if (this.dialogname === "注册用户")
        {
          this.dialogname = "用户编辑"
          this.confirmPasswordStatus = false
        }
        this.DialogFormVisible = false
      }
    },
    mounted: function ()
    {
      //this.getRoleList()
      this.getAllUser(this.cur_page, this.per_page)
    }
  }
</script>

<style scoped>

</style>
