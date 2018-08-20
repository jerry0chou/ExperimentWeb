<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="8" :offset="8">
      <el-card class="box-card">

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="inputLabName" placeholder="输入实验室名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addLab">添加实验室</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="labs"
          style="width: 100%"
          stripe
        >
          <el-table-column
            prop="lid"
            label="实验室编号"
            width="100">
          </el-table-column>

          <el-table-column
            prop="name"
            label="实验室名称"
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
                @click="editLab(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-dialog title="编辑实验室名称" :visible.sync="dialogFormVisible" center width="30%">
      <el-form>
        <el-form-item label="实验室名" label-width="70px">
          <el-input v-model="editLabName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditLab">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "Laboratory",
    components: {NavBar},
    data()
    {
      return {
        inputLabName: "",
        labs: [],
        dialogFormVisible: false,
        //编辑
        editLabName: "",
        lid: null
      }

    },
    methods: {
      async addLab()
      {

        if (this.inputLabName === '')
        {
          this.$message.error("实验室名称不能为空")
        }
        else
        {
          let params = {labName: this.inputLabName}
          const res = await http.post('/addLab', params)
          if (res.data === "success")
          {
            this.$message.success("实验室添加成功")
            this.getLabs()
          }
          else{this.$message.error(res.data)}
        }
      },
      async submitEditLab()
      {
        if (this.editLabName === "")
          this.$message.error("实验室名不能为空")
        else
        {
          let params = {
            lid: this.lid,
            editLabName: this.editLabName
          }
          const res = await http.post('/editLabName', params)
          if (res.data === "success")
          {
            this.$message.success("实验室修改成功")
            this.dialogFormVisible=false
            this.getLabs()
          }
          else
          {
            this.$message.error("添加失败")
          }
        }
      },

      editLab(index, row)
      {
        this.lid = row.lid
        this.editLabName = row.name
        this.dialogFormVisible = true
      },
      async getLabs()
      {
        let params = {}
        const res = await
          http.get('/getLabs', params)
        this.labs = res.data
      }
    },
    mounted:function ()
    {
      this.getLabs()
    }
  }
</script>

<style scoped>

</style>
