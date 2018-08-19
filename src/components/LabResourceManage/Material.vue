<template>
  <div>
    <NavBar></NavBar>
    <el-col :span="18" :offset="3">
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item>
            <el-input style="width: 450px" placeholder="请输入内容" v-model="content" class="input-with-select">
              <el-select v-model="selectType" style="width: 120px" slot="append" placeholder="请选择">
                <el-option label="材料名称" value="name"></el-option>
                <el-option label="纯度" value="purity"></el-option>
                <el-option label="生产厂家" value="manufacturer"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryContent">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addMaterial">新增材料</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="materials"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            sortable
            prop="mid"
            label="编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="材料名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="purity"
            label="纯度"
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
        <el-form-item label="编号" :label-width="formLabelWidth" v-show="midVisible">
          <el-input v-model="form.mid" auto-complete="off" disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="材料名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="纯度" :label-width="formLabelWidth">
          <el-input v-model="form.purity" auto-complete="off"></el-input>
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
        <el-button type="primary" @click="submitMaterialForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import http from '@/api/http'

  export default {
    name: "Material",
    components: {NavBar},
    data()
    {
      return {
        // 搜索
        content: '',
        selectType: 'name',
        multipleSelection: [],
        queryEnabled: false,

        materials: [
          {mid: 1, name: "12", purity: "123", manufacturer: "2323", note: "4"},
        ],

        // 弹窗属性
        dialogname: "材料编辑",
        midVisible: true,
        DialogFormVisible: false,
        formLabelWidth: '120px',

        form: {
          mid: null,
          purity: "",
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
        this.DialogFormVisible = false
        if (this.dialogname === "新增材料")
        {
          this.dialogname = "材料编辑"
          this.midVisible = true
        }
      },
      async postMaterialEditForm()
      {
        let params = {
          material: JSON.stringify(this.form)
        }
        const res = await
          http.post('/submitMaterialEditForm', params)
        if (res.data === "success")
        {
          this.getMaterials(this.cur_page, this.per_page)
          this.$message.success("修改成功")
          this.DialogFormVisible = false
        }
      },
      async postMaterialAddForm()
      {
        let params = {
          material: JSON.stringify(this.form)
        }
        const res = await
          http.post('/submitMaterialAddForm', params)
        if (res.data === "success")
        {
          this.getMaterials(this.cur_page, this.per_page)
          this.$message.success("新增材料成功")
          this.DialogFormVisible = false
        }
      },
      submitMaterialForm()
      {
        if (this.dialogname === "新增材料")
        {
          this.postMaterialAddForm()
        }
        else
        {
          this.postMaterialEditForm()
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
          http.post('/materialQueryContent', params)
        this.materials = res.data.materials
        this.count = res.data.count
      },
      queryContent()
      {
        if (this.content === '')
        {
          this.queryEnabled = false
          this.page = 1
          this.getMaterials(1, this.per_page)
        }
        else
        {
          this.queryEnabled = true
          this.postqueryContent(1, this.per_page)
        }
      },
      addMaterial()
      {
        this.form.mid = null
        this.form.purity = ''
        this.form.manufacturer = ''
        this.form.name = ''
        this.form.note = ''
        this.midVisible = false
        this.dialogname = "新增材料"
        this.DialogFormVisible = true
      },
      async batchDelete()
      {
        let midList = []
        this.multipleSelection.forEach(material => midList.push(material.mid))
        console.log(midList)
        let params = {
          midList: JSON.stringify(midList)
        }
        if (midList.length == 0)
        {
          this.$message.error("你什么都没有选择")
        } else
        {
          const res = await
            http.post('/materialBatchDelete', params)
          if (res.data === "success")
          {
            this.$message.success("批量删除成功")
            this.getMaterials(this.cur_page, this.per_page)
          }
        }
      },
      handleSelectionChange(val)
      {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
      handleEdit(index, row)
      {
        this.form = JSON.parse(JSON.stringify(row)) // 深度拷贝
        this.DialogFormVisible = true
      },
      async removeMaterial(mid)
      {
        let params = {
          mid: mid,
        }
        const res = await http.post('/removeMaterial', params)
        if (res.data === "success")
        {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getMaterials(this.cur_page, this.per_page)
        }
      },
      handleDelete(index, row)
      {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() =>
        {
          this.removeMaterial(row.mid)
        })
      },
      handleSizeChange(val)
      {
        this.per_page = val
        if (this.queryEnabled == false)
          this.getMaterials(this.cur_page, val)
        else
        this.postqueryContent(this.cur_page, val)
      },
      handleCurrentChange(val)
      {
        this.cur_page = val
        if (this.queryEnabled == false)
          this.getMaterials(val, this.per_page)
        else
          this.postqueryContent(val, this.per_page)
      },
      async getMaterials(page, per_page)
      {
        let params = {
          page: page,
          per_page: per_page
        }
        const res = await http.post('/getMaterials', params)
        if (res.data != "error")
        {
          this.materials = res.data.materials
          this.count = res.data.count
        }
      },
    },
    mounted: function ()
    {
      this.getMaterials(this.cur_page, this.per_page)
    }
  }
</script>

<style scoped>

</style>
