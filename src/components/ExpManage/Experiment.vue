<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="20" :offset="2">
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item>
            <el-input style="width: 420px" placeholder="请输入内容" v-model="content" class="input-with-select">
              <el-select v-model="selectType" style="width: 120px" slot="append" placeholder="请选择">
                <el-option label="实验编号" value="eid"></el-option>
                <el-option label="实验名称" value="expname"></el-option>
                <el-option label="实验时间" value="date"></el-option>
                <el-option label="用户账号" value="account"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryContent">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addExperiment">新增实验</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="warning" icon="el-icon-download" circle></el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="experiments"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            sortable
            prop="eid"
            label="实验编号"
            width="100"
          >
          </el-table-column>

          <el-table-column
            prop="expname"
            label="实验名称"
          >
          </el-table-column>


          <el-table-column
            prop="labname"
            label="实验室名">
          </el-table-column>

          <el-table-column
            prop="date"
            label="实验时间"
            width="150"
            :formatter="computeDate"
          >
          </el-table-column>

          <el-table-column
            prop="status"
            label="实验状态"
            width="120"
          >
          </el-table-column>

          <el-table-column
            prop="account"
            label="用户账号"
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
        <el-form-item label="实验编号" :label-width="formLabelWidth" v-show="eidVisible">
          <el-input v-model="form.eid" auto-complete="off" disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="实验名称" :label-width="formLabelWidth">
          <el-input v-model="form.expname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="实验室名" :label-width="formLabelWidth">
          <el-select v-model="form.labname" placeholder="请选择实验室">
            <template v-for="lab in labs">
              <el-option :label="lab.name" :value="lab.lid"></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="实验时间" :label-width="formLabelWidth">
          <!--<el-input v-model="form.date" auto-complete="off"></el-input>-->
          <el-date-picker
            v-model="form.date"
            type="date"
            value-format="timestamp"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实验状态" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="未进行" value=0></el-option>
            <el-option label="正在进行" value=1></el-option>
            <el-option label="已完成" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号" :label-width="formLabelWidth">
          <!--<el-input v-model="form.account" auto-complete="off"></el-input>-->
          <el-select v-model="form.account" placeholder="请选择用户">
            <template v-for="user in users">
              <el-option :label="user.account" :value="user.uid"></el-option>
            </template>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDiaglog">取 消</el-button>
        <el-button type="primary" @click="submitExperimentForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "Experiment",
    components: {NavBar},
    data()
    {
      return {
        // 搜索
        content: '',
        selectType: 'eid',
        multipleSelection: [],
        queryEnabled: false,

        experiments: [],
        labs: [],
        users: [],
        // 分页
        paginationVisible: true,
        count: 0,
        per_page: 5,
        cur_page: 1,

        // 弹窗属性
        dialogname: "实验编辑",
        eidVisible: true,
        DialogFormVisible: false,
        formLabelWidth: '120px',

        form: {
          eid: '',
          expname: "",
          labname: "",
          date: '',
          status: 0,
          account: ""
        },
      }
    },
    methods: {
      changeDate(timestamp)
      {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        //      h = date.getHours() + ':';
        //      m = date.getMinutes() + ':';
        //      s = date.getSeconds();
        //      年 月 日 时 分 秒
        return Y + M + D;
      },
      computeDate(row, column, cellValue, index)
      {
        // return new Date(cellValue).toLocaleString().replace(/:\d{1,2}$/, ' ');
        return this.changeDate(cellValue)
      },
      cancelDiaglog()
      {
        this.DialogFormVisible = false
        if (this.dialogname === "新增实验")
        {
          this.dialogname = "实验编辑"
          this.eidVisible = true
        }
      },
      async postExperimentEditForm()
      {
        let params = {
          experiment: JSON.stringify(this.form)
        }
        const res = await
          http.post('/submitExperimentEditForm', params)
        if (res.data === "success")
        {
          this.getExperiments(this.cur_page, this.per_page)
          this.$message.success("修改成功")
          this.DialogFormVisible = false
        }
      },
      async postExperimentAddForm()
      {
        //alert("postExperimentAddForm")
        if (this.form.expname === '')
          this.$message.error("实验名称不能为空")
        else if (this.form.labname === '')
          this.$message.error("实验室名不能为空")
        else if (this.form.date === '')
          this.$message.error("日期不能为空")
        else if (this.form.status === '')
          this.$message.error("实验状态不能为空")
        else if (this.form.account === '')
          this.$message.error("用户账号不能为空")
        else
        {
          let params = {
            experiment: JSON.stringify(this.form)
          }
          const res = await
            http.post('/submitExperimentAddForm', params)
          if (res.data === "success")
          {
            this.getExperiments(this.cur_page, this.per_page)
            this.$message.success("新增实验成功")
            this.DialogFormVisible = false
          }
        }
      },
      submitExperimentForm()
      {
        if (this.dialogname === "新增实验")
        {
          this.postExperimentAddForm()
        }
        else
        {
          this.postExperimentEditForm()
        }
      },
      queryContent()
      {

      },
      addExperiment()
      {
        this.form.eid = ''
        this.form.expname = ''
        this.form.labname = ''
        this.form.date = ''
        this.form.status = ''
        this.form.account = ''

        this.eidVisible = false
        this.dialogname = "新增实验"
        this.DialogFormVisible = true
      },
      async batchDelete()
      {
        let eidList = []
        this.multipleSelection.forEach(experiment => eidList.push(experiment.eid))
        let params = {
          eidList: JSON.stringify(eidList)
        }
        if (eidList.length == 0)
        {
          this.$message.error("你什么都没有选择")
        } else
        {
          const res = await
            http.post('/experimentBatchDelete', params)
          if (res.data === "success")
          {
            this.$message.success("批量删除成功")
            if (this.count % this.per_page == 1)
            {
              this.getExperiments(this.cur_page - 1, this.per_page)
            }
            else
            {
              this.getExperiments(this.cur_page, this.per_page)
            }
          }
        }
      },
      handleSelectionChange(val)
      {
        this.multipleSelection = val;
      },
      handleEdit(index, row)
      {
        this.form = JSON.parse(JSON.stringify(row)) // 深度拷贝
        this.DialogFormVisible = true
      },
      async removeExperiment(eid)
      {
        let params = {
          eid: eid,
        }
        const res = await http.post('/removeExperiment', params)
        if (res.data === "success")
        {
          this.$message({
            message: '删除成功',
            type: 'success'
          });

          if (this.count % this.per_page == 1)
          {
            this.getExperiments(this.cur_page - 1, this.per_page)
          }
          else
          {
            this.getExperiments(this.cur_page, this.per_page)
          }
        }
      },
      handleDelete(index, row)
      {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() =>
        {
          this.removeExperiment(row.eid)
        })
      },
      handleSizeChange(val)
      {
        this.per_page = val
        // if (this.queryEnabled == false)
        this.getExperiments(this.cur_page, val)
        // else
        // this.postqueryContent(this.cur_page, val)
      },
      handleCurrentChange(val)
      {
        this.cur_page = val
        // if (this.queryEnabled == false)
        this.getExperiments(val, this.per_page)
        // else
        //   this.postqueryContent(val, this.per_page)
      },
      async getExperiments(page, per_page)
      {
        let params = {
          page: page,
          per_page: per_page
        }
        const res = await http.post('/getExperiments', params)
        if (res.data != "error")
        {
          this.experiments = res.data.experiments
          this.count = res.data.count
          this.labs = res.data.labs
          this.users = res.data.users
        }
      },
    },
    mounted: function ()
    {
      this.getExperiments(this.cur_page, this.per_page)
    }
  }
</script>

<style scoped>

</style>
