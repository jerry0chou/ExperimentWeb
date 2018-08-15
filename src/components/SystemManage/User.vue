<template>
  <div>
    <NavBar></NavBar>

    <el-col :span="18" :offset="6">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">注册用户</el-button>
        </el-form-item>

        <el-form-item>
          <div>
            <el-button @click="toggleSelection([users[1], users[2]])">切换第二、第三行的选中状态</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12" :offset="6">
      <el-table
        ref="multipleTable"
        :data="users"
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

      <div class="block" style="margin-top: 20px">

        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="cur_page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total,sizes, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
    </el-col>
    <el-dialog title="用户编辑" :visible.sync="DialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账户" :label-width="formLabelWidth">
          <el-input v-model="form.account" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password"  v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleName" placeholder="请选择活动区域">
            <template v-for="role in roleList">
              <el-option :label="role.name" :value="role.name"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="summitUserEditForm">确 定</el-button>
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
        DialogFormVisible: false,
        form: {
          account: "",
          password:"",
          username: "",
          phone: "",
          roleName: ""
        },
        formLabelWidth: '120px',
        filters: {name: ''},
        users: [],
        multipleSelection: [],
        count: 0,
        per_page: 5,
        cur_page: 1,
        roleList: []
      }
    },
    methods: {
      async postUserEditForm()
      {
        let params = {
          account: this.form.account,
          username: this.form.username,
          phone: this.form.phone,
          roleName: this.form.roleName,
          password:this.form.password
        }
        const res = await http.post('/summitUserEditForm', params)
        if(res.data==="success")
          this.getAllUser(this.cur_page, this.per_page)
        this.$message.success("修改成功")
      },
      summitUserEditForm()
      {
        this.postUserEditForm()
        this.DialogFormVisible = false
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
      toggleSelection(rows)
      {
        if (rows)
        {
          rows.forEach(row =>
          {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else
        {
          this.$refs.multipleTable.clearSelection();
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
      // async getRoleList()
      // {
      //    let params = {}
      //   const res = await http.post('/getRoleList', params)
      //   this.roleList=res.data
      //   console.log(res.data)
      // }.
      handleEdit: function (index, row)
      {

        this.form.account = row.account
        this.form.username = row.username
        this.form.phone = row.phone
        this.form.roleName = row.roleName
        this.form.password=row.password
        console.log("password=",row.password)
        this.DialogFormVisible = true
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
