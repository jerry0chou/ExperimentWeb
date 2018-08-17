<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="8" :offset="8">
      <el-card class="box-card">

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="inputRoleName" placeholder="输入角色名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addRole">添加角色</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="roles"
          style="width: 100%"
          stripe
        >
          <el-table-column
            prop="rid"
            label="角色编号"
            width="100">
          </el-table-column>

          <el-table-column
            prop="name"
            label="角色名称"
            width="220">
            <template slot-scope="scope">
              <el-tag disable-transitions>
                {{scope.row.name}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                round
                @click="editRole(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
    </el-col>
    <el-dialog title="编辑角色名" :visible.sync="dialogFormVisible" center width="25%">
      <el-form>
        <el-form-item label="角色名" label-width="60px">
          <el-input v-model="editRoleName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "Role",
    components: {NavBar},
    data()
    {
      return {
        inputRoleName: "",
        roles: [],
        dialogFormVisible: false,
        //编辑
        editRoleName: "",
        rid: null
      }

    },
    methods: {
      async submitEditRole()
      {
        if (this.editRoleName === "")
          this.$message.error("角色名不能为空")
        else
        {
          let params = {
            rid: this.rid,
            editRoleName: this.editRoleName
          }
          const res = await http.post('/editRoleName', params)
          if (res.data === "success")
          {
            this.$message.success("角色修改成功")
            this.dialogFormVisible=false
            this.getAllRole()
          }
          else
          {
            this.$message.error("添加失败")
          }
        }
      },
      editRole: function (index, row)
      {
        this.rid = row.rid
        this.editRoleName = row.name
        this.dialogFormVisible = true
      },
      async getAllRole()
      {
        let params = {}
        const res = await
          http.get('/getAllRole', params)
        this.roles = res.data
      }
      ,
      async addRole()
      {

        if (this.inputRoleName === '')
        {
          this.$message.error("角色名称不能为空")
        }
        else
        {
          let params = {roleName: this.inputRoleName}
          const res = await http.post('/addRole', params)
          if (res.data === "success")
          {
            this.$message.success("角色添加成功")
            this.getAllRole()
          }
          this.$message.error(res.data)
        }
      }
    }
    ,
    mounted: function ()
    {
      this.getAllRole()
    }
  }
</script>

<style scoped>

</style>
