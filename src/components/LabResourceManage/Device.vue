<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="18" :offset="3">
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item>
            <el-input style="width: 450px" placeholder="请输入内容" v-model="content" class="input-with-select">
              <el-select v-model="selectType" style="width: 120px" slot="append" placeholder="请选择">
                <el-option label="仪器名称" value="name"></el-option>
                <el-option label="仪器型号" value="category"></el-option>
                <el-option label="生产厂家" value="manufacturer"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryContent">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addAppliance">新增仪器</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="appliances"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            sortable
            prop="aid"
            label="编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="仪器名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="category"
            label="仪器型号"
            width="130"
          >
          </el-table-column>

          <el-table-column
            prop="manufacturer"
            label="生产厂家">
          </el-table-column>

          <el-table-column
            prop="note"
            label="备注">
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
        <el-form-item label="编号" :label-width="formLabelWidth" v-show="aidVisible">
          <el-input v-model="form.aid" auto-complete="off" disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="仪器名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="仪器型号" :label-width="formLabelWidth">
          <el-input v-model="form.category" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" :label-width="formLabelWidth">
          <el-input v-model="form.manufacturer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDiaglog">取 消</el-button>
        <el-button type="primary" @click="submitApplianceForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "Device",
    components: {NavBar},
    data()
    {
      return {
        // 搜索
        content: '',
        selectType: 'name',
        multipleSelection: [],
        queryEnabled: false,

        appliances: [],
        // 上方栏


        // 弹窗属性
        dialogname: "仪器编辑",
        aidVisible: true,
        DialogFormVisible: false,
        formLabelWidth: '120px',

        form: {
          aid: null,
          category: "",
          manufacturer: "",
          name: "",
          note: ""
        },

        // 分页
        paginationVisible: true,
        count: 0,
        per_page: 5,
        cur_page: 1,

      }
    },
    methods: {
      cancelDiaglog()
      {
        if (this.dialogname === "新增仪器")
        {
          this.dialogname = "仪器编辑"
          this.aidVisible = true
        }
        this.DialogFormVisible = false
      },
      async postApplianceEditForm()
      {
        let params = {
          appliance: JSON.stringify(this.form)
        }
        const res = await
          http.post('/submitApplianceEditForm', params)
        if (res.data === "success")
        {
          this.getAppliances(this.cur_page, this.per_page)
          this.$message.success("修改成功")
          this.DialogFormVisible = false
        }
      },
      async postApplianceAddForm()
      {
        let params = {
          appliance: JSON.stringify(this.form)
        }
        const res = await
          http.post('/submitApplianceAddForm', params)
        if (res.data === "success")
        {
          this.getAppliances(this.cur_page, this.per_page)
          this.$message.success("新增仪器成功")
          this.DialogFormVisible = false
        }
      },
      submitApplianceForm()
      {
        if (this.dialogname === "新增仪器")
        {
          this.postApplianceAddForm()
        }
        else
        {
          this.postApplianceEditForm()
        }
      },
      async postqueryContent(page, per_page)
      {
        let params = {
          selectType: this.selectType,
          content: this.content,
          page: page,
          per_page: per_page
        }
        const res = await
          http.post('/appllianceQueryContent', params)
        this.appliances = res.data.appliances
        this.count = res.data.count
      },
      queryContent()
      {
        if (this.content === '')
        {
          this.queryEnabled = false
          this.page = 1
          this.getAppliances(1, this.per_page)
        }
        else
        {
          this.queryEnabled = true
          this.postqueryContent(1, this.per_page)
        }
      },
      addAppliance()
      {
        this.form.aid = null
        this.form.category = ''
        this.form.manufacturer = ''
        this.form.name = ''
        this.form.note = ''
        this.aidVisible = false
        this.dialogname = "新增仪器"
        this.DialogFormVisible = true
      },
      async batchDelete()
      {
        let aidList = []
        this.multipleSelection.forEach(appliance => aidList.push(appliance.aid))
        let params = {
          aidList: JSON.stringify(aidList)
        }
        if (aidList.length == 0)
        {
          this.$message.error("你什么都没有选择")
        } else
        {
          const res = await
            http.post('/applianceBatchDelete', params)
          if (res.data === "success")
          {
            this.$message.success("批量删除成功")
            if (this.count % this.per_page == 1)
            {
              this.getAppliances(this.cur_page - 1, this.per_page)
            }
            else
            {
              this.getAppliances(this.cur_page, this.per_page)
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
      async removeAppliance(aid)
      {
        //alert(account)
        let params = {
          aid: aid,
        }
        const res = await http.post('/removeAppliance', params)
        if (res.data === "success")
        {
          this.$message({
            message: '删除成功',
            type: 'success'
          });

          if (this.count % this.per_page == 1)
          {
            this.getAppliances(this.cur_page - 1, this.per_page)
          }
          else
          {
            this.getAppliances(this.cur_page, this.per_page)
          }
        }
      },
      handleDelete(index, row)
      {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() =>
        {
          this.removeAppliance(row.aid)
        })
      },
      handleSizeChange(val)
      {
        this.per_page = val
        if (this.queryEnabled == false)
          this.getAppliances(this.cur_page, val)
        else
          this.postqueryContent(this.cur_page, val)
      },
      handleCurrentChange(val)
      {
        this.cur_page = val
        if (this.queryEnabled == false)
          this.getAppliances(val, this.per_page)
        else
          this.postqueryContent(val, this.per_page)
      },
      async getAppliances(page, per_page)
      {
        let params = {
          page: page,
          per_page: per_page
        }
        const res = await http.post('/getAppliances', params)
        if (res.data != "error")
        {
          this.appliances = res.data.appliances
          this.count = res.data.count
        }
      },
    },
    mounted: function ()
    {
      this.getAppliances(this.cur_page, this.per_page)
    }
  }
</script>

<style scoped>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
